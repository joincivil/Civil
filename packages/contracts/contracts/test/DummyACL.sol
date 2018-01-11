pragma solidity 0.4.18;
import "../ACL.sol";


contract DummyACL is ACL {
  string constant public TEST_ROLE = "testrole";

  function DummyACL() public {
    _addSuperuser(msg.sender);
  }

  function addSuperuser(address who) public requireSuperuser() {
    _addSuperuser(who);
  }

  function removeSuperuser(address who) public requireSuperuser() {
    _removeSuperuser(who);
  }

  function addRole(address who, string what) public requireRole(TEST_ROLE) {
    _addRole(who, what);
  }

  function removeRole(address who, string what) public requireRole(TEST_ROLE) {
    _removeRole(who, what);
  }
}
