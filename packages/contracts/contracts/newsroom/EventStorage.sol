pragma solidity ^0.4.19;

contract EventStorage {
  event StringStored(bytes32 indexed dataHash, string data);

  function store(string data) public {
    emit StringStored(keccak256((data)), data);
  }
}
