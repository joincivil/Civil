pragma solidity ^0.4.18;

import "tokens/eip20/EIP20.sol";
import "./Parameterizer.sol";
import "./PLCRVoting.sol";


contract AddressRegistry {

    // ------
    // EVENTS
    // ------

    event Application(address listingAddress, uint deposit, string data);
    event ChallengeInitiated(address listingAddress, uint deposit, uint pollID, string data);
    event Deposit(address listingAddress, uint added, uint newTotal);
    event Withdrawal(address listingAddress, uint withdrew, uint newTotal);
    event NewListingWhitelisted(address listingAddress);
    event ApplicationRemoved(address listingAddress);
    event ListingRemoved(address listingAddress);
    event ChallengeFailed(uint challengeID);
    event ChallengeSucceeded(uint challengeID);
    event RewardClaimed(address voter, uint challengeID, uint reward);

    struct Listing {
        uint applicationExpiry; // Expiration date of apply stage
        bool whitelisted;       // Indicates registry status
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
    mapping(uint => Challenge) public challenges;

    // Maps addresses to associated listing data
    mapping(address => Listing) public listings;

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
    @param _tokenAddr       Address of the TCR's intrinsic ERC20 token
    @param _plcrAddr        Address of a PLCR voting contract for the provided token
    @param _paramsAddr      Address of a Parameterizer contract 
    */
    function AddressRegistry(
        address _tokenAddr,
        address _plcrAddr,
        address _paramsAddr
    ) public {
        token = EIP20(_tokenAddr);
        voting = PLCRVoting(_plcrAddr);
        parameterizer = Parameterizer(_paramsAddr);
    }

    // --------------------
    // PUBLISHER INTERFACE:
    // --------------------

    /**
    @dev                Allows a user to start an application. Takes tokens from user and sets
                        apply stage end time.
    @param _amount      The number of ERC20 tokens a user is willing to potentially stake
    @param _data        Extra data relevant to the application. Think IPFS hashes.
    */
    function apply(address _listingAddress, uint _amount, string _data) external {
        require(!isWhitelisted(_listingAddress));
        require(!appWasMade(_listingAddress));
        require(_amount >= parameterizer.get("minDeposit"));
        require(block.timestamp + parameterizer.get("applyStageLen") > block.timestamp); // avoid overflow  

        // Sets owner
        Listing storage listing = listings[_listingAddress];
        listing.owner = msg.sender;

        // Transfers tokens from user to Registry contract
        require(token.transferFrom(msg.sender, this, _amount));

        // Sets apply stage end time
        listing.applicationExpiry = block.timestamp + parameterizer.get("applyStageLen");
        listing.unstakedDeposit = _amount;

        Application(_listingAddress, _amount, _data);
    }

    /**
    @dev                Allows the owner of a listingHash to increase their unstaked deposit.
    @param _amount      The number of ERC20 tokens to increase a user's unstaked deposit
    */
    function deposit(address _listingAddress, uint _amount) external {
        Listing storage listing = listings[_listingAddress];

        require(listing.owner == msg.sender);
        require(token.transferFrom(msg.sender, this, _amount));

        listing.unstakedDeposit += _amount;

        Deposit(_listingAddress, _amount, listing.unstakedDeposit);
    }

    /**
    @dev                Allows the owner of a listingHash to decrease their unstaked deposit.
    @param _amount      The number of ERC20 tokens to withdraw from the unstaked deposit.
    */
    function withdraw(address _listingAddress, uint _amount) external {
        Listing storage listing = listings[_listingAddress];

        require(listing.owner == msg.sender);
        require(_amount <= listing.unstakedDeposit);
        require(listing.unstakedDeposit - _amount >= parameterizer.get("minDeposit"));

        require(token.transfer(msg.sender, _amount));

        listing.unstakedDeposit -= _amount;

        Withdrawal(_listingAddress, _amount, listing.unstakedDeposit);
    }

    /**
    @dev                Allows the owner of a listing to remove the listingHash from the whitelist
                        Returns all tokens to the owner of the listing
    */
    function exitListing(address _listingAddress) external {
        Listing storage listing = listings[_listingAddress];

        require(listing.owner == msg.sender);
        require(isWhitelisted(_listingAddress));

        // Cannot exit during ongoing challenge
        require(listing.challengeID == NO_CHALLENGE || challenges[listing.challengeID].resolved);

        // Remove listingHash & return tokens
        resetListing(_listingAddress);
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
    @param _listingAddress The listingAddress being challenged, whether listed or in application
    @param _data        Extra data relevant to the challenge. Think IPFS hashes.
    */
    function challenge(address _listingAddress, string _data) external returns (uint challengeID) {
        Listing storage listing = listings[_listingAddress];
        uint deposit = parameterizer.get("minDeposit");

        // Listing must be in apply stage or already on the whitelist
        require(appWasMade(_listingAddress) || listing.whitelisted);
        // Prevent multiple challenges
        require(listing.challengeID == NO_CHALLENGE || challenges[listing.challengeID].resolved);

        if (listing.unstakedDeposit < deposit) {
            // Not enough tokens, listing auto-delisted
            resetListing(_listingAddress);
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
        listings[_listingAddress].challengeID = pollID;

        // Locks tokens for listingHash during challenge
        listings[_listingAddress].unstakedDeposit -= deposit;

        ChallengeInitiated(_listingAddress, deposit, pollID, _data);
        return pollID;
    }

    /**
    @dev                Updates a listing's status from 'application' to 'listing' or resolves
                        a challenge if one exists.
    @param _listingAddress The listingAddress whose status is being updated
    */
    function updateStatus(address _listingAddress) public {
        if (canBeWhitelisted(_listingAddress)) {
          whitelistApplication(_listingAddress);
          NewListingWhitelisted(_listingAddress);
        } else if (challengeCanBeResolved(_listingAddress)) {
          resolveChallenge(_listingAddress);
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
    @param _challengeID The PLCR pollID of the challenge a reward is being claimed for
    @param _salt        The salt of a voter's commit hash in the given poll
    */
    function claimReward(uint _challengeID, uint _salt) public {
        // Ensures the voter has not already claimed tokens and challenge results have been processed
        require(challenges[_challengeID].tokenClaims[msg.sender] == false);
        require(challenges[_challengeID].resolved == true);

        uint voterTokens = voting.getNumPassingTokens(msg.sender, _challengeID, _salt);
        uint reward = voterReward(msg.sender, _challengeID, _salt);

        // Subtracts the voter's information to preserve the participation ratios
        // of other voters compared to the remaining pool of rewards
        challenges[_challengeID].totalTokens -= voterTokens;
        challenges[_challengeID].rewardPool -= reward;

        require(token.transfer(msg.sender, reward));

        // Ensures a voter cannot claim tokens again
        challenges[_challengeID].tokenClaims[msg.sender] = true;

        RewardClaimed(msg.sender, _challengeID, reward);
    }

    // --------
    // GETTERS:
    // --------

    /**
    @dev                Calculates the provided voter's token reward for the given poll.
    @param _voter       The address of the voter whose reward balance is to be returned
    @param _challengeID The pollID of the challenge a reward balance is being queried for
    @param _salt        The salt of the voter's commit hash in the given poll
    @return             The uint indicating the voter's reward
    */
    function voterReward(address _voter, uint _challengeID, uint _salt)
    public view returns (uint) {
        uint totalTokens = challenges[_challengeID].totalTokens;
        uint rewardPool = challenges[_challengeID].rewardPool;
        uint voterTokens = voting.getNumPassingTokens(_voter, _challengeID, _salt);
        return (voterTokens * rewardPool) / totalTokens;
    }

    /**
    @dev                Determines whether the given listingAddress be whitelisted.
    @param _listingAddress The _listingAddress whose status is to be examined
    */
    function canBeWhitelisted(address _listingAddress) view public returns (bool) {
        uint challengeID = listings[_listingAddress].challengeID;

        // Ensures that the application was made,
        // the application period has ended,
        // the listingHash can be whitelisted,
        // and either: the challengeID == 0, or the challenge has been resolved.
        if (
            appWasMade(_listingAddress) &&
            listings[_listingAddress].applicationExpiry < now &&
            !isWhitelisted(_listingAddress) &&
            (challengeID == NO_CHALLENGE || challenges[challengeID].resolved == true)
        ) { return true; }

        return false;
    }

    /**
    @dev                Returns true if the provided listingAddress is whitelisted
    @param _listingAddress The listingAddress whose status is to be examined
    */
    function isWhitelisted(address _listingAddress) view public returns (bool) {
        return listings[_listingAddress].whitelisted;
    }

    /**
    @dev                Returns true if apply was called for this listingAddress
    @param _listingAddress The listingAddress whose status is to be examined
    */
    function appWasMade(address _listingAddress) view public returns (bool) {
        return listings[_listingAddress].applicationExpiry > 0;
    }

    /**
    @dev                Returns true if the application/listing has an unresolved challenge
    @param _listingAddress The listingAddress whose status is to be examined
    */
    function challengeExists(address _listingAddress) view public returns (bool) {
        uint challengeID = listings[_listingAddress].challengeID;

        return (listings[_listingAddress].challengeID > NO_CHALLENGE && !challenges[challengeID].resolved);
    }

    /**
    @dev                Determines whether voting has concluded in a challenge for a given
                        listingAddress. Throws if no challenge exists.
    @param _listingAddress A listingAddress with an unresolved challenge
    */
    function challengeCanBeResolved(address _listingAddress) view public returns (bool) {
        uint challengeID = listings[_listingAddress].challengeID;

        require(challengeExists(_listingAddress));

        return voting.pollEnded(challengeID);
    }

    /**
    @dev                Determines the number of tokens awarded to the winning party in a challenge.
    @param _challengeID The challengeID to determine a reward for
    */
    function determineReward(uint _challengeID) public view returns (uint) {
        require(!challenges[_challengeID].resolved && voting.pollEnded(_challengeID));

        // Edge case, nobody voted, give all tokens to the challenger.
        if (voting.getTotalNumberOfTokensForWinningOption(_challengeID) == 0) {
            return 2 * challenges[_challengeID].stake;
        }

        return (2 * challenges[_challengeID].stake) - challenges[_challengeID].rewardPool;
    }

    /**
    @dev                Getter for Challenge tokenClaims mappings
    @param _challengeID The challengeID to query
    @param _voter       The voter whose claim status to query for the provided challengeID
    */
    function tokenClaims(uint _challengeID, address _voter) public view returns (bool) {
      return challenges[_challengeID].tokenClaims[_voter];
    }

    // ----------------
    // PRIVATE FUNCTIONS:
    // ----------------

    /**
    @dev                Determines the winner in a challenge. Rewards the winner tokens and
                        either whitelists or de-whitelists the listingAddress.
    @param _listingAddress A listingAddress with a challenge that is to be resolved
    */
    function resolveChallenge(address _listingAddress) private {
        uint challengeID = listings[_listingAddress].challengeID;

        // Calculates the winner's reward,
        // which is: (winner's full stake) + (dispensationPct * loser's stake)
        uint reward = determineReward(challengeID);

        // Records whether the listingAddress is a listing or an application
        bool wasWhitelisted = isWhitelisted(_listingAddress);

        
        if (voting.isPassed(challengeID)) { // Case: challenge failed
            whitelistApplication(_listingAddress);
            // Unlock stake so that it can be retrieved by the applicant
            listings[_listingAddress].unstakedDeposit += reward;

            ChallengeFailed(challengeID);
            if (!wasWhitelisted) { 
                NewListingWhitelisted(_listingAddress); 
            }
        } else { // Case: challenge succeeded
            resetListing(_listingAddress);
            // Transfer the reward to the challenger
            require(token.transfer(challenges[challengeID].challenger, reward));

            ChallengeSucceeded(challengeID);
            if (wasWhitelisted) { 
                ListingRemoved(_listingAddress); 
            } else { 
                ApplicationRemoved(_listingAddress); 
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
    @param _listingAddress The listingAddress of an application/listing to be whitelisted
    */
    function whitelistApplication(address _listingAddress) private {
        listings[_listingAddress].whitelisted = true;
    }

    /**
    @dev                Deletes a listingAddress from the whitelist and transfers tokens back to owner
    @param _listingAddress The listing to delete
    */
    function resetListing(address _listingAddress) private {
        Listing storage listing = listings[_listingAddress];

        // Transfers any remaining balance back to the owner
        if (listing.unstakedDeposit > 0)
            require(token.transfer(listing.owner, listing.unstakedDeposit));

        delete listings[_listingAddress];
    }
}
