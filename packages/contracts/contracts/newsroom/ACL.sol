pragma solidity ^0.4.19;
import "../zeppelin-solidity/Ownable.sol";

contract ACL is Ownable {
  event RoleAdded(address indexed granter, address indexed grantee, string role);
  event RoleRemoved(address indexed granter, address indexed grantee, string role);

  mapping(string => RoleData) private roles;

  modifier requireRole(string role) {
    require(isOwner(msg.sender) || hasRole(msg.sender, role));
    _;
  }

  function ACL() Ownable() public {
  }

  function hasRole(address user, string role) public view returns (bool) {
    return roles[role].actors[user];
  }

  function isOwner(address user) public view returns (bool) {
    return user == owner;
  }

  /// Adds a role to a grantee without any role checking
  /// Add role checking in deriving contract
  function _addRole(address grantee, string role) internal {
    roles[role].actors[grantee] = true;
    RoleAdded(msg.sender, grantee, role);
  }

  function _removeRole(address grantee, string role) internal {
    delete roles[role].actors[grantee];
    RoleRemoved(msg.sender, grantee, role);
  }

  struct RoleData {
    mapping(address => bool) actors;
  }
}
