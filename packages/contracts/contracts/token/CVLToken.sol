pragma solidity ^0.4.24;
import "./CivilTokenController.sol";
import "./ERC1404/ERC1404.sol";
import "../zeppelin-solidity/ownership/Ownable.sol";
import "../zeppelin-solidity/token/ERC20/ERC20.sol";
import "../zeppelin-solidity/token/ERC20/ERC20Detailed.sol";

/// @title Extendable reference implementation for the ERC-1404 token
/// @dev Inherit from this contract to implement your own ERC-1404 token
contract CVLToken is ERC20, ERC20Detailed, Ownable, ERC1404 {

  ERC1404 public controller;

  constructor (uint256 _initialAmount,
    string _tokenName,
    uint8 _decimalUnits,
    string _tokenSymbol,
    ERC1404 _controller 
    ) public ERC20Detailed(_tokenName, _tokenSymbol, _decimalUnits) {
    require(address(_controller) != address(0), "controller not provided");
    controller = _controller;
    _mint(msg.sender, _initialAmount);              // Give the creator all initial tokens
  }

  modifier onlyOwner () {
    require(msg.sender == owner, "not owner");
    _;
  }

  function changeController(ERC1404 _controller) public onlyOwner {
    require(address(_controller) != address(0), "controller not provided");
    controller = _controller;
  }

  modifier notRestricted (address from, address to, uint256 value) {
    require(controller.detectTransferRestriction(from, to, value) == 0, "token transfer restricted");
    _;
  }

  function transfer (address to, uint256 value)
      public
      notRestricted(msg.sender, to, value)
      returns (bool success)
  {
    success = super.transfer(to, value);
  }

  function transferFrom (address from, address to, uint256 value)
      public
      notRestricted(from, to, value)
      returns (bool success)
  {
    success = super.transferFrom(from, to, value);
  }

  function detectTransferRestriction (address from, address to, uint256 value) public view returns (uint8) {
    return controller.detectTransferRestriction(from, to, value);
  }

  function messageForTransferRestriction (uint8 restrictionCode) public view returns (string) {
    return controller.messageForTransferRestriction(restrictionCode);
  }


}
