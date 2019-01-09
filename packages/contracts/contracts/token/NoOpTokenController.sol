pragma solidity ^0.4.24;
import "./ManagedWhitelist.sol";
import "./ERC1404/ERC1404.sol";

contract NoOpTokenController is ERC1404 {
  uint8 public constant SUCCESS_CODE = 0;
  string public constant SUCCESS_MESSAGE = "SUCCESS";
  
  function detectTransferRestriction (address from, address to, uint value)
      public
      view
      returns (uint8)
  {
    return SUCCESS_CODE; 
  }

  function messageForTransferRestriction (uint8 restrictionCode)
      public
      view
      returns (string)
  {
    return SUCCESS_MESSAGE;
  }
}
