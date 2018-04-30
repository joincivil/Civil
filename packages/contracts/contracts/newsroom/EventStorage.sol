pragma solidity ^0.4.19;

contract EventStorage {
  event StringStored(uint indexed id, string data);

  uint private latestId;

  function store(string data) public {
    emit StringStored(latestId, data);
    latestId++;
  }
}
