pragma solidity ^0.4.19;

interface IMultiSigWalletFactory {
  function create(address[] _owners, uint _required) public returns (address wallet);
}
