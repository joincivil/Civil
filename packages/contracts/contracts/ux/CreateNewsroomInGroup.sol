pragma solidity ^0.4.23;

import "../newsroom/NewsroomFactory.sol";
import "../token/CivilTokenController.sol";

contract CreateNewsroomInGroup {
  NewsroomFactory factory;
  CivilTokenController controller;

  constructor(NewsroomFactory _factory, CivilTokenController _controller) public {
    factory = _factory;
    controller = _controller;
  }

  function create(string name, string charterUri, bytes32 charterHash, address[] initialOwners, uint initialRequired)
    public
    returns (Newsroom newsroom)
  {
    require(initialOwners.length > 0, "initialOwners must have at least one member");

    newsroom = factory.create(name, charterUri, charterHash, initialOwners, initialRequired);

    // Multisig
    controller.addToNewsroomMultisigs(newsroom.owner());
  }
}
