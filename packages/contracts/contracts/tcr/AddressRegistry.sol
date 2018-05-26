pragma solidity ^0.4.19;

import "./installed_contracts/tokens/contracts/eip20/EIP20Interface.sol";
import "../zeppelin-solidity/SafeMath.sol";
import "./Parameterizer.sol";
import "./PLCRVoting.sol";

/**
@title AddressRegistry - A Token Curated Registry using Ethereum Addresses as keys for listings
@dev This was originally forked from the (Mike Goldin / AdChain TCR implementation)[https://github.com/skmgoldin/tcr] at commit `b206561` (Jan 22 2018)
*/
contract AddressRegistry {

  // ------
  // EVENTS
  // ------

  event _Application(address indexed listingAddress, uint deposit, uint appEndDate, string data, address indexed applicant);
  event _Challenge(address indexed listingAddress, uint indexed challengeID, string data, uint commitEndDate, uint revealEndDate, address indexed challenger);
  event _Deposit(address indexed listingAddress, uint added, uint newTotal, address indexed owner);
  event _Withdrawal(address indexed listingAddress, uint withdrew, uint newTotal, address indexed owner);
  event _ApplicationWhitelisted(address indexed listingAddress);
  event _ApplicationRemoved(address indexed listingAddress);
  event _ListingRemoved(address indexed listingAddress);
  event _ListingWithdrawn(address indexed listingAddress);
  event _TouchAndRemoved(address indexed listingAddress);
  event _ChallengeFailed(address indexed listingAddress, uint indexed challengeID, uint rewardPool, uint totalTokens);
  event _ChallengeSucceeded(address indexed listingAddress, uint indexed challengeID, uint rewardPool, uint totalTokens);
  event _RewardClaimed(uint indexed challengeID, uint reward, address indexed voter);

  using SafeMath for uint;

  struct Listing {
    uint applicationExpiry; // Expiration date of apply stage
    bool isWhitelisted;     // Indicates registry status
    address owner;          // Owner of listing
    uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge
    uint challengeID;       // Corresponds to a PollID in PLCRVoting
  }

  struct Challenge {
    uint rewardPool;        // (remaining) Pool of tokens to be distributed to winning voters
    address challenger;     // Owner of Challenge
    bool resolved;          // Indication of if challenge is resolved
    uint stake;             // Number of tokens at stake for either party during challenge
    uint totalTokens;       // (remaining) Number of tokens used in voting by the winning side
    mapping(address => bool) hasClaimedTokens; // Indicates whether a voter has claimed a reward yet
  }

  // Maps challengeIDs to associated challenge data
  mapping(uint => Challenge) public challenges;

  // Maps addresses to associated listing data
  mapping(address => Listing) public listings;

  // Global Variables
  EIP20Interface public token;
  PLCRVoting public voting;
  Parameterizer public parameterizer;

  // ------------
  // CONSTRUCTOR:
  // ------------

  /**
  @notice Contructor. Sets the addresses for token, voting, and parameterizer
  @param tokenAddr Address of the TCR's intrinsic ERC20 token
  @param plcrAddr Address of a PLCR voting contract for the provided token
  @param paramsAddr Address of a Parameterizer contract
  */
  function AddressRegistry(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr) public
  {
    token = EIP20Interface(tokenAddr);
    voting = PLCRVoting(plcrAddr);
    parameterizer = Parameterizer(paramsAddr);
  }

  // --------------------
  // PUBLISHER INTERFACE:
  // --------------------

  /**
  @notice Allows a user to start an application. Takes tokens from user and sets apply stage end time.
  --------
  In order to apply:
  1) Listing must not currently be whitelisted
  2) Listing must not currently be in application pahse
  3) Tokens deposited must be greater than or equal to the minDeposit value from the parameterizer
  --------
  Emits `_Application` event if successful
  @param amount The number of ERC20 tokens a user is willing to potentially stake
  @param data Extra data relevant to the application. Think IPFS hashes.
  */
  function apply(address listingAddress, uint amount, string data) public {
    Listing storage listing = listings[listingAddress];
    require(!listing.isWhitelisted);
    require(!appWasMade(listingAddress));
    require(amount >= parameterizer.get("minDeposit"));

    // Sets owner
    listing.owner = msg.sender;
    // Sets apply stage end time
    listing.applicationExpiry = block.timestamp.add(parameterizer.get("applyStageLen"));
    listing.unstakedDeposit = amount;

    // Transfers tokens from user to Registry contract
    require(token.transferFrom(msg.sender, this, amount));
    emit _Application(listingAddress, amount, listing.applicationExpiry, data, msg.sender);
  }

  /**
  @notice Allows the owner of a listingHash to increase their unstaked deposit.
  --------
  In order to increase deposit:
  1) sender of message must be owner of listing
  2) Must be able to transfer `amount` of tokens into this contract
  --------
  Emits `_Deposit` if successful
  @param amount The number of ERC20 tokens to increase a user's unstaked deposit by
  */
  function deposit(address listingAddress, uint amount) external {
    Listing storage listing = listings[listingAddress];
    require(listing.owner == msg.sender);

    listing.unstakedDeposit += amount;

    require(token.transferFrom(msg.sender, this, amount));
    emit _Deposit(listingAddress, amount, listing.unstakedDeposit, msg.sender);
  }

  /**
  @notice Allows the owner of a listingHash to decrease their unstaked deposit.
  --------
  In order to withdraw from deposit:
  1) sender of message must be owner of listing
  2) Amount to withdraw must be less than or equal to unstaked deposit on listing
  3) Amount of tokens that would be remaining after withdrawal must be less than or equal to minDeposit from parameterizer.
  --------
  Emits `_Withdrawal` if successful
  @param listingAddress Address of listing to withdraw tokens from
  @param amount The number of ERC20 tokens to withdraw from the unstaked deposit
  */
  function withdraw(address listingAddress, uint amount) external {
    Listing storage listing = listings[listingAddress];

    require(listing.owner == msg.sender);
    require(amount <= listing.unstakedDeposit);
    require(listing.unstakedDeposit - amount >= parameterizer.get("minDeposit"));

    require(token.transfer(msg.sender, amount));

    listing.unstakedDeposit -= amount;

    emit _Withdrawal(listingAddress, amount, listing.unstakedDeposit, msg.sender);
  }

  /**
  @notice Allows the owner of a listing to remove the listingHash from the whitelist
  Returns all tokens to the owner of the listing
  --------
  In order to exit a listing:
  1) Sender of message must be the owner of the listing
  2) Listing must currently be whitelisted
  3) Listing must not have an active challenge
  --------
  Emits `_ListingWithdrawn` if successful
  @param listingAddress Address of listing to exit
  */
  function exitListing(address listingAddress) external {
    Listing storage listing = listings[listingAddress];

    require(listing.owner == msg.sender);
    require(listings[listingAddress].isWhitelisted);

    // Cannot exit during ongoing challenge
    require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

    // Remove listingHash & return tokens
    resetListing(listingAddress);
    emit _ListingWithdrawn(listingAddress);
  }

  // -----------------------
  // TOKEN HOLDER INTERFACE:
  // -----------------------

  /**
  @notice Starts a poll for a listingAddress which is either in the apply stage or
  already in the whitelist. Tokens are taken from the challenger and the applicant's deposits are locked.
  Delists listing and returns 0 if listing's unstakedDeposit is less than current minDeposit
  --------
  In order to challenge a listing:
  1) Listing must be in application phase or whitelisted
  2) Listing must not have an active challenge
  3) Sender of message must be able to transfer minDeposit tokens into this contract
  --------
  Emits `_ChallengeInitiated` if successful
  @param listingAddress The listingAddress being challenged, whether listed or in application
  @param data        Extra data relevant to the challenge. Think IPFS hashes.
  */
  function challenge(address listingAddress, string data) public returns (uint challengeID) {
    Listing storage listing = listings[listingAddress];
    uint deposit = parameterizer.get("minDeposit");

    // Listing must be in apply stage or already on the whitelist
    require(appWasMade(listingAddress));
    // Prevent multiple challenges
    require(listing.challengeID == 0);

    if (listing.unstakedDeposit < deposit) {
      // Not enough tokens, listing auto-delisted
      resetListing(listingAddress);
      emit _TouchAndRemoved(listingAddress);
      return 0;
    }

    // Starts poll
    uint pollID = voting.startPoll(
      parameterizer.get("voteQuorum"),
      parameterizer.get("commitStageLen"),
      parameterizer.get("revealStageLen")
    );

    challenges[pollID] = Challenge({
      challenger: msg.sender,
      rewardPool: ((100 - parameterizer.get("dispensationPct")) * deposit) / 100,
      stake: deposit,
      resolved: false,
      totalTokens: 0
    });

    // Updates listingHash to store most recent challenge
    listing.challengeID = pollID;

    // Locks tokens for listingHash during challenge
    listing.unstakedDeposit -= deposit;

    // Takes tokens from challenger
    require(token.transferFrom(msg.sender, this, deposit));

    // solium-disable-next-line
    var (commitEndDate, revealEndDate,) = voting.pollMap(pollID);

    emit _Challenge(listingAddress, pollID, data, commitEndDate, revealEndDate, msg.sender);
    return pollID;
  }

  /**
  @notice Updates a listing's status from 'application' to 'listing' or resolves a challenge if one exists.
  @param listingAddress The listingAddress whose status is being updated
  */
  function updateStatus(address listingAddress) public {
    if (canBeWhitelisted(listingAddress)) {
      whitelistApplication(listingAddress);
    } else if (challengeCanBeResolved(listingAddress)) {
      resolveChallenge(listingAddress);
    } else {
      revert();
    }
  }

  // ----------------
  // TOKEN FUNCTIONS:
  // ----------------

  /**
  @notice Called by a voter to claim their reward for each completed vote.
  --------
  In order to claim reward for a challenge:
  1) Challenge must be resolved
  2) Message sender must not have already claimed tokens for this challenge
  --------
  Emits `_RewardClaimed` if successful
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt The salt of a voter's commit hash in the given poll
  */
  function claimReward(uint challengeID, uint salt) public {
    Challenge storage challenge = challenges[challengeID];
    claimChallengeReward(challengeID, salt, challenge, false);
  }

  /**
  @notice Called by a voter to claim their reward for each completed vote.
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt        The salt of a voter's commit hash in the given poll
  */
  function claimChallengeReward(uint challengeID, uint salt, Challenge storage challenge, bool overturned) internal {
    // Ensures the voter has not already claimed tokens and challenge results have been processed
    require(challenge.hasClaimedTokens[msg.sender] == false);
    require(challenge.resolved == true);

    uint voterTokens = 0;
    if (overturned) {
      voterTokens = voting.getNumLosingTokens(msg.sender, challengeID, salt);
    } else {
      voterTokens = voting.getNumPassingTokens(msg.sender, challengeID, salt);
    }
    uint reward = voterReward(msg.sender, challengeID, salt);

    // Subtracts the voter's information to preserve the participation ratios
    // of other voters compared to the remaining pool of rewards
    challenge.totalTokens -= voterTokens;
    challenge.rewardPool -= reward;

    // Ensures a voter cannot claim tokens again
    challenge.hasClaimedTokens[msg.sender] = true;

    require(token.transfer(msg.sender, reward));

    emit _RewardClaimed(challengeID, reward, msg.sender);
  }

  // --------
  // GETTERS:
  // --------

  /**
  @notice Calculates the provided voter's token reward for the given poll.
  @param voter The address of the voter whose reward balance is to be returned
  @param challengeID The pollID of the challenge a reward balance is being queried for
  @param salt The salt of the voter's commit hash in the given poll
  @return The uint indicating the voter's reward
  */
  function voterReward(
    address voter,
    uint challengeID,
    uint salt) public view returns (uint)
  {
    Challenge challenge = challenges[challengeID];
    uint totalTokens = challenge.totalTokens;
    uint rewardPool = challenge.rewardPool;
    uint voterTokens = voting.getNumPassingTokens(voter, challengeID, salt);
    return (voterTokens * rewardPool) / totalTokens;
  }

  /**
  @notice Determines whether the given listing can be whitelisted
  @param listingAddress The listingAddress whose status is to be examined
  @return True if an application has passed its expiry without being challenged or it was challenged and the challenge
  has been resolved and listing is not already whitelisted. False otherwise.
  */
  function canBeWhitelisted(address listingAddress) view public returns (bool) {
    Listing listing = listings[listingAddress];
    uint challengeID = listing.challengeID;
    Challenge challenge = challenges[challengeID];

    // Ensures that the application was made,
    // the application period has ended,
    // the listingHash can be whitelisted,
    // and either: the challengeID == 0, or the challenge has been resolved.
    // solium-disable operator-whitespace
    if (
      appWasMade(listingAddress) &&
      listing.applicationExpiry < now &&
      !listing.isWhitelisted &&
      (challengeID == 0 || challenge.resolved == true)
    ) {
      return true;
    }
    return false;
  }

  /**
  @notice Returns true if apply was called for this listingAddress and listing/application not yet removed
  @param listingAddress The listingAddress whose status is to be examined
  @return True if an address is in the application phase, or whitelisted. False if never applied or listing/application removed.
  */
  function appWasMade(address listingAddress) view public returns (bool) {
    return listings[listingAddress].applicationExpiry > 0;
  }

  /**
  @notice Gets whether or not the given listing address has an active challenge
  @param listingAddress The listingAddress whose status is to be examined
  @return True if listing has an active, unresolved challenge. False otherwise.
  */
  function challengeExists(address listingAddress) view public returns (bool) {
    uint challengeID = listings[listingAddress].challengeID;

    return (listings[listingAddress].challengeID > 0 && !challenges[challengeID].resolved);
  }

  /**
  @notice Determines whether voting has concluded in a challenge for a given listingAddress.
  Reverts if no challenge exists.
  @param listingAddress A listingAddress with an unresolved challenge
  @return True if a challenge can be resolved, false otherwise
  */
  function challengeCanBeResolved(address listingAddress) view public returns (bool) {
    uint challengeID = listings[listingAddress].challengeID;

    require(challengeExists(listingAddress));

    return voting.pollEnded(challengeID);
  }

  /**
  @notice Determines the number of tokens awarded to the winning party in a challenge.
  @param challengeID The ID of a challenge to determine a reward for
  @return Number of tokens awarded to winning party in a challenge
  */
  function determineReward(uint challengeID) public view returns (uint) {
    return determineChallengeReward(challenges[challengeID], challengeID);
  }

    /**
  @notice Determines the number of tokens awarded to the winning party in a challenge.
  @param challengeID The ID of a challenge to determine a reward for
  */
  function determineChallengeReward(Challenge challenge, uint challengeID) internal view returns (uint) {
    require(!challenge.resolved && voting.pollEnded(challengeID));

    // Edge case, nobody voted, give all tokens to the listing owner.
    if (voting.getTotalNumberOfTokensForWinningOption(challengeID) == 0) {
      return 2 * challenge.stake;
    }

    return (2 * challenge.stake) - challenge.rewardPool;
  }

  /**
  @notice Getter for Challenge hasClaimedTokens mapping
  @param challengeID The challengeID to query
  @param voter The voter whose claim status to query for given challenge
  @return true if voter has claimed tokens for given challenge, false otherwise
  */
  function hasClaimedTokens(uint challengeID, address voter) public view returns (bool hasClaimedTokens) {
    return challenges[challengeID].hasClaimedTokens[voter];
  }

  // ----------------
  // PRIVATE FUNCTIONS:
  // ----------------

  /**
  @notice Determines the winner in a challenge. Rewards the winner tokens and either whitelists or
  de-whitelists the listingAddress.
  @param listingAddress A listingAddress with a challenge that is to be resolved
  */
  function resolveChallenge(address listingAddress) internal {
    Listing storage listing = listings[listingAddress];
    uint challengeID = listing.challengeID;
    Challenge storage challenge = challenges[challengeID];

    // Calculates the winner's reward,
    // which is: (winner's full stake) + (dispensationPct * loser's stake)
    uint reward = determineReward(challengeID);

    // Sets flag on challenge being processed
    challenge.resolved = true;

    // Stores the total tokens used for voting by the winning side for reward purposes
    challenge.totalTokens = voting.getTotalNumberOfTokensForWinningOption(challengeID);

    if (voting.isPassed(challengeID)) { // Case: challenge succeeded, listing to be removed
      resetListing(listingAddress);
      // Transfer the reward to the challenger
      require(token.transfer(challenge.challenger, reward));
      emit _ChallengeSucceeded(listingAddress, challengeID, challenge.rewardPool, challenge.totalTokens);
    } else { // Case: challenge failed, listing to be whitelisted
      whitelistApplication(listingAddress);
      // Unlock stake so that it can be retrieved by the applicant
      listing.unstakedDeposit += reward;

      listing.challengeID = 0;
      emit _ChallengeFailed(listingAddress, challengeID, challenge.rewardPool, challenge.totalTokens);
    }
  }

  /**
  @dev Called by `updateStatus()` if the applicationExpiry date passed without a challenge being made.
  Called by resolveChallenge() if an application/listing beat a challenge.
  @param listingAddress The listingAddress of an application/listing to be isWhitelist
  */
  function whitelistApplication(address listingAddress) internal {
    Listing storage listing = listings[listingAddress];
    bool wasWhitelisted = listing.isWhitelisted;
    listing.isWhitelisted = true;
    if (!wasWhitelisted) {
      emit _ApplicationWhitelisted(listingAddress);
    }
  }

  /**
  @notice Deletes a listingAddress from the whitelist and transfers tokens back to owner
  @param listingAddress The listing to delete
  */
  function resetListing(address listingAddress) internal {
    Listing storage listing = listings[listingAddress];
    bool wasWhitelisted = listing.isWhitelisted;
    address owner = listing.owner;
    uint unstakedDeposit = listing.unstakedDeposit;

    delete listings[listingAddress];

    // Transfers any remaining balance back to the owner
    if (unstakedDeposit > 0) {
      require(token.transfer(owner, unstakedDeposit));
    }
    if (wasWhitelisted) {
      emit _ListingRemoved(listingAddress);
    } else {
      emit _ApplicationRemoved(listingAddress);
    }
  }
}
