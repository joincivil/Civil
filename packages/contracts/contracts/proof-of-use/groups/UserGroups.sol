pragma solidity ^0.4.23;

import "./UnionFind.sol";
import "./OffChainOwnable.sol";

contract UserGroups is OffChainOwnable {
  // Free to transfer to anyone and accept from anyone
  address constant SUPER_GROUP = 0x1;
  // After a group proves token use, they can add themselves to GLOBAL_GROUP,
  // allowing to exchange tokens with everyone who already proven too
  address constant GLOBAL_GROUP = 0x2;

  // The maximum amount of addresses inside one group before being added to global
  uint public maxGroupSize = 4;
  // To prevent replay attacks
  uint public changeGroupSizeNonce = 0;

  UnionFind.Data internal groups;

  function find(address a) external view returns (address root, uint size) {
    bytes32 root32;
    (root32, size) = UnionFind.findView(groups, bytes32(a));
    root = address(root32);
  }

  function setMaxGroupSize(uint groupSize, bytes signature) external
    requireSignature(
      signature,
      keccak256(abi.encodePacked(
        changeGroupSizeNonce,
        groupSize
      ))
  ) {
    changeGroupSizeNonce++;
    maxGroupSize = groupSize;
  }

  // The action is idempotent, no need for replay attack security
  function forceUnion(address a, address b, bytes signature) external requireSignature(signature, keccak256(abi.encodePacked(a, b))) {
    UnionFind.union(groups, bytes32(a), bytes32(b));
  }

  function allowInGroupTransfers(address a, address b) external {
    UnionFind.Group storage superGroup = UnionFind.findStruct(groups, bytes32(SUPER_GROUP));
    UnionFind.Group storage globalGroup = UnionFind.findStruct(groups, bytes32(GLOBAL_GROUP));

    UnionFind.Group storage groupA = UnionFind.findStruct(groups, bytes32(a));
    UnionFind.Group storage groupB = UnionFind.findStruct(groups, bytes32(b));

    require(
      groupA.parent != superGroup.parent && groupB.parent != superGroup.parent,
      "Tried to union with super group"
    );
    require(
      groupA.parent != globalGroup.parent && groupB.parent != globalGroup.parent,
      "Tried to union with global group"
    );

    UnionFind.Group storage newGroup = UnionFind.unionStruct(groups, groupA, groupB);

    require(newGroup.size <= maxGroupSize, "Maximum group size exceeded");
  }

  function allowGlobalGroupTransfers(address a) external {
    UnionFind.Group storage globalGroup = UnionFind.findStruct(groups, bytes32(GLOBAL_GROUP));
    UnionFind.Group storage superGroup = UnionFind.findStruct(groups, bytes32(SUPER_GROUP));

    UnionFind.Group storage group = UnionFind.findStruct(groups, bytes32(a));

    require(group.parent != globalGroup.parent && group.parent != superGroup.parent, "Address a is reserved");
    require(
      isUseProven(address(group.parent)),
      "The use hasn't been proven yet"
    );

    UnionFind.union(groups, globalGroup.parent, group.parent);
  }

  function isUseProven(address root) internal view returns (bool) {
    // TODO(ritave): Connect with TCR
    return true;
  }
}
