pragma solidity ^0.4.19;
import "../interfaces/IGovernment.sol";

/**
@title Government
@notice The Government contract keeps track of parameters related to the CivilTCR appeals process.
@dev These parameters are kept in a mapping, similar to that of the Parameterizer, in order to save on gas
cost of deployment (specifically to minimize the size of the IGovernment interface)
@author Nick Reynolds - nick@joincivil.com
*/
contract Government is IGovernment {
  event AppellateSet(address newAppellate);

  modifier onlyGovernmentController {
    require(msg.sender == governmentController);
    _;
  }

  modifier onlyAppellate {
    require(msg.sender == appellate);
    _;
  }

  address public appellate;
  address public governmentController;
  mapping(bytes32 => uint) public params;

  /**
  @param appellateAddr address of entity that will be the Appellate
  @param governmentControllerAddr address of entity that will be the Government Controller
  */
  function Government(
    address appellateAddr,
    address governmentControllerAddr,
    uint appealFeeAmount,
    uint requestAppealLength,
    uint judgeAppealLength
  ) public 
  {
    appellate = appellateAddr;
    governmentController = governmentControllerAddr;
    internalSet("requestAppealPhaseLength", requestAppealLength);
    internalSet("judgeAppealPhaseLength", judgeAppealLength);
    internalSet("appealFee", appealFeeAmount);
  }

  /**
  @notice Returns the address of the entity that acts as an Appellate.
  The Appellate can modify Appeals parameters (via the `set` function)
  */
  function getAppellate() public view returns (address) {
    return appellate;
  }

  /**
  @notice Returns the address of the entity that controls this Government.
  The Government controller can set the Appellate.
  */
  function getGovernmentController() public view returns (address) {
    return governmentController;
  }

  /**
  @notice gets the parameter keyed by the provided name value from the params mapping
  @param name the key whose value is to be determined
  */
  function get(string name) public view returns (uint value) {
    return params[keccak256(name)];
  }

  /**
  @notice sets the param keyed by the provided name to the provided value.
  Can only be called by the Appellate.
  @param name the name of the param to be set
  @param value the value to set the param to be set
  */
  function set(string name, uint value) public onlyAppellate {
    internalSet(name, value);
  }

  /**
  @notice sets the param keyed by the provided name to the provided value.
  @param name the name of the param to be set
  @param value the value to set the param to be set
  @dev this functionality is separated out from `set` so that we can bypass the `onlyAppellate`
  modifier when setting initial values in the constructor
  */
  function internalSet(string name, uint value) internal {
    params[keccak256(name)] = value;
  }

  /**
  @notice sets a new Appellate address (entity that is allowed to grant appeals and modify appeal parameters)
  @param newAppellate address of entity that will be made the Appellate
  */
  function setAppellate(address newAppellate) external onlyGovernmentController {
    appellate = newAppellate;
    AppellateSet(newAppellate);
  }
}
