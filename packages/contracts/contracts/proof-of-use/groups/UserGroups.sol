pragma solidity ^0.4.23;

import "./UnionFind.sol";
import "./OffChainOwnable.sol";
import "../telemetry/TokenTelemetryI.sol";
import "../telemetry/ContributionProxyI.sol";
import "../../zeppelin-solidity/access/Whitelist.sol";
import "../../zeppelin-solidity/math/SafeMath.sol";

contract UserGroups is OffChainOwnable, TokenTelemetryI, UnionFind {
  // TODO(ritave): Cache super and global groups root
  using SafeMath for uint;

  // Free to transfer to anyone and accept from anyone
  address constant SUPER_GROUP = 0x1;
  // After a group proves token use, they can add themselves to GLOBAL_GROUP,
  // allowing to exchange tokens with everyone who already proven too
  address constant GLOBAL_GROUP = 0x2;

  uint constant USD_10K = 10000;
  uint constant PERCENT_PROOF_OF_USE_ABOVE_10K = 25;
  uint constant PERCENT_PROOF_OF_USE_BELOW_10K = 50;

  // The maximum amount of addresses inside one group before being added to global
  uint public maxGroupSize = 4;
  // To prevent replay attacks
  uint public changeGroupSizeNonce = 0;

  constructor(Whitelist whitelist, ContributionProxyI contributions) OffChainOwnable(whitelist) UnionFind(contributions) public
  {
  }

  function usedAndTotalTokensForGroup(address member) external view returns (uint usedTokens, uint totalTokens) {
    (address root, ) = UnionFind.find(member);
    Group storage group = groups[root];
    usedTokens = group.usedTokens;
    totalTokens = group.totalTokens;
  }

  function setMaxGroupSize(uint groupSize, bytes signature) external
    requireSignature(
      signature,
      keccak256(abi.encodePacked(changeGroupSizeNonce, groupSize)))
  {
    changeGroupSizeNonce++;
    maxGroupSize = groupSize;
  }

  function onTokensUsed(address user, uint tokenAmount) external {
    UnionFind.Group storage superGroup = UnionFind.findStruct(SUPER_GROUP);
    UnionFind.Group storage senderGroup = UnionFind.findStruct(msg.sender);

    require(superGroup.parent == senderGroup.parent);

    UnionFind.Group storage userGroup = UnionFind.findStruct(user);
    userGroup.usedTokens += tokenAmount;
  }

  // The action is idempotent, no need for replay attack security
  function forceUnion(address a, address b, bytes signature) external requireSignature(signature, keccak256(abi.encodePacked(a, b))) {
    UnionFind.unionStruct(UnionFind.findStruct(a), UnionFind.findStruct(b));
  }

  function allowInGroupTransfers(address a, address b) external {
    UnionFind.Group storage superGroup = UnionFind.findStruct(SUPER_GROUP);
    UnionFind.Group storage globalGroup = UnionFind.findStruct(GLOBAL_GROUP);

    UnionFind.Group storage groupA = UnionFind.findStruct(a);
    UnionFind.Group storage groupB = UnionFind.findStruct(b);

    require(
      groupA.parent != superGroup.parent && groupB.parent != superGroup.parent,
      "Tried to union with super group"
    );
    require(
      groupA.parent != globalGroup.parent && groupB.parent != globalGroup.parent,
      "Tried to union with global group"
    );

    UnionFind.Group storage newGroup = UnionFind.unionStruct(groupA, groupB);

    require(newGroup.size <= maxGroupSize, "Maximum group size exceeded");
  }

  function allowGlobalGroupTransfers(address a) external {
    UnionFind.Group storage globalGroup = UnionFind.findStruct(GLOBAL_GROUP);
    UnionFind.Group storage superGroup = UnionFind.findStruct(SUPER_GROUP);

    UnionFind.Group storage group = UnionFind.findStruct(a);

    require(group.parent != globalGroup.parent && group.parent != superGroup.parent, "Address a is reserved");
    require(
      isUseProven(group.usedTokens, group.totalTokens),
      "The use hasn't been proven yet"
    );

    UnionFind.unionStruct(globalGroup, group);
  }

  function isUseProven(uint usedTokens, uint totalTokens) internal view returns (bool) {
    bool isAbove10K = (totalTokens / contributions.tokensPerUnit()) > USD_10K;
    uint percentUsed = usedTokens * 10 / totalTokens;
    if (isAbove10K) {
      return percentUsed > PERCENT_PROOF_OF_USE_ABOVE_10K;
    } else {
      return percentUsed > PERCENT_PROOF_OF_USE_BELOW_10K;
    }
  }
}
