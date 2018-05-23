pragma solidity ^0.4.19;
import "../zeppelin-solidity/Ownable.sol";

/**
@title String-based Access Control List
@author The Civil Media Company
@dev The owner of this smart-contract overrides any role requirement in the requireRole modifier,
and so it is important to use the modifier instead of checking hasRole when creating actual requirements.
The internal functions are not secured in any way and should be extended in the deriving contracts to define
requirements that suit that specific domain.
*/
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

  /**
  @notice Returns whether a specific addres has a role. Keep in mind that the owner can override role checks
  @param user The address for which role check is done
  @param role A constant name of the role being checked
  */
  function hasRole(address user, string role) public view returns (bool) {
    return roles[role].actors[user];
  }

  /**
  @notice Returns if the specified address is owner of this smart-contract and thus can override any role checks
  @param user The checked address
  */
  function isOwner(address user) public view returns (bool) {
    return user == owner;
  }

  function _addRole(address grantee, string role) internal {
    roles[role].actors[grantee] = true;
    emit RoleAdded(msg.sender, grantee, role);
  }

  function _removeRole(address grantee, string role) internal {
    delete roles[role].actors[grantee];
    emit RoleRemoved(msg.sender, grantee, role);
  }

  struct RoleData {
    mapping(address => bool) actors;
  }
}
