pragma solidity ^0.4.23;

import "../newsroom/NewsroomFactory.sol";
import "../proof-of-use/groups/UserGroups.sol";

contract CreateNewsroomInGroup {
  NewsroomFactory factory;
  UserGroups groups;

  constructor(NewsroomFactory _factory, UserGroups _groups) {
    factory = _factory;
    groups = _groups;
  }

  function create(string name, string charterUri, bytes32 charterHash, address[] initialOwners, uint initialRequired)
    public
    returns (Newsroom newsroom)
  {
    require(initialOwners.length > 0);

    newsroom = factory.create(name, charterUri, charterHash, initialOwners, initialRequired);

    groups.allowInGroupTransfersAll(initialOwners);
    // Multisig
    groups.allowInGroupTransfers(initialOwners[0], newsroom.owner());
  }
}
