pragma solidity ^0.4.23;

import "./GroupsI.sol";
import "./TokenControllerI.sol";

contract GroupTokenController is TokenControllerI {
  // Free to transfer to anyone and accept from anyone
  address constant SUPER_GROUP = 0x1;

  GroupsI public groupManager;

  constructor(GroupsI _groupManager) {
    groupManager = _groupManager;
  }

  function transferAllowed(address from, address to) external view returns (bool) {
    (address superRoot, ) = groupManager.find(SUPER_GROUP);
    (address fromRoot, ) = groupManager.find(from);
    (address toRoot, ) = groupManager.find(to);
    return (fromRoot == superRoot || toRoot == superRoot) || (fromRoot == toRoot);
  }
}
