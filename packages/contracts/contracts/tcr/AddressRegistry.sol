pragma solidity 0.4.19;

import "tokens/eip20/EIP20.sol";

import "./Parameterizer.sol";
import "./PLCRVoting.sol";


contract AddressRegistry {

  // ------
  // EVENTS
  // ------

  event Application(address indexed listingAddress, uint deposit, string data);
  event ChallengeInitiated(address indexed listingAddress, uint deposit, uint indexed pollID, string data);
  event Deposit(address indexed listingAddress, uint added, uint newTotal);
  event Withdrawal(address indexed listingAddress, uint withdrew, uint newTotal);
  event NewListingWhitelisted(address indexed listingAddress);
  event ApplicationRemoved(address indexed listingAddress);
  event ListingRemoved(address indexed listingAddress);
  event ChallengeFailed(address indexed listingAddress, uint indexed challengeID);
  event ChallengeSucceeded(address indexed listingAddress, uint indexed challengeID);
  event RewardClaimed(address indexed voter, uint indexed challengeID, uint reward);

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
    mapping(address => bool) tokenClaims; // Indicates whether a voter has claimed a reward yet
  }

  // Maps challengeIDs to associated challenge data
  mapping(uint => Challenge) internal challenges;

  // Maps addresses to associated listing data
  mapping(address => Listing) internal listings;

  // Global Variables
  EIP20 public token;
  PLCRVoting public voting;
  Parameterizer public parameterizer;
  uint public version = 1;
  uint constant NO_CHALLENGE = 0;

  // ------------
  // CONSTRUCTOR:
  // ------------

  /**
  @dev Contructor         Sets the addresses for token, voting, and parameterizer
  @param tokenAddr       Address of the TCR's intrinsic ERC20 token
  @param plcrAddr        Address of a PLCR voting contract for the provided token
  @param paramsAddr      Address of a Parameterizer contract
  */
  function AddressRegistry(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr) public
  {
    token = EIP20(tokenAddr);
    voting = PLCRVoting(plcrAddr);
    parameterizer = Parameterizer(paramsAddr);
  }

  // --------------------
  // PUBLISHER INTERFACE:
  // --------------------

  /**
  @dev                Allows a user to start an application. Takes tokens from user and sets
                      apply stage end time.
  @param amount      The number of ERC20 tokens a user is willing to potentially stake
  @param data        Extra data relevant to the application. Think IPFS hashes.
  */
  function apply(address listingAddress, uint amount, string data) public {
    require(!getListingIsWhitelisted(listingAddress));
    require(!appWasMade(listingAddress));
    require(amount >= parameterizer.get("minDeposit"));
    require(block.timestamp + parameterizer.get("applyStageLen") > block.timestamp); // avoid overflow

    // Sets owner
    Listing storage listing = listings[listingAddress];
    listing.owner = msg.sender;

    // Transfers tokens from user to Registry contract
    require(token.transferFrom(msg.sender, this, amount));

    // Sets apply stage end time
    listing.applicationExpiry = block.timestamp + parameterizer.get("applyStageLen");
    listing.unstakedDeposit = amount;

    Application(listingAddress, amount, data);
  }

  /**
  @dev                Allows the owner of a listingHash to increase their unstaked deposit.
  @param amount      The number of ERC20 tokens to increase a user's unstaked deposit
  */
  function deposit(address listingAddress, uint amount) external {
    Listing storage listing = listings[listingAddress];

    require(listing.owner == msg.sender);
    require(token.transferFrom(msg.sender, this, amount));

    listing.unstakedDeposit += amount;

    Deposit(listingAddress, amount, listing.unstakedDeposit);
  }

  /**
  @dev                Allows the owner of a listingHash to decrease their unstaked deposit.
  @param amount      The number of ERC20 tokens to withdraw from the unstaked deposit.
  */
  function withdraw(address listingAddress, uint amount) external {
    Listing storage listing = listings[listingAddress];

    require(listing.owner == msg.sender);
    require(amount <= listing.unstakedDeposit);
    require(listing.unstakedDeposit - amount >= parameterizer.get("minDeposit"));

    require(token.transfer(msg.sender, amount));

    listing.unstakedDeposit -= amount;

    Withdrawal(listingAddress, amount, listing.unstakedDeposit);
  }

  /**
  @dev                Allows the owner of a listing to remove the listingHash from the whitelist
                      Returns all tokens to the owner of the listing
  */
  function exitListing(address listingAddress) external {
    Listing storage listing = listings[listingAddress];

    require(listing.owner == msg.sender);
    require(getListingIsWhitelisted(listingAddress));

    // Cannot exit during ongoing challenge
    require(listing.challengeID == NO_CHALLENGE || challenges[listing.challengeID].resolved);

    // Remove listingHash & return tokens
    resetListing(listingAddress);
  }

  // -----------------------
  // TOKEN HOLDER INTERFACE:
  // -----------------------

  /**
  @dev                Starts a poll for a listingAddress which is either in the apply stage or
                      already in the whitelist. Tokens are taken from the challenger and the
                      applicant's deposits are locked.
                      D elists listing and returns NO_CHALLENGE if listing's unstakedDeposit
                      is less than current minDeposit
  @param listingAddress The listingAddress being challenged, whether listed or in application
  @param data        Extra data relevant to the challenge. Think IPFS hashes.
  */
  function challenge(address listingAddress, string data) public returns (uint challengeID) {
    Listing storage listing = listings[listingAddress];
    uint deposit = parameterizer.get("minDeposit");

    // Listing must be in apply stage or already on the whitelist
    require(appWasMade(listingAddress) || listing.isWhitelisted);
    // Prevent multiple challenges
    require(listing.challengeID == NO_CHALLENGE || challenges[listing.challengeID].resolved);

    if (listing.unstakedDeposit < deposit) {
      // Not enough tokens, listing auto-delisted
      resetListing(listingAddress);
      return NO_CHALLENGE;
    }

    // Takes tokens from challenger
    require(token.transferFrom(msg.sender, this, deposit));

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
    listings[listingAddress].challengeID = pollID;

    // Locks tokens for listingHash during challenge
    listings[listingAddress].unstakedDeposit -= deposit;

    ChallengeInitiated(listingAddress, deposit, pollID, data);
    return pollID;
  }

  /**
  @dev                Updates a listing's status from 'application' to 'listing' or resolves
                      a challenge if one exists.
  @param listingAddress The listingAddress whose status is being updated
  */
  function updateStatus(address listingAddress) public {
    if (canBeWhitelisted(listingAddress)) {
      whitelistApplication(listingAddress);
      NewListingWhitelisted(listingAddress);
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
  @dev                Called by a voter to claim their reward for each completed vote. Someone
                      must call updateStatus() before this can be called.
  @param challengeID The PLCR pollID of the challenge a reward is being claimed for
  @param salt        The salt of a voter's commit hash in the given poll
  */
  function claimReward(uint challengeID, uint salt) public {
    // Ensures the voter has not already claimed tokens and challenge results have been processed
    require(challenges[challengeID].tokenClaims[msg.sender] == false);
    require(challenges[challengeID].resolved == true);

    uint voterTokens = voting.getNumPassingTokens(msg.sender, challengeID, salt, false);
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

  // --------
  // GETTERS:
  // --------

  // --------
  // Basic Listing Getters
  // --------
  function getListingApplicationExpiry(address listingAddress) public view returns (uint) {
    return listings[listingAddress].applicationExpiry;
  }

  function getListingOwner(address listingAddress) public view returns (address) {
    return listings[listingAddress].owner;
  }

  function getListingIsWhitelisted(address listingAddress) public view returns (bool) {
    return listings[listingAddress].isWhitelisted;
  }

  function getListingUnstakedDeposit(address listingAddress) public view returns (uint) {
    return listings[listingAddress].unstakedDeposit;
  }

  function getListingChallengeID(address listingAddress) public view returns (uint) {
    return listings[listingAddress].challengeID;
  }

  // --------
  // Basic Challenge Getters
  // --------
  function getChallengeRewardPool(uint challengeID) public view returns (uint) {
    return challenges[challengeID].rewardPool;
  }

  function getChallengeChallenger(uint challengeID) public view returns (address) {
    return challenges[challengeID].challenger;
  }

  function getChallengeResolved(uint challengeID) public view returns (bool) {
    return challenges[challengeID].resolved;
  }

  function getChallengeStake(uint challengeID) public view returns (uint) {
    return challenges[challengeID].stake;
  }

  function getChallengeTotalTokens(uint challengeID) public view returns (uint) {
    return challenges[challengeID].totalTokens;
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
    uint salt) public view returns (uint)
  {
    uint totalTokens = challenges[challengeID].totalTokens;
    uint rewardPool = challenges[challengeID].rewardPool;
    uint voterTokens = voting.getNumPassingTokens(voter, challengeID, salt, false);
    return (voterTokens * rewardPool) / totalTokens;
  }

  /**
  @dev                Determines whether the given listingAddress be isWhitelist.
  @param listingAddress The listingAddress whose status is to be examined
  */
  function canBeWhitelisted(address listingAddress) view public returns (bool) {
    uint challengeID = listings[listingAddress].challengeID;

    // Ensures that the application was made,
    // the application period has ended,
    // the listingHash can be whitelisted,
    // and either: the challengeID == 0, or the challenge has been resolved.
    // solium-disable operator-whitespace
    if (
      appWasMade(listingAddress) &&
      listings[listingAddress].applicationExpiry < now &&
      !getListingIsWhitelisted(listingAddress) &&
      (challengeID == NO_CHALLENGE || challenges[challengeID].resolved == true)
    ) {
      return true;
    }
    // solium-enable operator-whitespace

    return false;
  }

  /**
  @dev                Returns true if apply was called for this listingAddress
  @param listingAddress The listingAddress whose status is to be examined
  */
  function appWasMade(address listingAddress) view public returns (bool) {
    return listings[listingAddress].applicationExpiry > 0;
  }

  /**
  @dev                Returns true if the application/listing has an unresolved challenge
  @param listingAddress The listingAddress whose status is to be examined
  */
  function challengeExists(address listingAddress) view public returns (bool) {
    uint challengeID = listings[listingAddress].challengeID;

    return (listings[listingAddress].challengeID > NO_CHALLENGE && !challenges[challengeID].resolved);
  }

  /**
  @dev                Determines whether voting has concluded in a challenge for a given
                      listingAddress. Throws if no challenge exists.
  @param listingAddress A listingAddress with an unresolved challenge
  */
  function challengeCanBeResolved(address listingAddress) view public returns (bool) {
    uint challengeID = listings[listingAddress].challengeID;

    require(challengeExists(listingAddress));

    return voting.pollEnded(challengeID);
  }

  /**
  @dev                Determines the number of tokens awarded to the winning party in a challenge.
  @param challengeID The challengeID to determine a reward for
  */
  function determineReward(uint challengeID) public view returns (uint) {
    require(!challenges[challengeID].resolved && voting.pollEnded(challengeID));

    // Edge case, nobody voted, give all tokens to the challenger.
    if (voting.getTotalNumberOfTokensForWinningOption(challengeID) == 0) {
      return 2 * challenges[challengeID].stake;
    }

    return (2 * challenges[challengeID].stake) - challenges[challengeID].rewardPool;
  }

  /**
  @dev                Getter for Challenge tokenClaims mappings
  @param challengeID The challengeID to query
  @param voter       The voter whose claim status to query for the provided challengeID
  */
  function tokenClaims(uint challengeID, address voter) public view returns (bool) {
    return challenges[challengeID].tokenClaims[voter];
  }

  // ----------------
  // PRIVATE FUNCTIONS:
  // ----------------

  /**
  @dev                Determines the winner in a challenge. Rewards the winner tokens and
                      either whitelists or de-whitelists the listingAddress.
  @param listingAddress A listingAddress with a challenge that is to be resolved
  */
  function resolveChallenge(address listingAddress) internal {
    uint challengeID = listings[listingAddress].challengeID;

    // Calculates the winner's reward,
    // which is: (winner's full stake) + (dispensationPct * loser's stake)
    uint reward = determineReward(challengeID);

    // Records whether the listingAddress is a listing or an application
    bool wasWhitelisted = getListingIsWhitelisted(listingAddress);


    if (voting.isPassed(challengeID)) { // Case: challenge failed
      whitelistApplication(listingAddress);
      // Unlock stake so that it can be retrieved by the applicant
      listings[listingAddress].unstakedDeposit += reward;

      ChallengeFailed(listingAddress, challengeID);
      if (!wasWhitelisted) {
        NewListingWhitelisted(listingAddress);
      }
    } else { // Case: challenge succeeded
      resetListing(listingAddress);
      // Transfer the reward to the challenger
      require(token.transfer(challenges[challengeID].challenger, reward));

      ChallengeSucceeded(listingAddress, challengeID);
      if (wasWhitelisted) {
        ListingRemoved(listingAddress);
      } else {
        ApplicationRemoved(listingAddress);
      }
    }

    // Sets flag on challenge being processed
    challenges[challengeID].resolved = true;

    // Stores the total tokens used for voting by the winning side for reward purposes
    challenges[challengeID].totalTokens = voting.getTotalNumberOfTokensForWinningOption(challengeID);
  }

  /**
  @dev                Called by updateStatus() if the applicationExpiry date passed without a
                      challenge being made. Called by resolveChallenge() if an
                      application/listing beat a challenge.
  @param listingAddress The listingAddress of an application/listing to be isWhitelist
  */
  function whitelistApplication(address listingAddress) internal {
    listings[listingAddress].isWhitelisted = true;
  }

  /**
  @dev                Deletes a listingAddress from the whitelist and transfers tokens back to owner
  @param listingAddress The listing to delete
  */
  function resetListing(address listingAddress) private {
    Listing storage listing = listings[listingAddress];

    // Transfers any remaining balance back to the owner
    if (listing.unstakedDeposit > 0)
        require(token.transfer(listing.owner, listing.unstakedDeposit));

    delete listings[listingAddress];
  }
}
