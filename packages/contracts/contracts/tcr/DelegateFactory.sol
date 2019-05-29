pragma solidity ^0.4.24;

import "./Delegate.sol";
import "./CivilTCR.sol";
import "../installed_contracts/PLCRVoting.sol";
import "../zeppelin-solidity/token/ERC20/IERC20.sol";

contract DelegateFactory {

  IERC20 public token;
  PLCRVoting public voting;
  CivilTCR public tcr;

  event _DelegateCreated(string charterUri, address delegateAddress);

  constructor(address _tokenAddr, address _votingAddr, address _TCRAddr) public {
    token = IERC20(_tokenAddr);
    voting = PLCRVoting(_votingAddr);
    tcr = CivilTCR(_TCRAddr);
  }
  
  function createDelegate(string charterUri)
    public
    returns (Delegate delegate)
  {
    delegate = new Delegate(token, voting, tcr, charterUri, msg.sender);
    emit _DelegateCreated(charterUri, address(delegate));
  }
}
