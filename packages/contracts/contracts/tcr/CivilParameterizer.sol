pragma solidity ^0.4.19;

import "../installed_contracts/Parameterizer.sol";

contract CivilParameterizer is Parameterizer {

  /**
  @param _token           The address where the ERC20 token contract is deployed
  @param _plcr            address of a PLCR voting contract for the provided token
  @notice _parameters     array of canonical parameters
  */
  constructor(
    address _token,
    address _plcr,
    uint[] _parameters
  ) public Parameterizer(_token, _plcr, _parameters)
  {
    set("challengeAppealLen", _parameters[12]);
    set("challengeAppealCommitLen", _parameters[13]);
    set("challengeAppealRevealLen", _parameters[14]);
  }
}

