pragma solidity ^0.4.24;
import "../installed_contracts/PLCRVoting.sol";
import "../zeppelin-solidity/token/ERC20/IERC20.sol";
import "../zeppelin-solidity/math/SafeMath.sol";
import "../zeppelin-solidity/ownership/Ownable.sol";

contract Delegate is Ownable {
  using SafeMath for uint;
  IERC20 public token;
  PLCRVoting public voting;
  string public charter;

  mapping(address => uint) deposits;
  uint public totalDeposits;

  struct ExitingDeposit {
    uint numTokens;
    uint releaseTime;
  }
  
  mapping(address => ExitingDeposit) exitingDeposits;
  uint public latestWithdrawalExitTime = 0;

  constructor(IERC20 _token, PLCRVoting _voting, string _charter) Ownable() public {
    token = _token;
    voting = _voting;
    charter = _charter;
  }

  function deposit(uint numTokens) public {
    require(token.transferFrom(msg.sender, this, numTokens), "Token Transfer Failed");
    deposits[msg.sender] = deposits[msg.sender].add(numTokens);
    totalDeposits = totalDeposits.add(numTokens);

    token.approve(voting, numTokens);
    voting.requestVotingRights(numTokens);
  }

  function beginWithdrawal(uint numTokens) public {
    require(deposits[msg.sender] >= numTokens);
    deposits[msg.sender] = deposits[msg.sender].sub(numTokens);
    totalDeposits = totalDeposits.sub(numTokens);
    exitingDeposits[msg.sender].numTokens = exitingDeposits[msg.sender].numTokens.add(numTokens);
    exitingDeposits[msg.sender].releaseTime = latestWithdrawalExitTime;
  }

  function finishWithdrawal() public {
    uint numTokens = exitingDeposits[msg.sender].numTokens;
    require(exitingDeposits[msg.sender].releaseTime < now);

    require(token.transferFrom(this, msg.sender, numTokens));
    delete exitingDeposits[msg.sender];
  }

  function commitVote(uint _pollID, bytes32 _secretHash, uint _numTokens, uint _prevPollID) public onlyOwner {
    voting.commitVote(_pollID, _secretHash, _numTokens, _prevPollID);
    (, uint revealEndDate) = voting.pollMap(_pollID);
    if (revealEndDate > latestWithdrawalExitTime) {
      latestWithdrawalExitTime = revealEndDate;
    }
  }

  function revealVote(uint _pollID, uint _voteOption, uint _salt) public onlyOwner {
    voting.revealVote(_pollID, _voteOption, _salt);
  }

  function rescueTokens(uint _pollID) public {
    voting.rescueTokens(_pollID);
  }
}
