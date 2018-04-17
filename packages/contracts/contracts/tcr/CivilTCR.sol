pragma solidity ^0.4.19;

import "./RestrictedAddressRegistry.sol";

/**
@title TCR with appeallate functionality and restrictions on application 
@author Nick Reynolds - nick@joincivil.com
@notice The CivilTCR is a TCR with restrictions (contracts must have IACL
implementation, and only the ACL superuser of a contract can apply on behalf of that contract)
and an appeallate entity that can overturn challenges if someone requests an appeal, and a process
by which granted appeals can be vetoed by a supermajority vote
"Listing" refers to the data associated with an address at any stage of the lifecycle (e.g.
"Listing in Application", "Listing in Challenge", "Listing on Whitelist", "Denied Listing", etc).
*/
contract CivilTCR is RestrictedAddressRegistry {

  event AppealRequested(address indexed requester, address indexed listing, uint indexed challengeID);
  event AppealGranted(address indexed listing);
  event AppealFeeSet(uint fee);
  event MakeAppealLengthSet(uint length);
  event AppealLengthSet(uint length);
  event FailedChallengeOverturned(address indexed listing, uint indexed challengeID);
  event SuccessfulChallengeOverturned(address indexed listing, uint indexed challengeID);
  event GrantedAppealChallenged(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID, string data);
  event GrantedAppealOverturned(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID);
  event GrantedAppealConfirmed(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID);

  modifier onlyAppellate {
    require(msg.sender == appellate);
    _;
  }

  address public appellate;
  uint public appealFee;
  uint public requestAppealPhaseLength;
  uint public judgeAppealPhaseLength;

  uint public appealSupermajorityPercentage = 66;

  /*
  @notice this struct handles the state of an appeal. It is first initialized 
          when updateStatus is called after a successful challenge.
  */
  struct Appeal {
    address requester;
    uint appealFeePaid;
    uint appealPhaseExpiry;
    bool appealGranted;
    uint appealOpenToChallengeExpiry;
    uint appealChallengeID;
  }

  mapping(uint => uint) public challengeRequestAppealExpiries;
  mapping(uint => bool) public appealRequested; // map challengeID to was appeal requested
  mapping(uint => Appeal) public appeals; // map challengeID to appeal
  mapping(uint => Challenge) public appealChallenges; // map challengeID to Challenges of the original Challenge's Appeal
  mapping(uint => bool) public appealOverturned; // map challengeID to whether or not the appeal of that challenge was overturned

  /**
  @dev Contructor           Sets the addresses for token, voting, parameterizer, appellate, and fee recipient
  @param tokenAddr          Address of the TCR's intrinsic ERC20 token
  @param plcrAddr           Address of a PLCR voting contract for the provided token
  @param paramsAddr         Address of a Parameterizer contract 
  @param appellateAddr      Address of appellate entity, which could be a regular user, although multisig is recommended
  */
  function CivilTCR(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr,
    address appellateAddr,
    uint appealFeeAmount,
    uint requestAppealLength,
    uint judgeAppealLength
  ) public RestrictedAddressRegistry(tokenAddr, plcrAddr, paramsAddr)
  {
    appellate = appellateAddr;
    requestAppealPhaseLength = requestAppealLength;
    judgeAppealPhaseLength = judgeAppealLength;
    appealFee = appealFeeAmount;
  }

  // --------------------
  // LISTING OWNER INTERFACE:
  // --------------------

  /**
  @notice Requests an appeal for a listing that has been successfully challenged (and had state updated)
  In order to request appeal, the following conditions must be met:
  - voting for challenge has ended
  - (now < request appeal expiry) 
  - appeal not already requested
  - appeal requester transfers appealFee to TCR
  @param listingAddress address of listing that has challenged result that the user wants to appeal
  */
  function requestAppeal(address listingAddress) external {
    Listing storage listing = listings[listingAddress];
    require(voting.pollEnded(listing.challengeID));
    require(challengeRequestAppealExpiries[listing.challengeID] > now); // "Request Appeal Phase" active
    require(!appealRequested[listing.challengeID]);
    require(token.transferFrom(msg.sender, this, appealFee));

    Appeal storage appeal = appeals[listing.challengeID];
    appeal.requester = msg.sender;
    appeal.appealFeePaid = appealFee;
    appeal.appealPhaseExpiry = now + judgeAppealPhaseLength;
    appealRequested[listing.challengeID] = true;
    AppealRequested(msg.sender, listingAddress, listing.challengeID);
  }

  // --------
  // APPELLATE INTERFACE:
  // --------

  /**
  @notice Grants a requested appeal, if the appeal has not expired (or already been granted)
  Can only be called by appellate (JEC)
  @param listingAddress The address of the listing associated with the appeal
  */
  function grantAppeal(address listingAddress) external onlyAppellate {
    Listing storage listing = listings[listingAddress];
    Appeal storage appeal = appeals[listing.challengeID];
    require(appeal.appealPhaseExpiry > now); // "Judge Appeal Phase" active
    require(!appeal.appealGranted); // don't grant twice

    appeal.appealGranted = true;    
    appeal.appealOpenToChallengeExpiry = now + parameterizer.get("challengeAppealLen");
    AppealGranted(listingAddress);
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

  // --------
  // ANY USER INTERFACE
  // ANYONE CAN CALL THESE FUNCTIONS FOR A LISTING
  // --------

/**
  @notice Updates a listing's status from 'application' to 'listing' or resolves a challenge or appeal 
  or appeal challenge if one exists.
  @param listingAddress Address of the listing of which the status is being updated
  */
  function updateStatus(address listingAddress) public {
    if (canBeWhitelisted(listingAddress)) {
      whitelistApplication(listingAddress);
      NewListingWhitelisted(listingAddress);
    } else if (challengeCanBeResolved(listingAddress)) {
      resolveChallenge(listingAddress);
    } else if (appealCanBeResolved(listingAddress)) {
      resolvePostAppealPhase(listingAddress);
    } else {
      revert();
    }
  }

  /** 
  @notice Update state of listing after "Judge Appeal Phase" has ended. Reverts if cannot be processed yet.
  @param listingAddress Address of listing associated with appeal
  */
  function resolvePostAppealPhase(address listingAddress) internal {
    Listing storage listing = listings[listingAddress];
    Appeal storage appeal = appeals[listing.challengeID];
    if (appeal.appealGranted) {
      // return appeal fee to appeal requester
      require(token.transfer(appeal.requester, appeal.appealFeePaid));
      // appeal granted. override decision of voters.
      resolveOverturnedChallenge(listingAddress);
    } else {
      // appeal fee is split between original winning voters and challenger
      Challenge storage challenge = challenges[listing.challengeID];
      uint extraReward = appeal.appealFeePaid / 2;
      challenge.rewardPool += extraReward;
      challenge.stake += appeal.appealFeePaid - extraReward;
      // appeal not granted, confirm original decision of voters.
      super.resolveChallenge(listingAddress);
    }
  }

  // --------------------
  // TOKEN OWNER INTERFACE:
  // --------------------

  /**
  @notice Starts a poll for a listingAddress which is either in the apply stage or already in the whitelist. 
  Tokens are taken from the challenger and the applicant's deposits are locked. 
  Delists listing and returns NO_CHALLENGE if listing's unstakedDeposit is less than current minDeposit
  @dev  Differs from base implementation in that it stores a timestamp in a mapping
  corresponding to the end of the request appeal phase, at which point a challenge
  can be resolved, if no appeal was requested
  @param listingAddress The listingAddress being challenged, whether listed or in application
  @param data Extra data relevant to the challenge. Think IPFS hashes.
  */
  function challenge(address listingAddress, string data) public returns (uint challengeID) {
    uint id = super.challenge(listingAddress, data);
    if (id != NO_CHALLENGE) {
      uint challengeLength = parameterizer.get("commitStageLen") + parameterizer.get("revealStageLen") + requestAppealPhaseLength;
      challengeRequestAppealExpiries[id] = now + challengeLength;
    }
    return id;
  }

  /**
  @notice Starts a poll for a listingAddress which has recently been granted a challenge. If
  the poll passes, the granted appeal will be overturned. In order to start a challenge,
  the following conditions must be met:
  - There is an active appeal on the listing
  - This appeal was granted
  - This appeal has not yet been challenged
  - The expiry time of the appeal challenge is greater than the current time
  - The challenger transfers tokens to the TCR equal to appeal fee paid by appeal requester
  @return challengeID associated with the appeal challenge
  @dev challengeID is a nonce created by the PLCRVoting contract, regular challenges and appeal challenges share the same nonce variable
  @param listingAddress The listingAddress associated with the appeal
  @param data Extra data relevant to the appeal challenge. Think URLs.
  */
  function challengeGrantedAppeal(address listingAddress, string data) public returns (uint challengeID) {
    Listing storage listing = listings[listingAddress];
    Appeal storage appeal = appeals[listing.challengeID];

    require(appeal.appealGranted);
    require(appeal.appealChallengeID == NO_CHALLENGE);
    require(appeal.appealOpenToChallengeExpiry > now);
    require(token.transferFrom(msg.sender, this, appeal.appealFeePaid));

    uint pollID = voting.startPoll(
      appealSupermajorityPercentage,
      parameterizer.get("challengeAppealCommitLen"),
      parameterizer.get("challengeAppealRevealLen")
    );

    appealChallenges[pollID] = Challenge({
      challenger: msg.sender,
      rewardPool: ((100 - appealSupermajorityPercentage) * appeal.appealFeePaid) / 100,
      stake: appeal.appealFeePaid,
      resolved: false,
      totalTokens: 0
    });

    appeal.appealChallengeID = pollID;

    GrantedAppealChallenged(listingAddress, listing.challengeID, pollID, data);
    return pollID;
  }

  /**
  @notice Determines the number of tokens awarded to the winning party in a challenge.
  @param challengeID The ID of an appeal challenge to determine a reward for
  */
  function determineAppealChallengeReward(uint challengeID) public view returns (uint) {
    require(!appealChallenges[challengeID].resolved && voting.pollEnded(challengeID));

    // Edge case, nobody voted, give all tokens to the challenger.
    if (voting.getTotalNumberOfTokensForWinningOption(challengeID) == 0) {
      return 2 * appealChallenges[challengeID].stake;
    }

    return (2 * appealChallenges[challengeID].stake) - appealChallenges[challengeID].rewardPool;
  }

  /**
  @notice Getter for Challenge hasClaimedTokens mappings inside an appeal challenge
  @param challengeID The ID of the appeal challenge to query
  @param voter The voter whose claim status to query for the provided challengeID
  */
  function hasClaimedChallengeAppealTokens(uint challengeID, address voter) public returns (bool) {
    return appealChallenges[challengeID].hasClaimedTokens[voter];
  }

  /**
  @notice Determines the winner in an appeal challenge. Rewards the winner tokens and
  either whitelists or de-whitelists the listingAddress. Also resolves the underlying
  challenge that was originally appealed.
  @param listingAddress A listingAddress with a challenge that is to be resolved
  */
  function resolveAppealChallenge(address listingAddress) internal {
    Listing storage listing = listings[listingAddress];
    uint challengeID = listings[listingAddress].challengeID;
    Appeal storage appeal = appeals[listing.challengeID];
    uint appealChallengeID = appeal.appealChallengeID;
    Challenge storage appealChallenge = appealChallenges[appeal.appealChallengeID];

    // Calculates the winner's reward,
    // which is: (winner's full stake) + (dispensationPct * loser's stake)
    uint reward = determineAppealChallengeReward(appealChallengeID);

    if (voting.isPassed(appealChallengeID)) { // Case: appeal challenge failed, don't overturn appeal
      require(token.transfer(appeal.requester, reward));
      resolveOverturnedChallenge(listingAddress);
      GrantedAppealConfirmed(listingAddress, challengeID, appealChallengeID);
    } else { // Case: appeal challenge succeeded, overturn appeal
      require(token.transfer(appealChallenge.challenger, reward));
      super.resolveChallenge(listingAddress);
      appealOverturned[challengeID] = true;
      GrantedAppealOverturned(listingAddress, challengeID, appealChallengeID);
    }

    // Sets flag on challenge being processed
    appealChallenge.resolved = true;

    // Stores the total tokens used for voting by the winning side for reward purposes
    appealChallenge.totalTokens = voting.getTotalNumberOfTokensForWinningOption(challengeID);
  }

  /**
  @notice Called by a voter to claim their reward for each completed vote. Someone
          must call updateStatus() before this can be called.
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt        The salt of a voter's commit hash in the given poll
  */
  function claimAppealChallengeReward(uint challengeID, uint salt) public {
    // Ensures the voter has not already claimed tokens and challenge results have been processed
    require(appealChallenges[challengeID].hasClaimedTokens[msg.sender] == false);
    require(appealChallenges[challengeID].resolved == true);

    uint voterTokens = voting.getNumPassingTokens(msg.sender, challengeID, salt, false);
    uint reward = voterReward(msg.sender, challengeID, salt);

    // Subtracts the voter's information to preserve the participation ratios
    // of other voters compared to the remaining pool of rewards
    appealChallenges[challengeID].totalTokens -= voterTokens;
    appealChallenges[challengeID].rewardPool -= reward;

    require(token.transfer(msg.sender, reward));

    // Ensures a voter cannot claim tokens again
    appealChallenges[challengeID].hasClaimedTokens[msg.sender] = true;

    RewardClaimed(msg.sender, challengeID, reward);
  }

  /**
  @notice Called by a voter to claim their reward for each completed vote. Someone
          must call updateStatus() before this can be called.
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt        The salt of a voter's commit hash in the given poll
  */
  function claimReward(uint challengeID, uint salt) public {
    // Ensures the voter has not already claimed tokens and challenge results have been processed
    require(challenges[challengeID].hasClaimedTokens[msg.sender] == false);
    require(challenges[challengeID].resolved == true);

    uint voterTokens = voting.getNumPassingTokens(msg.sender, challengeID, salt, appeals[challengeID].appealGranted);
    uint reward = voterReward(msg.sender, challengeID, salt);

    // Subtracts the voter's information to preserve the participation ratios
    // of other voters compared to the remaining pool of rewards
    challenges[challengeID].totalTokens -= voterTokens;
    challenges[challengeID].rewardPool -= reward;

    require(token.transfer(msg.sender, reward));

    // Ensures a voter cannot claim tokens again
    challenges[challengeID].hasClaimedTokens[msg.sender] = true;

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
    uint salt
  ) public view returns (uint)
  {
    uint totalTokens = challenges[challengeID].totalTokens;
    uint rewardPool = challenges[challengeID].rewardPool;
    bool overturnOriginalResult = appeals[challengeID].appealGranted && !appealOverturned[challengeID];
    uint voterTokens = voting.getNumPassingTokens(voter, challengeID, salt, overturnOriginalResult);
    return (voterTokens * rewardPool) / totalTokens;
  }

  /**
  @notice Updates the state of a listing to "whitelisted", and pay out 
          reward (including appeal fee) to applicant
  @param listingAddress Address of listing with a challenge that is to be resolved
  */
  function resolveOverturnedChallenge(address listingAddress) private {
    uint challengeID = listings[listingAddress].challengeID;
    Challenge storage listingChallenge = challenges[challengeID];

    // Calculates the winner's reward,
    uint reward = determineReward(challengeID);

    bool wasWhitelisted = listings[listingAddress].isWhitelisted;

    // challenge is overturned, behavior here is opposite resolveChallenge
    if (voting.isPassed(challengeID)) {
      resetListing(listingAddress);
      // Transfer the reward to the challenger
      require(token.transfer(challenges[challengeID].challenger, reward));

      FailedChallengeOverturned(listingAddress, challengeID);
      if (wasWhitelisted) {
        ListingRemoved(listingAddress);
      } else {
        ApplicationRemoved(listingAddress);
      }
    } else {
      whitelistApplication(listingAddress);
      // Unlock stake so that it can be retrieved by the applicant
      listings[listingAddress].unstakedDeposit += reward;

      SuccessfulChallengeOverturned(listingAddress, challengeID);
      if (!wasWhitelisted) {
        NewListingWhitelisted(listingAddress);
      }
    }

    listingChallenge.resolved = true;
    // Stores the total tokens used for voting by the losing side for reward purposes
    listingChallenge.totalTokens = voting.getTotalNumberOfTokensForLosingOption(challengeID);
  }

  /**
  @dev                Determines whether voting has concluded in a challenge for a given
                      listingAddress. Throws if no challenge exists.
  @param listingAddress A listingAddress with an unresolved challenge
  */
  function challengeCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;
    require(challengeExists(listingAddress));
    if (challengeRequestAppealExpiries[challengeID] > now) {
      return false;
    }
    if (challenges[challengeID].resolved) {
      return false;
    }
    if (appealRequested[challengeID]) {
      return false;
    }
    return true;
  }

  function appealCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;
    require(challengeExists(listingAddress));

    if (challenges[challengeID].resolved) {
      return false;
    }
    if (!appealRequested[challengeID]) {
      return false;
    }
    if (!appeals[challengeID].appealGranted) {
      if (appeals[challengeID].appealPhaseExpiry > now) {
        return false;
      }
      return true;
    } else {
      if (appeals[challengeID].appealOpenToChallengeExpiry > now) {
        return false;
      } else {
        return true;
      }
    }
  }
}
