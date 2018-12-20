// solium-disable
pragma solidity ^0.4.24;

import "../installed_contracts/EIP20Interface.sol";
import "../installed_contracts/Parameterizer.sol";
import "../installed_contracts/PLCRVoting.sol";
import "../zeppelin-solidity/math/SafeMath.sol";

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
        bool whitelisted;       // Indicates registry status
        address owner;          // Owner of Listing
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

    // Maps listingHashes to associated listingHash data
    mapping(address => Listing) public listings;

    // Global Variables
    EIP20Interface public token;
    PLCRVoting public voting;
    Parameterizer public parameterizer;
    string public name;

    /**
    @dev Initializer. Can only be called once.
    @param _token The address where the ERC20 token contract is deployed
    */
    constructor(address _token, address _voting, address _parameterizer, string _name) public {
        require(_token != 0, "_token address is 0");
        require(_voting != 0, "_voting address is 0");
        require(_parameterizer != 0, "_parameterizer address is 0");

        token = EIP20Interface(_token);
        voting = PLCRVoting(_voting);
        parameterizer = Parameterizer(_parameterizer);
        name = _name;
    }

    // --------------------
    // PUBLISHER INTERFACE:
    // --------------------

    /**
    @dev                Allows a user to start an application. Takes tokens from user and sets
                        apply stage end time.
    @param listingAddress The hash of a potential listing a user is applying to add to the registry
    @param _amount      The number of ERC20 tokens a user is willing to potentially stake
    @param _data        Extra data relevant to the application. Think IPFS hashes.
    */
    function apply(address listingAddress, uint _amount, string _data) public {
        require(!isWhitelisted(listingAddress), "Listing already whitelisted");
        require(!appWasMade(listingAddress), "Application already made for this address");
        require(_amount >= parameterizer.get("minDeposit"), "Deposit amount not above minDeposit");

        // Sets owner
        Listing storage listing = listings[listingAddress];
        listing.owner = msg.sender;

        // Sets apply stage end time
        listing.applicationExpiry = block.timestamp.add(parameterizer.get("applyStageLen"));
        listing.unstakedDeposit = _amount;

        // Transfers tokens from user to Registry contract
        require(token.transferFrom(listing.owner, this, _amount), "Token transfer failed");

        emit _Application(listingAddress, _amount, listing.applicationExpiry, _data, msg.sender);
    }

    /**
    @dev                Allows the owner of a listingHash to increase their unstaked deposit.
    @param listingAddress A listingHash msg.sender is the owner of
    @param _amount      The number of ERC20 tokens to increase a user's unstaked deposit
    */
    function deposit(address listingAddress, uint _amount) external {
        Listing storage listing = listings[listingAddress];

        require(listing.owner == msg.sender, "Sender is not owner of Listing");

        listing.unstakedDeposit += _amount;
        require(token.transferFrom(msg.sender, this, _amount), "Token transfer failed");

        emit _Deposit(listingAddress, _amount, listing.unstakedDeposit, msg.sender);
    }

    /**
    @dev                Allows the owner of a listingHash to decrease their unstaked deposit.
    @param listingAddress A listingHash msg.sender is the owner of.
    @param _amount      The number of ERC20 tokens to withdraw from the unstaked deposit.
    */
    function withdraw(address listingAddress, uint _amount) external {
        Listing storage listing = listings[listingAddress];

        require(listing.owner == msg.sender, "Sender is not owner of listing");
        require(_amount <= listing.unstakedDeposit, "Cannot withdraw more than current unstaked deposit");
        if (listing.challengeID == 0 || challenges[listing.challengeID].resolved) { // ok to withdraw entire unstakedDeposit when challenge active as described here: https://github.com/skmgoldin/tcr/issues/55
          require(listing.unstakedDeposit - _amount >= parameterizer.get("minDeposit"), "Withdrawal prohibitied as it would put Listing unstaked deposit below minDeposit");
        }

        listing.unstakedDeposit -= _amount;
        require(token.transfer(msg.sender, _amount), "Token transfer failed");

        emit _Withdrawal(listingAddress, _amount, listing.unstakedDeposit, msg.sender);
    }

    /**
    @dev                Allows the owner of a listingHash to remove the listingHash from the whitelist
                        Returns all tokens to the owner of the listingHash
    @param listingAddress A listingHash msg.sender is the owner of.
    */
    function exit(address listingAddress) external {
        Listing storage listing = listings[listingAddress];

        require(msg.sender == listing.owner, "Sender is not owner of listing");
        require(isWhitelisted(listingAddress), "Listing must be whitelisted to be exited");

        // Cannot exit during ongoing challenge
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved, "Listing must not have an active challenge to be exited");

        // Remove listingHash & return tokens
        resetListing(listingAddress);
        emit _ListingWithdrawn(listingAddress);
    }

    // -----------------------
    // TOKEN HOLDER INTERFACE:
    // -----------------------

    /**
    @dev                Starts a poll for a listingHash which is either in the apply stage or
                        already in the whitelist. Tokens are taken from the challenger and the
                        applicant's deposits are locked.
    @param listingAddress The listingHash being challenged, whether listed or in application
    @param _data        Extra data relevant to the challenge. Think IPFS hashes.
    */
    function challenge(address listingAddress, string _data) public returns (uint challengeID) {
        Listing storage listing = listings[listingAddress];
        uint minDeposit = parameterizer.get("minDeposit");

        // Listing must be in apply stage or already on the whitelist
        require(appWasMade(listingAddress) || listing.whitelisted, "Listing must be in application phase or already whitelisted to be challenged");
        // Prevent multiple challenges
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved, "Listing must not have active challenge to be challenged");

        if (listing.unstakedDeposit < minDeposit) {
            // Not enough tokens, listingHash auto-delisted
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

        uint oneHundred = 100; // Kludge that we need to use SafeMath
        challenges[pollID] = Challenge({
            challenger: msg.sender,
            rewardPool: ((oneHundred.sub(parameterizer.get("dispensationPct"))).mul(minDeposit)).div(100),
            stake: minDeposit,
            resolved: false,
            totalTokens: 0
        });

        // Updates listingHash to store most recent challenge
        listing.challengeID = pollID;

        // Locks tokens for listingHash during challenge
        listing.unstakedDeposit -= minDeposit;

        // Takes tokens from challenger
        require(token.transferFrom(msg.sender, this, minDeposit), "Token transfer failed");

        var (commitEndDate, revealEndDate,) = voting.pollMap(pollID);

        emit _Challenge(listingAddress, pollID, _data, commitEndDate, revealEndDate, msg.sender);
        return pollID;
    }

    /**
    @dev                Updates a listingHash's status from 'application' to 'listing' or resolves
                        a challenge if one exists.
    @param listingAddress The listingHash whose status is being updated
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

    /**
    @dev                  Updates an array of listingHashes' status from 'application' to 'listing' or resolves
                          a challenge if one exists.
    @param listingAddresses The listingHashes whose status are being updated
    */
    function updateStatuses(address[] listingAddresses) public {
        // loop through arrays, revealing each individual vote values
        for (uint i = 0; i < listingAddresses.length; i++) {
            updateStatus(listingAddresses[i]);
        }
    }

    // ----------------
    // TOKEN FUNCTIONS:
    // ----------------

    /**
    @dev                Called by a voter to claim their reward for each completed vote. Someone
                        must call updateStatus() before this can be called.
    @param _challengeID The PLCR pollID of the challenge a reward is being claimed for
    */
    function claimReward(uint _challengeID) public {
        // Ensures the voter has not already claimed tokens and challenge results have been processed
        require(challenges[_challengeID].tokenClaims[msg.sender] == false, "Reward already claimed");
        require(challenges[_challengeID].resolved == true, "Challenge not yet resolved");

        uint voterTokens = voting.getNumPassingTokens(msg.sender, _challengeID);
        uint reward = voterReward(msg.sender, _challengeID);

        // Subtracts the voter's information to preserve the participation ratios
        // of other voters compared to the remaining pool of rewards
        challenges[_challengeID].totalTokens -= voterTokens;
        challenges[_challengeID].rewardPool -= reward;

        // Ensures a voter cannot claim tokens again
        challenges[_challengeID].tokenClaims[msg.sender] = true;

        require(token.transfer(msg.sender, reward), "Token transfer failed");

        emit _RewardClaimed(_challengeID, reward, msg.sender);
    }

    /**
    @dev                 Called by a voter to claim their rewards for each completed vote. Someone
                         must call updateStatus() before this can be called.
    @param _challengeIDs The PLCR pollIDs of the challenges rewards are being claimed for
    */
    function claimRewards(uint[] _challengeIDs) public {
        // loop through arrays, claiming each individual vote reward
        for (uint i = 0; i < _challengeIDs.length; i++) {
            claimReward(_challengeIDs[i]);
        }
    }

    // --------
    // GETTERS:
    // --------

    /**
    @dev                Calculates the provided voter's token reward for the given poll.
    @param _voter       The address of the voter whose reward balance is to be returned
    @param _challengeID The pollID of the challenge a reward balance is being queried for
    @return             The uint indicating the voter's reward
    */
    function voterReward(address _voter, uint _challengeID)
    public view returns (uint) {
        uint totalTokens = challenges[_challengeID].totalTokens;
        uint rewardPool = challenges[_challengeID].rewardPool;
        uint voterTokens = voting.getNumPassingTokens(_voter, _challengeID);
        return (voterTokens * rewardPool) / totalTokens;
    }

    /**
    @dev                Determines whether the given listingHash be whitelisted.
    @param listingAddress The listingHash whose status is to be examined
    */
    function canBeWhitelisted(address listingAddress) view public returns (bool) {
        uint challengeID = listings[listingAddress].challengeID;

        // Ensures that the application was made,
        // the application period has ended,
        // the listingHash can be whitelisted,
        // and either: the challengeID == 0, or the challenge has been resolved.
        if (
            appWasMade(listingAddress) &&
            listings[listingAddress].applicationExpiry < now &&
            !isWhitelisted(listingAddress) &&
            (challengeID == 0 || challenges[challengeID].resolved == true)
        ) { return true; }

        return false;
    }

    /**
    @dev                Returns true if the provided listingHash is whitelisted
    @param listingAddress The listingHash whose status is to be examined
    */
    function isWhitelisted(address listingAddress) view public returns (bool whitelisted) {
        return listings[listingAddress].whitelisted;
    }

    /**
    @dev                Returns true if apply was called for this listingHash
    @param listingAddress The listingHash whose status is to be examined
    */
    function appWasMade(address listingAddress) view public returns (bool exists) {
        return listings[listingAddress].applicationExpiry > 0;
    }

    /**
    @dev                Returns true if the application/listingHash has an unresolved challenge
    @param listingAddress The listingHash whose status is to be examined
    */
    function challengeExists(address listingAddress) view public returns (bool) {
        uint challengeID = listings[listingAddress].challengeID;

        return (listings[listingAddress].challengeID > 0 && !challenges[challengeID].resolved);
    }

    /**
    @dev                Determines whether voting has concluded in a challenge for a given
                        listingHash. Throws if no challenge exists.
    @param listingAddress A listingHash with an unresolved challenge
    */
    function challengeCanBeResolved(address listingAddress) view public returns (bool) {
        uint challengeID = listings[listingAddress].challengeID;

        require(challengeExists(listingAddress), "Challenge does not exist for Listing");

        return voting.pollEnded(challengeID);
    }

    /**
    @dev                Determines the number of tokens awarded to the winning party in a challenge.
    @param _challengeID The challengeID to determine a reward for
    */
    function determineReward(uint _challengeID) public view returns (uint) {
        require(!challenges[_challengeID].resolved, "Challenge already resolved");
        require(voting.pollEnded(_challengeID), "Poll for challenge has not ended");

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
                        either whitelists or de-whitelists the listingHash.
    @param listingAddress A listingHash with a challenge that is to be resolved
    */
    function resolveChallenge(address listingAddress) internal {
        uint challengeID = listings[listingAddress].challengeID;

        // Calculates the winner's reward,
        // which is: (winner's full stake) + (dispensationPct * loser's stake)
        uint reward = determineReward(challengeID);

        // Sets flag on challenge being processed
        challenges[challengeID].resolved = true;

        // Stores the total tokens used for voting by the winning side for reward purposes
        challenges[challengeID].totalTokens =
            voting.getTotalNumberOfTokensForWinningOption(challengeID);

        // Case: challenge failed
        if (voting.isPassed(challengeID)) {
            whitelistApplication(listingAddress);
            // Unlock stake so that it can be retrieved by the applicant
            listings[listingAddress].unstakedDeposit += reward;

            emit _ChallengeFailed(listingAddress, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
        // Case: challenge succeeded or nobody voted
        else {
            resetListing(listingAddress);
            // Transfer the reward to the challenger
            require(token.transfer(challenges[challengeID].challenger, reward), "Token transfer failure");

            emit _ChallengeSucceeded(listingAddress, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
    }

    /**
    @dev                Called by updateStatus() if the applicationExpiry date passed without a
                        challenge being made. Called by resolveChallenge() if an
                        application/listing beat a challenge.
    @param listingAddress The listingHash of an application/listingHash to be whitelisted
    */
    function whitelistApplication(address listingAddress) internal {
        if (!listings[listingAddress].whitelisted) { emit _ApplicationWhitelisted(listingAddress); }
        listings[listingAddress].whitelisted = true;
    }

    /**
    @dev                Deletes a listingHash from the whitelist and transfers tokens back to owner
    @param listingAddress The listing hash to delete
    */
    function resetListing(address listingAddress) internal {
        Listing storage listing = listings[listingAddress];

        // Emit events before deleting listing to check whether is whitelisted
        if (listing.whitelisted) {
            emit _ListingRemoved(listingAddress);
        } else {
            emit _ApplicationRemoved(listingAddress);
        }

        // Deleting listing to prevent reentry
        address owner = listing.owner;
        uint unstakedDeposit = listing.unstakedDeposit;
        delete listings[listingAddress];

        // Transfers any remaining balance back to the owner
        if (unstakedDeposit > 0){
            require(token.transfer(owner, unstakedDeposit), "Token transfer failure");
        }
    }
}
