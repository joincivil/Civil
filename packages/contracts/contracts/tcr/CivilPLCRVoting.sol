pragma solidity ^0.4.19;

import "../installed_contracts/PLCRVoting.sol";
import "../proof-of-use/telemetry/TokenTelemetryI.sol";

/**
@title Partial-Lock-Commit-Reveal Voting scheme with ERC20 tokens
@author Team: Aspyn Palatnick, Cem Ozer, Yorke Rhodes
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
  @notice Reveals vote with choice and secret salt used in generating commitHash to attribute committed tokens
  @param _pollID Integer identifier associated with target poll
  @param _voteOption Vote choice used to generate commitHash for associated poll
  @param _salt Secret number used to generate commitHash for associated poll
  @dev Differs from base implementation in that it records use of token in mapping for "proof of use"
  */
  function revealVote(uint _pollID, uint _voteOption, uint _salt) public {
    super.revealVote(_pollID, _voteOption, _salt);
    uint numTokens = getNumTokens(msg.sender, _pollID);
    telemetry.onTokensUsed(msg.sender, numTokens);
  }

  /**
  @param _pollID Integer identifier associated with target poll
  @return correctVotes Number of tokens voted for losing option
  */
  function getNumLosingTokens(address _voter, uint _pollID) public view returns (uint correctVotes) {
    require(pollEnded(_pollID));
    require(pollMap[_pollID].didReveal[_voter]);

    uint losingChoice = isPassed(_pollID) ? 0 : 1;
    uint voterVoteOption = pollMap[_pollID].voteOptions[_voter];

    if (voterVoteOption == losingChoice) {
      return getNumTokens(_voter, _pollID);
    } else {
      revert("Msg sender not part of minority 888");
    }
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

