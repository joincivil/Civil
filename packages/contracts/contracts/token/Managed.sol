pragma solidity ^0.4.24;
import "../zeppelin-solidity/ownership/Ownable.sol";

contract Managed is Ownable {
  mapping (address => bool) public managers;
  
  modifier onlyManager () {
    require(isManager(), "Only managers may perform this action");
    _;
  }

  modifier onlyManagerOrOwner () {
    require(
      checkManagerStatus(msg.sender) || msg.sender == owner,
      "Only managers or owners may perform this action"
    );
    _;
  }

  function checkManagerStatus (address managerAddress) public view returns (bool) {
    return managers[managerAddress];
  }

  function isManager () public view returns (bool) {
    return checkManagerStatus(msg.sender);
  }

  function addManager (address managerAddress) public onlyOwner {
    managers[managerAddress] = true;
  }

  function removeManager (address managerAddress) public onlyOwner {
    managers[managerAddress] = false;
  }
}
