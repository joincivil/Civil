pragma solidity ^0.4.19;
/**
@title Governemnt
@author Nick Reynolds - nick@joincivil.com
*/
contract Government {
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

  function getAppellate() public view returns (address) {
    return appellate;
  }

  function getGovernmentController() public view returns (address) {
    return governmentController;
  }

  /**
  @notice gets the parameter keyed by the provided name value from the params mapping
  @param _name the key whose value is to be determined
  */
  function get(string _name) public view returns (uint value) {
    return params[keccak256(_name)];
  }

  /**
  @dev sets the param keted by the provided name to the provided value
  @param _name the name of the param to be set
  @param _value the value to set the param to be set
  */
  function set(string _name, uint _value) public onlyAppellate {
    params[keccak256(_name)] = _value;
  }

  function internalSet(string _name, uint _value) internal {
    params[keccak256(_name)] = _value;
  }

  /**
  @param newAppellate address of entity that will be made the Appellate
  */
  function setAppellate(address newAppellate) external onlyGovernmentController {
    appellate = newAppellate;
    AppellateSet(newAppellate);
  }
}
