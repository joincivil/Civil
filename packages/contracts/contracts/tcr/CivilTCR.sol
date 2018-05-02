pragma solidity ^0.4.19;

import "./RestrictedAddressRegistry.sol";
import "../interfaces/IGovernment.sol";

/**
@title CivilTCR - Token Curated Registry with Appeallate Functionality and Restrictions on Application 
@author Nick Reynolds - nick@civil.co / engineering@civil.co
@notice The CivilTCR is a TCR with restrictions (address applied for must be a contract with Owned
implementated, and only the owner of a contract can apply on behalf of that contract), an appeallate entity that can 
overturn challenges if someone requests an appeal, and a process by which granted appeals can be vetoed by a supermajority vote.
A Granted Appeal reverses the result of the challenge vote (including which parties are considered the winners & receive rewards).
A successful Appeal Challenge reverses the result of the Granted Appeal (again, including the winners).
*/
contract CivilTCR is RestrictedAddressRegistry {

  event AppealRequested(address indexed requester, address indexed listing, uint indexed challengeID);
  event AppealGranted(address indexed listing);
  event FailedChallengeOverturned(address indexed listing, uint indexed challengeID);
  event SuccessfulChallengeOverturned(address indexed listing, uint indexed challengeID);
  event GrantedAppealChallenged(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID, string data);
  event GrantedAppealOverturned(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID);
  event GrantedAppealConfirmed(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID);

  /**
  @notice modifier that checks that the sender of a message is the Appellate entity set by the Government
  */
  modifier onlyAppellate {
    require(msg.sender == government.getAppellate());
    _;
  }

  IGovernment public government;

  uint public appealSupermajorityPercentage = 66;

  /*
  @notice this struct handles the state of an appeal. It is first initialized 
  when an appeal is requested
  */
  struct Appeal {
    address requester;
    uint appealFeePaid;
    uint appealPhaseExpiry;
    bool appealGranted;
    uint appealOpenToChallengeExpiry;
    uint appealChallengeID;
    bool overturned;
  }

  mapping(uint => uint) public challengeRequestAppealExpiries;
  mapping(uint => Appeal) public appeals; // map challengeID to appeal
  mapping(uint => Challenge) public appealChallenges; // map challengeID to Challenges of the original Challenge's Appeal

  /**
  @notice Contructor Sets the addresses for token, voting, parameterizer, appellate, and fee recipient
  @dev passes tokenAddr, plcrAddr, paramsAddr up to RestrictedAddressRegistry constructor
  @param tokenAddr Address of the TCR's intrinsic ERC20 token
  @param plcrAddr Address of a PLCR voting contract for the provided token
  @param paramsAddr Address of a Parameterizer contract 
  @param govtAddr Address of a IGovernment contract
  */
  function CivilTCR(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr,
    address govtAddr
  ) public RestrictedAddressRegistry(tokenAddr, plcrAddr, paramsAddr)
  {
    government = IGovernment(govtAddr);
  }

  // --------------------
  // LISTING OWNER INTERFACE:
  // --------------------

  /**
  @notice Requests an appeal for a listing that has been challenged and completed its voting
  phase, but has not passed its challengeRequestAppealExpiries time.
  In order to request appeal, the following conditions must be met:
  * voting for challenge has ended
  * request appeal expiry has not passed
  * appeal not already requested
  * appeal requester transfers appealFee to TCR
  Initializes `Appeal` struct in `appeals` mapping for active challenge on listing at given address.
  Sets value in `appealRequested` mapping for challenge to true.
  Emits `AppealRequested` if successful
  @param listingAddress address of listing that has challenged result that the user wants to appeal
  */
  function requestAppeal(address listingAddress) external {
    Listing storage listing = listings[listingAddress];
    require(voting.pollEnded(listing.challengeID));
    require(challengeRequestAppealExpiries[listing.challengeID] > now); // "Request Appeal Phase" active
    require(appeals[listing.challengeID].requester == 0);
    uint appealFee = government.get("appealFee");
    require(token.transferFrom(msg.sender, this, appealFee));

    Appeal storage appeal = appeals[listing.challengeID];
    appeal.requester = msg.sender;
    appeal.appealFeePaid = appealFee;
    appeal.appealPhaseExpiry = now + government.get("judgeAppealPhaseLength");
    AppealRequested(msg.sender, listingAddress, listing.challengeID);
  }

  // --------
  // APPELLATE INTERFACE:
  // --------

  /**
  @notice Grants a requested appeal. 
  In order to grant an appeal:
  * Message sender must be appellate entity as set by IGovernment contract
  * An appeal has been requested
  * The appeal phase expiry has not passed
  * An appeal has not yet been granted
  Updates `Appeal` struct for appeal of active challenge for listing at given address by setting `appealGranted` to true and
  setting the `appealOpenToChallengeExpiry` value to a future time based on current value of `challengeAppealLen` in the Parameterizer.
  Emits `AppealGranted` if successful
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

  // --------
  // ANY USER INTERFACE
  // ANYONE CAN CALL THESE FUNCTIONS FOR A LISTING
  // --------

  /** 
  @notice Update state of listing after "Judge Appeal Phase" has ended. Reverts if cannot be processed yet.
  @param listingAddress Address of listing associated with appeal
  */
  function resolveAppeal(address listingAddress) external {
    require(appealCanBeResolved(listingAddress));
    Listing listing = listings[listingAddress];
    Appeal appeal = appeals[listing.challengeID];
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
      internalResolveChallenge(listingAddress);
    }
  }

  // --------------------
  // TOKEN OWNER INTERFACE:
  // --------------------

  /**
  @notice Starts a poll for a listingAddress which is either in the apply stage or already in the whitelist. 
  Tokens are taken from the challenger and the applicant's deposits are locked. 
  Delists listing and returns 0 if listing's unstakedDeposit is less than current minDeposit
  @dev  Differs from base implementation in that it stores a timestamp in a mapping
  corresponding to the end of the request appeal phase, at which point a challenge
  can be resolved, if no appeal was requested
  @param listingAddress The listingAddress being challenged, whether listed or in application
  @param data Extra data relevant to the challenge. Think IPFS hashes.
  */
  function challenge(address listingAddress, string data) public returns (uint challengeID) {
    uint id = super.challenge(listingAddress, data);
    uint challengeLength = parameterizer.get("commitStageLen") + parameterizer.get("revealStageLen") + government.get("requestAppealPhaseLength");
    challengeRequestAppealExpiries[id] = now + challengeLength;
    return id;
  }

  /**
  @notice Starts a poll for a listingAddress which has recently been granted an appeal. If
  the poll passes, the granted appeal will be overturned. In order to start a challenge,
  the following conditions must be met:
  * There is an active appeal on the listing
  * This appeal was granted
  * This appeal has not yet been challenged
  * The expiry time of the appeal challenge is greater than the current time
  * The challenger transfers tokens to the TCR equal to appeal fee paid by appeal requester
  Initializes `Challenge` struct in `appealChallenges` mapping
  Emits `GrantedAppealChallenged` if successful, and sets value of `appealChallengeID` on appeal being challenged.
  @return challengeID associated with the appeal challenge
  @dev challengeID is a nonce created by the PLCRVoting contract, regular challenges and appeal challenges share the same nonce variable
  @param listingAddress The listingAddress associated with the appeal
  @param data Extra data relevant to the appeal challenge. Think URLs.
  */
  function challengeGrantedAppeal(address listingAddress, string data) external returns (uint challengeID) {
    Listing storage listing = listings[listingAddress];
    Appeal storage appeal = appeals[listing.challengeID];

    require(appeal.appealGranted);
    require(appeal.appealChallengeID == 0);
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
  @notice Determines the number of tokens awarded to the winning party in an appeal challenge.
  @param challengeID The ID of an appeal challenge to determine a reward for
  @return Number of tokens to be awarded to winning party in appeal challenge.
  */
  function determineAppealChallengeReward(uint challengeID) public view returns (uint) {
    determineChallengeReward(appealChallenges[challengeID], challengeID);
  }

  /**
  @notice Getter for hasClaimedTokens mappings inside an appeal challenge
  @param challengeID The ID of the appeal challenge to query
  @param voter The voter whose claim status to query for the provided challengeID
  @return True is voter has claimed tokens for specified appeal challenge. False otherwise.
  */
  function hasClaimedChallengeAppealTokens(uint challengeID, address voter) public view returns (bool) {
    return appealChallenges[challengeID].hasClaimedTokens[voter];
  }

  /**
  @notice Determines the winner in an appeal challenge. Rewards the winner tokens and
  either whitelists or delists the listing at the given address. Also resolves the underlying
  challenge that was originally appealed.
  Emits `GrantedAppealConfirmed` if appeal challenge unsuccessful.
  Emits `GrantedAppealOverturned` if appeal challenge successful.
  @param listingAddress The address of a listing with an appeal challenge that is to be resolved
  */
  function resolveAppealChallenge(address listingAddress) external {
    require(appealChallengeCanBeResolved(listingAddress));
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
      internalResolveChallenge(listingAddress);
      appeals[challengeID].overturned = true;
      GrantedAppealOverturned(listingAddress, challengeID, appealChallengeID);
    }

    // Sets flag on challenge being processed
    appealChallenge.resolved = true;

    // Stores the total tokens used for voting by the winning side for reward purposes
    appealChallenge.totalTokens = voting.getTotalNumberOfTokensForWinningOption(challengeID);
  }

  /**
  @notice Called by a voter to claim their reward for a vote on a completed appeal challenge
  In order to claim tokens:
  * Appeal Challenge must be resolved
  * Message sender must not have already claimed tokens to this appeal challenge
  Emits `RewardClaimed` if successful
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt The salt of a voter's commit hash in the given poll
  */
  function claimAppealChallengeReward(uint challengeID, uint salt) external {
    Challenge storage challenge = appealChallenges[challengeID];
    claimChallengeReward(challengeID, salt, challenge, false);
  }

  /**
  @notice Called by a voter to claim their reward for each completed vote. 
  In order to claim reward for a challenge:
  * Challenge must be resolved
  * Message sender must not have already claimed tokens for this challenge
  Emits `RewardClaimed` if successful
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt        The salt of a voter's commit hash in the given poll
  */
  function claimReward(uint challengeID, uint salt) external {
    Challenge storage challenge = challenges[challengeID];
    claimChallengeReward(challengeID, salt, challenge, appeals[challengeID].appealGranted && !appeals[challengeID].overturned);
  }

  /**
  @notice Calculates the provided voter's token reward for the given poll.
  @dev differs from implementation in `AddressRegistry` in that it takes into consideration whether an
  appeal was granted and possible overturned via appeal challenge.
  @param voter The address of the voter whose reward balance is to be returned
  @param challengeID The pollID of the challenge a reward balance is being queried for
  @param salt The salt of the voter's commit hash in the given poll
  @return The uint indicating the voter's reward
  */
  function voterReward(
    address voter,
    uint challengeID,
    uint salt
  ) public view returns (uint)
  {
    uint totalTokens = challenges[challengeID].totalTokens;
    uint rewardPool = challenges[challengeID].rewardPool;
    bool overturnOriginalResult = appeals[challengeID].appealGranted && !appeals[challengeID].overturned;
    uint voterTokens = voting.getNumPassingTokens(voter, challengeID, salt, overturnOriginalResult);
    return (voterTokens * rewardPool) / totalTokens;
  }

  /**
  @notice Updates the state of a listing after a challenge was overtuned via appeal (and no appeal
  challenge was initiated). 
  If challenge previously failed, transfer reward to original challenger. Otherwise, add reward 
  to listing's unstaked deposit
  Emits `FailedChallengeOverturned` if original challenge failed
  Emits `SuccessfulChallengeOverturned` if original challenge succeeded
  Emits `ListingRemoved` if original challenge failed and listing was previous whitelisted
  Emits `ApplicationRemoved` if original challenge failed and listing was not previously whitelisted
  Emits `NewListingWhitelisted` if original challenge succeeded and listing was not previously whitelisted
  @param listingAddress Address of listing with a challenge that is to be resolved
  */
  function resolveOverturnedChallenge(address listingAddress) private {
    uint challengeID = listings[listingAddress].challengeID;
    // Calculates the winner's reward,
    uint reward = determineReward(challengeID);

    // challenge is overturned, behavior here is opposite resolveChallenge
    if (voting.isPassed(challengeID)) {
      resetListing(listingAddress);
      // Transfer the reward to the challenger
      require(token.transfer(challenges[challengeID].challenger, reward));

      FailedChallengeOverturned(listingAddress, challengeID);
    } else {
      internalWhitelistApplication(listingAddress);
      // Unlock stake so that it can be retrieved by the applicant
      listings[listingAddress].unstakedDeposit += reward;

      SuccessfulChallengeOverturned(listingAddress, challengeID);
    }

    challenges[challengeID].resolved = true;
    // Stores the total tokens used for voting by the losing side for reward purposes
    challenges[challengeID].totalTokens = voting.getTotalNumberOfTokensForLosingOption(challengeID);
  }

  /**
  @notice Determines whether a challenge can be resolved for a listing at given address. Throws if no challenge exists.
  @param listingAddress An address for a listing to check
  @return True if challenge exists, has not already been resolved, has not had appeal requested, and has passed the request appeal expiry time. False otherwise.
  */
  function challengeCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;
    require(challengeExists(listingAddress));
    if (challengeRequestAppealExpiries[challengeID] > now) {
      return false;
    }
    return (appeals[challengeID].appealPhaseExpiry == 0);
  }

  /**
  @notice Determines whether an appeal can be resolved for a listing at given address. Throws if no challenge exists.
  @param listingAddress An address for a listing to check
  @return True if challenge exists, has not already been resolved, has had appeal requested, and has either 
  (1) had an appeal granted and passed the appeal opten to challenge expiry OR (2) has not had an appeal granted and
  has passed the appeal phase expiry. False otherwise.
  */
  function appealCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;
    require(challengeExists(listingAddress));
    if (appeals[challengeID].appealPhaseExpiry == 0) {
      return false;
    }
    if (!appeals[challengeID].appealGranted) {
      return appeals[challengeID].appealPhaseExpiry < now;
    } else {
      return appeals[challengeID].appealOpenToChallengeExpiry < now && appeals[challengeID].appealChallengeID == 0;
    }
  }

  /**
  @notice Determines whether an appeal challenge can be resolved for a listing at given address. Throws if no challenge exists.
  @param listingAddress An address for a listing to check
  @return True if appeal challenge exists, has not already been resolved, and the voting phase for the appeal challenge is ended. False otherwise.
  */
  function appealChallengeCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;

    if (appeals[challengeID].appealChallengeID == 0) {
      return false;
    }
    if (appealChallenges[appeals[challengeID].appealChallengeID].resolved) {
      return false;
    }
    return voting.pollEnded(appeals[challengeID].appealChallengeID);
  }
}
