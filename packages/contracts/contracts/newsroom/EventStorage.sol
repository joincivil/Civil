pragma solidity ^0.4.19;

/**
@title Event Storage Archive
@notice This smart-contract uses events to cheaply store content on the blockchain.
@dev For most use-cases, using events to store strings than using the "Storage" memory model is cheaper
Additionally the keccak256 is also calculated for easier filtering of events for which we're looking for
*/
contract EventStorage {
  event StringStored(bytes32 indexed dataHash, string data);

  function store(string data) public {
    emit StringStored(keccak256((data)), data);
  }
}
