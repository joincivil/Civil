pragma solidity ^0.4.19;
import "../newsroom/ACL.sol";


contract DummyACL is ACL {
  string constant public TEST_ROLE = "testrole";

  function DummyACL() ACL() public {
  }

  function addRole(address who, string what) public requireRole(TEST_ROLE) {
    _addRole(who, what);
  }

  function removeRole(address who, string what) public requireRole(TEST_ROLE) {
    _removeRole(who, what);
  }
}
