pragma solidity ^0.4.23;

/// @title Interface for token controllers. The controller specifies whether a transfer can be done.
contract TokenControllerI {

  /// @dev Specifies whether a transfer is allowed or not.
  /// @return True if the transfer is allowed
  function transferAllowed(address _from, address _to) external view returns (bool);
}
