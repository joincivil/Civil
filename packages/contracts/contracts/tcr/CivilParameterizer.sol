pragma solidity ^0.4.19;

import "../installed_contracts/Parameterizer.sol";

contract CivilParameterizer is Parameterizer {

  /**
  @param tokenAddr           The address where the ERC20 token contract is deployed
  @param plcrAddr            address of a PLCR voting contract for the provided token
  @notice parameters     array of canonical parameters
  */
  constructor(
    address tokenAddr,
    address plcrAddr,
    uint[] parameters
  ) public Parameterizer(tokenAddr, plcrAddr, parameters)
  {
    set("challengeAppealLen", parameters[12]);
    set("challengeAppealCommitLen", parameters[13]);
    set("challengeAppealRevealLen", parameters[14]);
  }
}

