pragma solidity 0.4.19;

import "../interfaces/IMultiSigWalletFactory.sol";

contract DummyMultiSigWalletFactory is IMultiSigWalletFactory {
  address private data;

  function DummyMultiSigWalletFactory(address wallet) public {
    data = wallet;
  }

  function create(address[] _owners, uint _required) public returns (address wallet) {
    wallet = data;
  }
}
