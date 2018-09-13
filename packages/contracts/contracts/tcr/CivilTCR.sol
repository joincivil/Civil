pragma solidity ^0.4.19;

import "./RestrictedAddressRegistry.sol";
import "../interfaces/IGovernment.sol";
import "./CivilPLCRVoting.sol";

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

  event _AppealRequested(address indexed listingAddress, uint indexed challengeID, uint appealFeePaid, address requester);
  event _AppealGranted(address indexed listingAddress, uint indexed challengeID);
  event _FailedChallengeOverturned(address indexed listingAddress, uint indexed challengeID, uint rewardPool, uint totalTokens);
  event _SuccessfulChallengeOverturned(address indexed listingAddress, uint indexed challengeID, uint rewardPool, uint totalTokens);
  event _GrantedAppealChallenged(address indexed listingAddress, uint indexed challengeID, uint indexed appealChallengeID, string data);
  event _GrantedAppealOverturned(address indexed listingAddress, uint indexed challengeID, uint indexed appealChallengeID, uint rewardPool, uint totalTokens);
  event _GrantedAppealConfirmed(address indexed listingAddress, uint indexed challengeID, uint indexed appealChallengeID, uint rewardPool, uint totalTokens);
  event _GovernmentTransfered(address newGovernment);

  modifier onlyGovernmentController {
    require(msg.sender == government.getGovernmentController());
    _;
  }

  /**
  @notice modifier that checks that the sender of a message is the Appellate entity set by the Government
  */
  modifier onlyAppellate {
    require(msg.sender == government.getAppellate());
    _;
  }

  CivilPLCRVoting public civilVoting;
  IGovernment public government;

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

  /**
  @notice Init function calls AddressRegistry init then sets IGovernment
  @dev passes tokenAddr, plcrAddr, paramsAddr up to RestrictedAddressRegistry constructor
  @param tokenAddr Address of the TCR's intrinsic ERC20 token
  @param plcrAddr Address of a PLCR voting contract for the provided token
  @param paramsAddr Address of a Parameterizer contract
  @param govt IGovernment contract
  */
  constructor(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr,
    IGovernment govt
  ) public RestrictedAddressRegistry(tokenAddr, plcrAddr, paramsAddr, "CivilTCR")
  {
    civilVoting = CivilPLCRVoting(plcrAddr);
    require(address(govt) != 0);
    require(govt.getGovernmentController() != 0);
    government = govt;
  }

  // --------------------
  // LISTING OWNER INTERFACE:
  // --------------------

  /**
  @notice Requests an appeal for a listing that has been challenged and completed its voting
  phase, but has not passed its challengeRequestAppealExpiries time.
  --------
  In order to request appeal, the following conditions must be met:
  1) voting for challenge has ended
  2) request appeal expiry has not passed
  3) appeal not already requested
  4) appeal requester transfers appealFee to TCR
  --------
  Initializes `Appeal` struct in `appeals` mapping for active challenge on listing at given address.
  --------
  Emits `_AppealRequested` if successful
  @param listingAddress address of listing that has challenged result that the user wants to appeal
  */
  function requestAppeal(address listingAddress) external {
    Listing storage listing = listings[listingAddress];
    require(voting.pollEnded(listing.challengeID));
    require(challengeRequestAppealExpiries[listing.challengeID] > now); // "Request Appeal Phase" active
    require(appeals[listing.challengeID].requester == 0);

    uint appealFee = government.get("appealFee");
    Appeal storage appeal = appeals[listing.challengeID];
    appeal.requester = msg.sender;
    appeal.appealFeePaid = appealFee;
    appeal.appealPhaseExpiry = now + government.get("judgeAppealLen");

    require(token.transferFrom(msg.sender, this, appealFee));
    emit _AppealRequested(listingAddress, listing.challengeID, appealFee, msg.sender);
  }

  // --------
  // APPELLATE INTERFACE:
  // --------

  /**
  @notice Grants a requested appeal.
  --------
  In order to grant an appeal:
  1) Message sender must be appellate entity as set by IGovernment contract
  2) An appeal has been requested
  3) The appeal phase expiry has not passed
  4) An appeal has not yet been granted
  --------
  Updates `Appeal` struct for appeal of active challenge for listing at given address by setting `appealGranted` to true and
  setting the `appealOpenToChallengeExpiry` value to a future time based on current value of `challengeAppealLen` in the Parameterizer.
  --------
  Emits `_AppealGranted` if successful
  @param listingAddress The address of the listing associated with the appeal
  */
  function grantAppeal(address listingAddress) external onlyAppellate {
    Listing storage listing = listings[listingAddress];
    Appeal storage appeal = appeals[listing.challengeID];
    require(appeal.appealPhaseExpiry > now); // "Judge Appeal Phase" active
    require(!appeal.appealGranted); // don't grant twice

    appeal.appealGranted = true;
    appeal.appealOpenToChallengeExpiry = now + parameterizer.get("challengeAppealLen");
    emit _AppealGranted(listingAddress, listing.challengeID);
  }

  /**
  @notice Updates IGovernment instance.
  --------
  Can only be called by Government Controller.
  --------
  Emits `_GovernmentTransfered` if successful.
  */
  function transferGovernment(IGovernment newGovernment) external onlyGovernmentController {
    require(address(newGovernment) != 0);
    government = newGovernment;
    emit _GovernmentTransfered(newGovernment);
  }

  // --------
  // ANY USER INTERFACE
  // ANYONE CAN CALL THESE FUNCTIONS FOR A LISTING
  // --------

  /**
  @notice Updates a listing's status from 'application' to 'listing', or resolves a challenge or appeal
  or appeal challenge if one exists. Reverts if none of `canBeWhitelisted`, `challengeCanBeResolved`, or
  `appealCanBeResolved` is true for given `listingAddress`.
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
      // appeal granted. override decision of voters.
      resolveOverturnedChallenge(listingAddress);
      // return appeal fee to appeal requester
      require(token.transfer(appeal.requester, appeal.appealFeePaid));
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
  @notice Starts a poll for a listingAddress which has recently been granted an appeal. If
  the poll passes, the granted appeal will be overturned.
  --------
  In order to start a challenge:
  1) There is an active appeal on the listing
  2) This appeal was granted
  3) This appeal has not yet been challenged
  4) The expiry time of the appeal challenge is greater than the current time
  5) The challenger transfers tokens to the TCR equal to appeal fee paid by appeal requester
  --------
  Initializes `Challenge` struct in `challenges` mapping
  --------
  Emits `_GrantedAppealChallenged` if successful, and sets value of `appealChallengeID` on appeal being challenged.
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

    uint pollID = voting.startPoll(
      pct,
      parameterizer.get("challengeAppealCommitLen"),
      parameterizer.get("challengeAppealRevealLen")
    );

    challenges[pollID] = Challenge({
      challenger: msg.sender,
      rewardPool: ((100 - pct) * appeal.appealFeePaid) / 100,
      stake: appeal.appealFeePaid,
      resolved: false,
      totalTokens: 0
    });

    appeal.appealChallengeID = pollID;

    require(token.transferFrom(msg.sender, this, appeal.appealFeePaid));
    emit _GrantedAppealChallenged(listingAddress, listing.challengeID, pollID, data);
    return pollID;
  }


  /**
  @notice Determines the winner in an appeal challenge. Rewards the winner tokens and
  either whitelists or delists the listing at the given address. Also resolves the underlying
  challenge that was originally appealed.
  Emits `_GrantedAppealConfirmed` if appeal challenge unsuccessful (vote not passed).
  Emits `_GrantedAppealOverturned` if appeal challenge successful (vote passed).
  @param listingAddress The address of a listing with an appeal challenge that is to be resolved
  */
  function resolveAppealChallenge(address listingAddress) internal {
    Listing storage listing = listings[listingAddress];
    uint challengeID = listings[listingAddress].challengeID;
    Appeal storage appeal = appeals[listing.challengeID];
    uint appealChallengeID = appeal.appealChallengeID;
    Challenge storage appealChallenge = challenges[appeal.appealChallengeID];

    // Calculates the winner's reward,
    // which is: (winner's full stake) + (dispensationPct * loser's stake)
    uint reward = determineReward(appealChallengeID);

    // Sets flag on challenge being processed
    appealChallenge.resolved = true;

    // Stores the total tokens used for voting by the winning side for reward purposes
    appealChallenge.totalTokens = voting.getTotalNumberOfTokensForWinningOption(appealChallengeID);

    if (voting.isPassed(appealChallengeID)) { // Case: vote passed, appeal challenge succeeded, overturn appeal
      super.resolveChallenge(listingAddress);
      appeal.overturned = true;
      require(token.transfer(appealChallenge.challenger, reward));
      emit _GrantedAppealOverturned(listingAddress, challengeID, appealChallengeID, appealChallenge.rewardPool, appealChallenge.totalTokens);
    } else { // Case: vote not passed, appeal challenge failed, confirm appeal
      resolveOverturnedChallenge(listingAddress);
      require(token.transfer(appeal.requester, reward));
      emit _GrantedAppealConfirmed(listingAddress, challengeID, appealChallengeID, appealChallenge.rewardPool, appealChallenge.totalTokens);
    }
  }

  /**
  @dev                Called by a voter to claim their reward for each completed vote. Someone
                      must call updateStatus() before this can be called.
  @param _challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param _salt        The salt of a voter's commit hash in the given poll
  */
  function claimReward(uint _challengeID, uint _salt) public {
    // Ensures the voter has not already claimed tokens and challenge results have been processed
    require(challenges[_challengeID].tokenClaims[msg.sender] == false);
    require(challenges[_challengeID].resolved == true);

    uint voterTokens = getNumChallengeTokens(msg.sender, _challengeID, _salt);
    uint reward = voterReward(msg.sender, _challengeID, _salt);

    // Subtracts the voter's information to preserve the participation ratios
    // of other voters compared to the remaining pool of rewards
    challenges[_challengeID].totalTokens -= voterTokens;
    challenges[_challengeID].rewardPool -= reward;

    // Ensures a voter cannot claim tokens again
    challenges[_challengeID].tokenClaims[msg.sender] = true;

    require(token.transfer(msg.sender, reward));

    emit _RewardClaimed(_challengeID, reward, msg.sender);
  }

  /**
  @notice gets the number of tokens the voter staked on the winning side of the challenge,
  or the losing side if the challenge has been overturned
  @param voter The Voter to check
  @param challengeID The PLCR pollID of the challenge to check
  @param salt The salt of a voter's commit hash in the given poll
  */
  function getNumChallengeTokens(address voter, uint challengeID, uint salt) internal view returns (uint) {
    bool overturned = appeals[challengeID].appealGranted && !appeals[challengeID].overturned;
    if (overturned) {
      return civilVoting.getNumLosingTokens(voter, challengeID, salt);
    } else {
      return voting.getNumPassingTokens(voter, challengeID, salt);
    }
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
    Challenge challenge = challenges[challengeID];
    Appeal appeal = appeals[challengeID];
    uint totalTokens = challenge.totalTokens;
    uint rewardPool = challenge.rewardPool;
    uint voterTokens = getNumChallengeTokens(voter, challengeID, salt);
    return (voterTokens * rewardPool) / totalTokens;
  }

  /**
  @dev                Called by updateStatus() if the applicationExpiry date passed without a
                      challenge being made. Called by resolveChallenge() if an
                      application/listing beat a challenge. Differs from base implementation in that
                      it also clears out challengeID
  @param listingAddress The listingHash of an application/listingHash to be whitelisted
  */
  function whitelistApplication(address listingAddress) internal {
    super.whitelistApplication(listingAddress);
    listings[listingAddress].challengeID = 0;
  }

  /**
  @notice Updates the state of a listing after a challenge was overtuned via appeal (and no appeal
  challenge was initiated). If challenge previously failed, transfer reward to original challenger.
  Otherwise, add reward to listing's unstaked deposit
  --------
  Emits `_FailedChallengeOverturned` if original challenge failed.
  Emits `_SuccessfulChallengeOverturned` if original challenge succeeded.
  Emits `_ListingRemoved` if original challenge failed and listing was previous whitelisted.
  Emits `_ApplicationRemoved` if original challenge failed and listing was not previously whitelisted.
  Emits `_NewListingWhitelisted` if original challenge succeeded and listing was not previously whitelisted.
  @param listingAddress Address of listing with a challenge that is to be resolved
  */
  function resolveOverturnedChallenge(address listingAddress) private {
    Listing storage listing = listings[listingAddress];
    uint challengeID = listing.challengeID;
    Challenge storage challenge = challenges[challengeID];
    // Calculates the winner's reward,
    uint reward = determineReward(challengeID);

    challenge.resolved = true;
    // Stores the total tokens used for voting by the losing side for reward purposes
    challenge.totalTokens = civilVoting.getTotalNumberOfTokensForLosingOption(challengeID);

    // challenge is overturned, behavior here is opposite resolveChallenge
    if (!voting.isPassed(challengeID)) { // original vote failed (challenge succeded), this should whitelist listing
      whitelistApplication(listingAddress);
      // Unlock stake so that it can be retrieved by the applicant
      listing.unstakedDeposit += reward;

      emit _SuccessfulChallengeOverturned(listingAddress, challengeID, challenge.rewardPool, challenge.totalTokens);
    } else { // original vote succeded (challenge failed), this should de-list listing
      resetListing(listingAddress);
      // Transfer the reward to the challenger
      require(token.transfer(challenge.challenger, reward));

      emit _FailedChallengeOverturned(listingAddress, challengeID, challenge.rewardPool, challenge.totalTokens);
    } 
  }

  /**
  @notice Determines whether a challenge can be resolved for a listing at given address. Throws if no challenge exists.
  @param listingAddress An address for a listing to check
  @return True if challenge exists, has not already been resolved, has not had appeal requested, and has passed the request
  appeal expiry time. False otherwise.
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

  /**
  @notice Determines whether an appeal challenge can be resolved for a listing at given address. Throws if no challenge exists.
  @param listingAddress An address for a listing to check
  @return True if appeal challenge exists, has not already been resolved, and the voting phase for the appeal challenge is ended. False otherwise.
  */
  function appealChallengeCanBeResolved(address listingAddress) view public returns (bool canBeResolved) {
    uint challengeID = listings[listingAddress].challengeID;
    Appeal appeal = appeals[challengeID];
    if (appeal.appealChallengeID == 0) {
      return false;
    }
    return voting.pollEnded(appeal.appealChallengeID);
  }
}
