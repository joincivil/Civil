pragma solidity 0.4.19;

import "./RestrictedAddressRegistry.sol";

/**
@title  TCR with appeallate functionality and restrictions on application 
@author Nick Reynolds - nick@joincivil.com
@notice The RestrictedAddressTCRWithAppeals is a TCR with restrictions (contracts must have IACL
        implementation, and only the ACL superuser of a contract can apply on behalf of that contract)
        and an appeallate entity that can overturn successful challenges (challenges that would prevent 
        the listing from being whitelisted)
        "Listing" refers to the data associated with an address at any stage of the lifecycle (e.g.
        "Listing in Application", "Listing in Challenge", "Listing on Whitelist", "Denied Listing", etc).
*/
contract OwnedAddressTCRWithAppeals is RestrictedAddressRegistry {

  event AppealRequested(address indexed requester, address indexed listing);
  event AppealGranted(address indexed listing);
  event JECWhitelistedListing(address indexed listing);
  event AppealFeeSet(uint fee);
  event MakeAppealLengthSet(uint length);
  event AppealLengthSet(uint length);
  event FeeRecipientSet(address recipient);

  modifier onlyAppellate {
    require(msg.sender == appellate);
    _;
  }

  modifier onlyFeeRecipient {
    require(msg.sender == feeRecipient);
    _;
  }

  address public appellate;
  address public feeRecipient;
  uint public appealFee;
  uint public requestAppealPhaseLength = 259200; // 3 days expressed in seconds
  uint public judgeAppealPhaseLength = 1209600; // 14 days expressed in seconds

  uint public deniedAppealFees;

  /*
  @notice this struct handles the state of an appeal. It is first initialized 
          when updateStatus is called after a successful challenge.
  */
  struct Appeal {
    uint requestAppealPhaseExpiry;
    bool appealRequested;
    uint appealFeePaid;
    uint appealPhaseExpiry;
    bool appealGranted;
  }

  mapping(address => Appeal) internal appeals;
  mapping(uint => bool) public challengesOverturned;

  /**
  @dev Contructor           Sets the addresses for token, voting, parameterizer, appellate, and fee recipient
  @param tokenAddr          Address of the TCR's intrinsic ERC20 token
  @param plcrAddr           Address of a PLCR voting contract for the provided token
  @param paramsAddr         Address of a Parameterizer contract 
  @param appellateAddr      Address of appellate entity, which could be a regular user, although multisig is recommended
  @param feeRecipientAddr   Address of entity that collects fees from denied appeals
  */
  function OwnedAddressTCRWithAppeals(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr,
    address appellateAddr,
    address feeRecipientAddr)
    public RestrictedAddressRegistry(tokenAddr, plcrAddr, paramsAddr)
  {
    appellate = appellateAddr;
    feeRecipient = feeRecipientAddr;
  }

  // --------------------
  // LISTING OWNER INTERFACE:
  // --------------------

  /**
  @notice Requests an appeal for a listing that has been successfully challenged (and had state updated)
          Must be initialized and within correct application period 
          (0 < appeal.requestAppealPhaseExpiry < now) 
          and not already requested
  @param listingAddress address of listing that has been successfully challenged. Caller must be owner of listing.
  */
  function requestAppeal(address listingAddress) external {
    Listing storage listing = listings[listingAddress];
    Appeal storage appeal = appeals[listingAddress];
    require(listing.owner == msg.sender);
    require(appeal.requestAppealPhaseExpiry > now); // "Request Appeal Phase" active
    require(!appeal.appealRequested);
    require(token.transferFrom(msg.sender, this, appealFee));

    appeal.appealRequested = true;
    appeal.appealFeePaid = appealFee;
    appeal.appealPhaseExpiry = now + judgeAppealPhaseLength;
    AppealRequested(msg.sender, listingAddress);
  }

  // --------
  // APPELLATE INTERFACE:
  // --------

  /**
  @notice Grants a requested appeal, if the appeal has not expired (or already been granted)
  @param listingAddress The address of the listing associated with the appeal
  */
  function grantAppeal(address listingAddress) external onlyAppellate {
    Appeal storage appeal = appeals[listingAddress];
    require(appeal.appealPhaseExpiry > now); // "Judge Appeal Phase" active
    require(!appeal.appealGranted); // don't grant twice

    appeal.appealGranted = true;    
    AppealGranted(listingAddress);
  }

  function whitelistAddress(address listingAddress, uint depositAmount) external onlyAppellate {
    require(!getListingIsWhitelisted(listingAddress));
    require(!appWasMade(listingAddress));
    require(depositAmount >= parameterizer.get("minDeposit"));
    Ownable ownedContract = Ownable(listingAddress);
    require(ownedContract.owner() != address(0)); // must have an owner
    require(token.transferFrom(msg.sender, this, depositAmount));

    Listing storage listing = listings[listingAddress];
    listing.applicationExpiry = now;
    listing.owner = ownedContract.owner();
    listing.isWhitelisted = true;
    listing.unstakedDeposit = depositAmount;

    JECWhitelistedListing(listingAddress);
  }

  /**
  @notice Set new value for appeal fee
          Can only be called by Appellate, since only they can decide what fee they require
  @param fee The new value for the appeal fee
  */
  function setAppealFee(uint fee) external onlyAppellate {
    require(fee > 0); // safety check
    appealFee = fee;
    AppealFeeSet(fee);
  }

  /**
  @notice Set new value for the length of "Request Appeal Phase"
          Can only be called by Appellate, allowing this to be controlled 
          by community adds complexity and seems unnecessary
  @param length The new value for the "Request Appeal Phase" length
  */
  function setMakeAppealLength(uint length) external onlyAppellate {
    require(length > 0); // safety check
    requestAppealPhaseLength = length;
    MakeAppealLengthSet(length);
  }

  /**
  @notice Set new value for the length of "Judge Appeal Phase"
          Can only be called by Appellate, since only they can decide how long they need to process appeals
  @param length The new value for the "Judge Appeal Phase" length
  */
  function setAppealLength(uint length) external onlyAppellate {
    require(length > 0); // safety check
    judgeAppealPhaseLength = length;
    AppealLengthSet(length);
  }

  /**
  @notice Set new value for the Fee Recipient
          Can only be called by Appellate
  @param recipient The new value for the Fee Recipient
  */
  function setFeeRecipient(address recipient) external onlyAppellate {
    feeRecipient = recipient;
    FeeRecipientSet(recipient);
  }

  // --------
  // FEE RECIPIENT INTERFACE
  // --------

  /**
  @notice Transfers deniedAppealFees to fee recipient. Can only be called by recipient.
  */
  function withdrawDeniedAppealsFees() external onlyFeeRecipient {
    uint feesToSend = deniedAppealFees;
    deniedAppealFees = 0;
    require(token.transfer(msg.sender, feesToSend));
  }

  // --------
  // ANY USER INTERFACE
  // ANYONE CAN CALL THESE FUNCTIONS FOR A LISTING
  // --------

/**
  @dev                Updates a listing's status from 'application' to 'listing' or resolves
                      a challenge or appeal if one exists.
  @param listingAddress The listingAddress whose status is being updated
  */
  function updateStatus(address listingAddress) public {
    Appeal storage appeal = appeals[listingAddress];
    Listing storage listing = listings[listingAddress];
    if (canBeWhitelisted(listingAddress)) {
      whitelistApplication(listingAddress);
      NewListingWhitelisted(listingAddress);
    } else if (challengeCanBeResolved(listingAddress) && 
      (voting.isPassed(listing.challengeID) || appeal.requestAppealPhaseExpiry == 0)) {
      resolveChallenge(listingAddress);
    } else {
      resolvePostAppealPhase(listingAddress);
    }
  }

  /** 
  @notice Update state of listing after "Judge Appeal Phase" has ended. Reverts if cannot be processed yet.
  @param listingAddress Address of listing associated with appeal
  */
  function resolvePostAppealPhase(address listingAddress) internal {
    Appeal storage appeal = appeals[listingAddress];

    // must be initialized and after "Request Appeal Phase"
    require(appeal.requestAppealPhaseExpiry != 0 && now > appeal.requestAppealPhaseExpiry); 
    if (appeal.appealRequested) {
      require(appeal.appealPhaseExpiry < now);
    }

    if (!appeal.appealRequested) { // waiting period over, appeal never requested
      super.resolveChallenge(listingAddress);
    } else if (appeal.appealGranted) {
      // appeal granted. override decision of voters.
      resolveOverturnedChallenge(listingAddress);
    } else {
      super.resolveChallenge(listingAddress);
      deniedAppealFees += appeal.appealFeePaid;
    }
    delete appeals[listingAddress];
  }

  // --------------------
  // TOKEN OWNER INTERFACE:
  // --------------------

  /**
  @dev                Called by a voter to claim their reward for each completed vote. Someone
                      must call updateStatus() before this can be called.
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt        The salt of a voter's commit hash in the given poll
  */
  function claimReward(uint challengeID, uint salt) public {
    // Ensures the voter has not already claimed tokens and challenge results have been processed
    require(challenges[challengeID].tokenClaims[msg.sender] == false);
    require(challenges[challengeID].resolved == true);

    uint voterTokens = voting.getNumPassingTokens(msg.sender, challengeID, salt, challengesOverturned[challengeID]);
    uint reward = voterReward(msg.sender, challengeID, salt);

    // Subtracts the voter's information to preserve the participation ratios
    // of other voters compared to the remaining pool of rewards
    challenges[challengeID].totalTokens -= voterTokens;
    challenges[challengeID].rewardPool -= reward;

    require(token.transfer(msg.sender, reward));

    // Ensures a voter cannot claim tokens again
    challenges[challengeID].tokenClaims[msg.sender] = true;

    RewardClaimed(msg.sender, challengeID, reward);
  }

  /**
  @dev                Calculates the provided voter's token reward for the given poll.
  @param voter       The address of the voter whose reward balance is to be returned
  @param challengeID The pollID of the challenge a reward balance is being queried for
  @param salt        The salt of the voter's commit hash in the given poll
  @return             The uint indicating the voter's reward
  */
  function voterReward(
    address voter,
    uint challengeID,
    uint salt)
    public view returns (uint)
  {
    uint totalTokens = challenges[challengeID].totalTokens;
    uint rewardPool = challenges[challengeID].rewardPool;
    uint voterTokens = voting.getNumPassingTokens(voter, challengeID, salt, challengesOverturned[challengeID]);
    return (voterTokens * rewardPool) / totalTokens;
  }

  // --------
  // BASIC APPEAL GETTERS
  // --------

  function getRequestAppealPhaseExpiry(address listingAddress) public view returns (uint) {
    return appeals[listingAddress].requestAppealPhaseExpiry;
  }

  function getAppealRequested(address listingAddress) public view returns (bool) {
    return appeals[listingAddress].appealRequested;
  }

  function getAppealFeePaid(address listingAddress) public view returns (uint) {
    return appeals[listingAddress].appealFeePaid;
  }

  function getAppealPhaseExpiry(address listingAddress) public view returns (uint) {
    return appeals[listingAddress].appealPhaseExpiry;
  }

  function getAppealGranted(address listingAddress) public view returns (bool) {
    return appeals[listingAddress].appealGranted;
  }

  /**
  @notice Overrides `resolveChallenge` from `AddressRegistry` to begin "Request Appeal Phase" if
          challenge was successful. 
  */
  function resolveChallenge(address listingAddress) internal {
    uint challengeID = listings[listingAddress].challengeID;
    if (voting.isPassed(challengeID)) { // Case: challenge failed
      super.resolveChallenge(listingAddress);
    } else { // Case: challenge succeeded, enter appeals phase
      Appeal storage appeal = appeals[listingAddress];
      require(appeal.requestAppealPhaseExpiry == 0); // only begin request phase if appeal uninitialized
      appeal.requestAppealPhaseExpiry = now + requestAppealPhaseLength;      
    }
  }

  /**
  @notice Updates the state of a listing to "whitelisted", and pay out 
          reward (including appeal fee) to applicant
  @param listingAddress Address of listing with a challenge that is to be resolved
  */
  function resolveOverturnedChallenge(address listingAddress) private {
    Appeal storage appeal = appeals[listingAddress];
    uint challengeID = listings[listingAddress].challengeID;

    // Calculates the winner's reward,
    // which is: (winner's full stake) + (dispensationPct * loser's stake) + (appeal fee paid)
    uint reward = determineReward(challengeID) + appeal.appealFeePaid;

    bool wasWhitelisted = getListingIsWhitelisted(listingAddress);
    
    whitelistApplication(listingAddress);

    // Unlock stake so that it can be retrieved by the applicant
    listings[listingAddress].unstakedDeposit += reward;

    challenges[challengeID].resolved = true;

    // Stores the total tokens used for voting by the losing side for reward purposes
    challenges[challengeID].totalTokens = voting.getTotalNumberOfTokensForLosingOption(challengeID);
    challengesOverturned[challengeID] = true;
    if (!wasWhitelisted) { 
      NewListingWhitelisted(listingAddress); 
    }  
  }
}
