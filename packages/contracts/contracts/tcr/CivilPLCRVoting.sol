pragma solidity ^0.4.23;

import "../installed_contracts/PLCRVoting.sol";
import "../proof-of-use/telemetry/TokenTelemetryI.sol";

/**
@title Partial-Lock-Commit-Reveal Voting scheme with ERC20 tokens
*/
contract CivilPLCRVoting is PLCRVoting {

  TokenTelemetryI public telemetry;

  /**
  @dev Initializer. Can only be called once.
  @param tokenAddr The address where the ERC20 token contract is deployed
  @param telemetryAddr The address where the TokenTelemetry contract is deployed
  */
  constructor(address tokenAddr, address telemetryAddr) public PLCRVoting(tokenAddr) {
    require(telemetryAddr != 0);
    telemetry = TokenTelemetryI(telemetryAddr);
  }

  /**
    @notice Loads _numTokens ERC20 tokens into the voting contract for one-to-one voting rights
    @dev Assumes that msg.sender has approved voting contract to spend on their behalf
    @param _numTokens The number of votingTokens desired in exchange for ERC20 tokens
    @dev Differs from base implementation in that it records use of token in mapping for "proof of use"
  */
  function requestVotingRights(uint _numTokens) public {
    super.requestVotingRights(_numTokens);
    telemetry.onRequestVotingRights(msg.sender, voteTokenBalance[msg.sender]);
  }

  /**
  @param _pollID Integer identifier associated with target poll
  @param _salt Arbitrarily chosen integer used to generate secretHash
  @return correctVotes Number of tokens voted for losing option
  */
  function getNumLosingTokens(address _voter, uint _pollID, uint _salt) public view returns (uint correctVotes) {
    require(pollEnded(_pollID));
    require(pollMap[_pollID].didReveal[_voter]);

    uint losingChoice = isPassed(_pollID) ? 0 : 1;
    bytes32 loserHash = keccak256(losingChoice, _salt);
    bytes32 commitHash = getCommitHash(_voter, _pollID);

    require(loserHash == commitHash);

    return getNumTokens(_voter, _pollID);
  }

  /**
  @dev Gets the total losing votes for reward distribution purposes
  @param _pollID Integer identifier associated with target poll
  @return Total number of votes committed to the losing option for specified poll
  */
  function getTotalNumberOfTokensForLosingOption(uint _pollID) public view returns (uint numTokens) {
    require(pollEnded(_pollID));

    if (isPassed(_pollID))
      return pollMap[_pollID].votesAgainst;
    else
      return pollMap[_pollID].votesFor;
  }

}

