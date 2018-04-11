pragma solidity ^0.4.19;
// TODO(ritave): Think of a way to not require contracts out of package
import "../multisig/Factory.sol";

import "../interfaces/IMultiSigWalletFactory.sol";
import "./Newsroom.sol";

contract NewsroomFactory is Factory {
  IMultiSigWalletFactory public multisigFactory;

  function NewsroomFactory(address multisigFactoryAddr) public {
    multisigFactory = IMultiSigWalletFactory(multisigFactoryAddr);
  }

  function create(string name, address[] initialOwners, uint initialRequired)
    public
    returns (Newsroom newsroom)
  {
    address wallet = multisigFactory.create(initialOwners, initialRequired);
    newsroom = new Newsroom(name);
    newsroom.transferOwnership(wallet);
    register(newsroom);
  }
}
