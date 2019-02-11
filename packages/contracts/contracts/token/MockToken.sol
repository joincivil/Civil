pragma solidity ^0.4.24;
import "../zeppelin-solidity/token/ERC20/ERC20.sol";
import "../zeppelin-solidity/token/ERC20/ERC20Detailed.sol";

/// @title Extendable reference implementation for the ERC-1404 token
/// @dev Inherit from this contract to implement your own ERC-1404 token
contract MockToken is ERC20, ERC20Detailed {

  constructor (uint256 _initialAmount,
    string _tokenName,
    uint8 _decimalUnits,
    string _tokenSymbol
    ) public ERC20Detailed(_tokenName, _tokenSymbol, _decimalUnits) {
    _mint(msg.sender, _initialAmount);              // Give the creator all initial tokens
  }
}
