pragma solidity ^0.4.23;

import "../../zeppelin-solidity/ECRecovery.sol";
import "../../zeppelin-solidity/access/Whitelist.sol";

contract OffChainOwnable {
  using ECRecovery for bytes32;

  Whitelist private owners;

  constructor(Whitelist _owners) public {
    owners = _owners;
  }

  modifier requireSignature(bytes signature, bytes32 hashedAction) {
    require(isValidSignature(signature, hashedAction));

    _;
  }

  function isValidSignature(bytes signature, bytes32 hashedAction) internal view returns (bool) {
    address recovered = keccak256(abi.encodePacked(
        address(this),
        hashedAction)
      )
      .toEthSignedMessageHash()
      .recover(signature);

    return owners.whitelist(recovered);
  }
}
