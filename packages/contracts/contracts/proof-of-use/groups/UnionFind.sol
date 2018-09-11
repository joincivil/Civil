pragma solidity ^0.4.23;

library UnionFind {
  struct Group {
    bytes32 parent;
    uint totalTokens;
    uint usedTokens;
    uint size;
  }
  struct Data {
    mapping(bytes32 => Group) groups;
  }

  function findView(Data storage self, bytes32 element) external view returns (bytes32 root, uint size) {
    Group storage currentGroup = self.groups[element];
    if (currentGroup.size == 0) {
      return (element, 1);
    }

    bytes32 currentKey = element;
    while (currentGroup.parent != currentKey) {
      currentKey = currentGroup.parent;
      currentGroup = self.groups[currentKey];
    }
    return (currentKey, currentGroup.size);
  }

  function union(Data storage self, bytes32 groupA, bytes32 groupB)
    external
    returns (bytes32 originalAGroup, bytes32 originalBGroup, bytes32 newGroup)
  {
    Group storage a = findStruct(self, groupA);
    Group storage b = findStruct(self, groupB);

    originalAGroup = a.parent;
    originalBGroup = b.parent;
    newGroup = unionStruct(self, a, b).parent;
  }

  /**
  @dev This function assumes that a and b are roots of groups, this can't be verified without adding key member to group struct,
       so trying to union without roots is undefined behavior
  */
  function unionStruct(Data storage self, Group storage a, Group storage b) internal returns (Group storage newGroup) {
    // Already in the same group
    if (a.parent == b.parent) {
      return a;
    }

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

  function findStruct(Data storage self, bytes32 element) internal returns (Group storage group) {
    bytes32 currentKey = element;
    Group storage currentGroup = getOrMakeGroup(self, currentKey);

    while (currentGroup.parent != currentKey) {
      currentGroup.parent = self.groups[currentGroup.parent].parent;
      currentKey = currentGroup.parent;
      currentGroup = self.groups[currentKey];
    }
    return currentGroup;
  }

  function getOrMakeGroup(Data storage self, bytes32 element) private returns (Group storage group) {
    require(element != 0x0);

    group = self.groups[element];

    // No group exists
    if (group.parent == 0x0) {
      group.parent = element;
      group.size = 1;
      // TODO(ritave): Get the token count from Token Sale contract
      group.totalTokens = 0;
    }
    return group;
  }
}
