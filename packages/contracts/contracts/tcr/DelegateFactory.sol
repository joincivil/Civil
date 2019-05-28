pragma solidity ^0.4.24;

import "./Delegate.sol";
import "../installed_contracts/PLCRVoting.sol";
import "../zeppelin-solidity/token/ERC20/IERC20.sol";

contract NewsroomFactory {

  IERC20 public tokenAddr;
  PLCRVoting public votingAddr;

  event _DelegateCreated(string charterUri, address delegateAddress);

  constructor(IERC20 _token, PLCRVoting _voting) public {
    tokenAddr = _token;
    votingAddr = _voting;
  }
  
  function createDelegate(string charterUri)
    public
    returns (Delegate delegate)
  {
    delegate = new Delegate(tokenAddr, votingAddr, charterUri);
    emit _DelegateCreated(charterUri, address(delegate));
  }
}
