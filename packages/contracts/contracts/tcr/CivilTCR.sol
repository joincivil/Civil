pragma solidity ^0.4.19;

import "./RestrictedAddressRegistry.sol";
import "../interfaces/IGovernment.sol";

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
  event FailedChallengeOverturned(address indexed listing, uint indexed challengeID);
  event SuccessfulChallengeOverturned(address indexed listing, uint indexed challengeID);
  event GrantedAppealChallenged(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID, string data);
  event GrantedAppealOverturned(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID);
  event GrantedAppealConfirmed(address indexed listing, uint indexed challengeID, uint indexed appealChallengeID);
  event GovernmentTransfered(address newGovernment);

  modifier onlyGovernmentController {
    require(msg.sender == government.getGovernmentController());
    _;
  }

  modifier onlyAppellate {
    require(msg.sender == government.getAppellate());
    _;
  }

  IGovernment public government;

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
    bool overturned;
  }

  mapping(uint => uint) public challengeRequestAppealExpiries;
  mapping(uint => Appeal) public appeals; // map challengeID to appeal
  mapping(uint => Challenge) public appealChallenges; // map challengeID to Challenges of the original Challenge's Appeal

  /**
  @notice Contructor. Sets the addresses for token, voting, parameterizer, and government.
  @param tokenAddr Address of the TCR's ERC20 token
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
    require(appeals[listing.challengeID].requester == 0);
    uint appealFee = government.get("appealFee");
    require(token.transferFrom(msg.sender, this, appealFee));

    Appeal storage appeal = appeals[listing.challengeID];
    appeal.requester = msg.sender;
    appeal.appealFeePaid = appealFee;
    appeal.appealPhaseExpiry = now + government.get("judgeAppealLen");
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

  function transferGovernment(address newAddress) external onlyGovernmentController {
    government = IGovernment(newAddress);
    GovernmentTransfered(newAddress);
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
    } else if (challengeCanBeResolved(listingAddress)) {
      resolveChallenge(listingAddress);
    } else if (appealCanBeResolved(listingAddress)) {
      resolveAppeal(listingAddress);
    } else if (appealChallengeCanBeResolved(listingAddress)) {
      resolveAppealChallenge(listingAddress);
    } else {
      revert();
    }
  }

  /** 
  @notice Update state of listing after "Judge Appeal Phase" has ended. Reverts if cannot be processed yet.
  @param listingAddress Address of listing associated with appeal
  */
  function resolveAppeal(address listingAddress) internal {
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
      super.resolveChallenge(listingAddress);
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
    if (id > 0) {
      uint challengeLength = parameterizer.get("commitStageLen") + parameterizer.get("revealStageLen") + government.get("requestAppealLen");
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
    uint pct = government.get("appealVotePercentage");
    require(appeal.appealGranted);
    require(appeal.appealChallengeID == 0);
    require(appeal.appealOpenToChallengeExpiry > now);
    require(token.transferFrom(msg.sender, this, appeal.appealFeePaid));

    uint pollID = voting.startPoll(
      pct,
      parameterizer.get("challengeAppealCommitLen"),
      parameterizer.get("challengeAppealRevealLen")
    );

    appealChallenges[pollID] = Challenge({
      challenger: msg.sender,
      rewardPool: ((100 - pct) * appeal.appealFeePaid) / 100,
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
    determineChallengeReward(appealChallenges[challengeID], challengeID);
  }

  /**
  @notice Getter for Challenge hasClaimedTokens mappings inside an appeal challenge
  @param challengeID The ID of the appeal challenge to query
  @param voter The voter whose claim status to query for the provided challengeID
  */
  function hasClaimedChallengeAppealTokens(uint challengeID, address voter) public view returns (bool) {
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
      appeal.overturned = true;
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
    Challenge storage challenge = appealChallenges[challengeID];
    claimChallengeReward(challengeID, salt, challenge, false);
  }

  /**
  @notice Called by a voter to claim their reward for each completed vote. Someone
          must call updateStatus() before this can be called.
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt        The salt of a voter's commit hash in the given poll
  */
  function claimReward(uint challengeID, uint salt) public {
    Challenge storage challenge = challenges[challengeID];
    claimChallengeReward(challengeID, salt, challenge, appeals[challengeID].appealGranted && !appeals[challengeID].overturned);
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
    Challenge challenge = challenges[challengeID];
    Appeal appeal = appeals[challengeID];
    uint totalTokens = challenge.totalTokens;
    uint rewardPool = challenge.rewardPool;
    bool overturnOriginalResult = appeal.appealGranted && !appeal.overturned;
    uint voterTokens = voting.getNumPassingTokens(voter, challengeID, salt, overturnOriginalResult);
    return (voterTokens * rewardPool) / totalTokens;
  }

  /**
  @notice Updates the state of a listing to "whitelisted", and pay out 
          reward (including appeal fee) to applicant
  @param listingAddress Address of listing with a challenge that is to be resolved
  */
  function resolveOverturnedChallenge(address listingAddress) private {
    Listing storage listing = listings[listingAddress];
    uint challengeID = listing.challengeID;
    Challenge storage challenge = challenges[challengeID];
    // Calculates the winner's reward,
    uint reward = determineReward(challengeID);

    // challenge is overturned, behavior here is opposite resolveChallenge
    if (voting.isPassed(challengeID)) {
      resetListing(listingAddress);
      // Transfer the reward to the challenger
      require(token.transfer(challenge.challenger, reward));

      FailedChallengeOverturned(listingAddress, challengeID);
    } else {
      whitelistApplication(listingAddress);
      // Unlock stake so that it can be retrieved by the applicant
      listing.unstakedDeposit += reward;

      SuccessfulChallengeOverturned(listingAddress, challengeID);
    }

    challenge.resolved = true;
    // Stores the total tokens used for voting by the losing side for reward purposes
    challenge.totalTokens = voting.getTotalNumberOfTokensForLosingOption(challengeID);
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
    return (appeals[challengeID].appealPhaseExpiry == 0);
  }

  function appealCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;
    Appeal appeal = appeals[challengeID];
    require(challengeExists(listingAddress));
    if (appeal.appealPhaseExpiry == 0) {
      return false;
    }
    if (!appeal.appealGranted) {
      return appeal.appealPhaseExpiry < now;
    } else {
      return appeal.appealOpenToChallengeExpiry < now && appeal.appealChallengeID == 0;
    }
  }

  function appealChallengeCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;
    Appeal appeal = appeals[challengeID];
    if (appeal.appealChallengeID == 0) {
      return false;
    }
    if (appealChallenges[appeal.appealChallengeID].resolved) {
      return false;
    }
    return voting.pollEnded(appeal.appealChallengeID);
  }
}
