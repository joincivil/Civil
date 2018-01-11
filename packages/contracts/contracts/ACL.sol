pragma solidity 0.4.18;

contract ACL {
  event SuperuserAdded(address indexed granter, address indexed grantee);
  event SuperuserRemoved(address indexed granter, address indexed grantee);
  event RoleAdded(address indexed granter, address indexed grantee, string role);
  event RoleRemoved(address indexed granter, address indexed grantee, string role);

  mapping(address => bool) superusers;
  mapping(string => RoleList) roles;

  modifier requireSuperuser() {
    require(isSuperuser(msg.sender));
    _;
  }

  modifier requireRole(string role) {
    require(isSuperuser(msg.sender) || hasRole(msg.sender, role));
    _;
  }

  function isSuperuser(address user) view public returns (bool) {
    return superusers[user];
  }

  function hasRole(address user, string role) view public returns (bool) {
    return roles[role].actors[user];
  }

  function _addSuperuser(address user) internal {
    superusers[user] = true;
    SuperuserAdded(msg.sender, user);
  }

  function _removeSuperuser(address user) internal { 
    delete superusers[user];
    SuperuserRemoved(msg.sender, user);
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

  struct RoleList {
    mapping(address => bool) actors;
  }
}
