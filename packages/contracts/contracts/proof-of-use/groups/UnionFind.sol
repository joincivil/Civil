pragma solidity ^0.4.23;

import "../telemetry/TokenSaleI.sol";
import "./GroupsI.sol";

contract UnionFind is GroupsI {
  event GroupsMerged(address indexed rootA, address indexed rootB);

  struct Group {
    address parent;
    uint totalTokens;
    uint usedTokens;
    uint size;
  }

  mapping(address => Group) internal groups;
  TokenSaleI internal tokenSale;

  constructor(TokenSaleI _tokenSale) public {
    tokenSale = _tokenSale;
  }

  function find(address element) public view returns (address root, uint size) {
    Group storage currentGroup = groups[element];
    if (currentGroup.size == 0) {
      return (element, 1);
    }

    address currentKey = element;
    while (currentGroup.parent != currentKey) {
      currentKey = currentGroup.parent;
      currentGroup = groups[currentKey];
    }
    return (currentKey, currentGroup.size);
  }

  /**
  @dev This function assumes that a and b are roots of groups, this can't be verified without adding key member to group struct,
       so trying to union without roots is undefined behavior
  */
  function unionStruct(Group storage a, Group storage b) internal returns (Group storage newGroup) {
    // Already in the same group
    if (a.parent == b.parent) {
      return a;
    }

    emit GroupsMerged(a.parent, b.parent);

    if (a.size >= b.size) { // A is bigger, and so is new root
      b.parent = a.parent;
      a.totalTokens += b.totalTokens;
      a.usedTokens += b.usedTokens;
      a.size += b.size;
      return a;
    } else { // B is bigger, and so is new root
      a.parent = b.parent;
      b.usedTokens += a.usedTokens;
      b.totalTokens += a.usedTokens;
      b.size += a.size;
      return b;
    }
  }

  function findStruct(address element) internal returns (Group storage group) {
    address currentKey = element;
    Group storage currentGroup = getOrMakeGroup(currentKey);

    while (currentGroup.parent != currentKey) {
      currentGroup.parent = groups[currentGroup.parent].parent;
      currentKey = currentGroup.parent;
      currentGroup = groups[currentKey];
    }
    return currentGroup;
  }

  function getOrMakeGroup(address element) private returns (Group storage group) {
    require(element != 0x0);

    group = groups[element];

    // No group exists
    if (group.parent == 0x0) {
      group.parent = element;
      group.size = 1;
      // TODO(ritave): Get the token count from Token Sale contract
      group.totalTokens = tokenSale.saleTokensPerUnit() * tokenSale.unitContributions(element);
    }
    return group;
  }
}
