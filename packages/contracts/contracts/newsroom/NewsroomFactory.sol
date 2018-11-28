pragma solidity ^0.4.19;
// TODO(ritave): Think of a way to not require contracts out of package
import "../multisig/Factory.sol";

import "../interfaces/IMultiSigWalletFactory.sol";
import "./Newsroom.sol";

/**
@title Newsroom with Board of Directors factory
@notice This smart-contract creates the full multi-smart-contract structure of a Newsroom in a single transaction
After creation the Newsroom is owned by the Board of Directors which is represented by a multisig-gnosis-based wallet
*/
contract NewsroomFactory is Factory {
  IMultiSigWalletFactory public multisigFactory;

  function NewsroomFactory(address multisigFactoryAddr) public {
    multisigFactory = IMultiSigWalletFactory(multisigFactoryAddr);
  }

  /**
  @notice Creates a fully-set-up newsroom, a multisig wallet and transfers it's ownership straight to the wallet at hand
  */
  function create(string name, string charterUri, bytes32 charterHash, address[] initialOwners, uint initialRequired)
    public
    returns (Newsroom newsroom)
  {
    address wallet = multisigFactory.create(initialOwners, initialRequired);
    newsroom = new Newsroom(name, charterUri, charterHash);
    newsroom.addEditor(msg.sender);
    newsroom.transferOwnership(wallet);
    register(newsroom);
  }
}
