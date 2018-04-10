pragma solidity ^0.4.19;
// TODO(ritave): Think of a way to not require contracts out of package
import "../multisig/Factory.sol";

import "../interfaces/IMultiSigWalletFactory.sol";
import "./Newsroom.sol";

contract NewsroomFactory is Factory {
  IMultiSigWalletFactory public multisigFactory;

  function NewsroomFactory(address _multisigFactory) public {
    multisigFactory = IMultiSigWalletFactory(_multisigFactory);
  }

  function create(string name, address[] _owners, uint _required)
    public
    returns (Newsroom newsroom)
  {
    address wallet = multisigFactory.create(_owners, _required);
    newsroom = new Newsroom(name);
    newsroom.transferOwnership(wallet);
    register(newsroom);
  }
}
