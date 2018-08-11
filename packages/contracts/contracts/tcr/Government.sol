pragma solidity ^0.4.19;
import "../interfaces/IGovernment.sol";
import "../installed_contracts/PLCRVoting.sol";
import "../installed_contracts/EIP20Interface.sol";
import "../zeppelin-solidity/SafeMath.sol";

/**
@title Government
@notice The Government contract keeps track of parameters related to the CivilTCR appeals process.
@dev These parameters are kept in a mapping, similar to that of the Parameterizer, in order to save on gas
cost of deployment (specifically to minimize the size of the IGovernment interface)
@author Nick Reynolds - nick@joincivil.com
*/
contract Government is IGovernment {
  event AppellateSet(address newAppellate);
  event ParameterSet(string name, uint value);
  event _GovtReparameterizationProposal(string name, uint value, bytes32 propID, uint pollID);
  event _ProposalPassed(bytes32 propId, uint pollID);
  event _ProposalFailed(bytes32 propId, uint pollID);
  
  modifier onlyGovernmentController {
    require(msg.sender == governmentController);
    _;
  }

  modifier onlyAppellate {
    require(msg.sender == appellate);
    _;
  }

  using SafeMath for uint;

  struct GovtParamProposal {
    uint pollID;
    string name;
    uint processBy;
    uint value;
    bool resolved;
  }

  address public appellate;
  address public governmentController;
  bytes32 public constitutionHash;
  string public constitutionURI;
  mapping(bytes32 => uint) public params;
  mapping(bytes32 => GovtParamProposal) public proposals;

  // Global Variables
  EIP20Interface public token;
  PLCRVoting public voting;
  // solium-disable-next-line
  uint public PROCESSBY = 604800; // 7 days

  /**
  @param appellateAddr address of entity that will be the Appellate
  @param governmentControllerAddr address of entity that will be the Government Controller
  */
  function Government(
    address appellateAddr,
    address governmentControllerAddr,        
    address tokenAddr,
    address plcrAddr,
    uint appealFeeAmount,
    uint requestAppealLength,
    uint judgeAppealLength,
    uint appealSupermajorityPercentage,
    uint pDeposit,
    uint pCommitStageLength,
    uint pRevealStageLength,
    bytes32 constHash,
    string constURI
  ) public
  {
    require(appellateAddr != 0);
    require(governmentControllerAddr != 0);
    appellate = appellateAddr;
    governmentController = governmentControllerAddr;
    token = EIP20Interface(tokenAddr);
    voting = PLCRVoting(plcrAddr);
    set("requestAppealLen", requestAppealLength);
    set("judgeAppealLen", judgeAppealLength);
    set("appealFee", appealFeeAmount);
    set("appealVotePercentage", appealSupermajorityPercentage);
    set("govtPCommitStageLen", pCommitStageLength);
    set("govtPRevealStageLen", pRevealStageLength);
    constitutionHash = constHash;
    constitutionURI = constURI;
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
  @notice propose a reparamaterization of the key _name's value to _value.
  @param _name the name of the proposed param to be set
  @param _value the proposed value to set the param to be set
  */
  function proposeReparameterization(string _name, uint _value) public onlyAppellate returns (bytes32) {
    bytes32 propID = keccak256(_name, _value);

    if (keccak256(_name) == keccak256("appealVotePercentage")) {
      require(_value <= 100);
    }

    require(!propExists(propID)); // Forbid duplicate proposals
    require(get(_name) != _value); // Forbid NOOP reparameterizations

    //start poll
    uint pollID = voting.startPoll(
      get("appealVotePercentage"),
      get("govtPCommitStageLen"),
      get("govtPRevealStageLen")
    );
    // attach name and value to pollID
    proposals[propID] = GovtParamProposal({
      pollID: pollID,
      name: _name,
      processBy: now.add(get("govtPCommitStageLen"))
        .add(get("govtPRevealStageLen"))
        .add(PROCESSBY),
      value: _value,
      resolved: false
    });

    emit _GovtReparameterizationProposal(_name, _value, propID, pollID);
    return propID;
  }

  /**
  @notice             for the provided proposal ID, set it, resolve its challenge, or delete it depending on whether it can be set, has a challenge which can be resolved, or if its "process by" date has passed
  @param _propID      the proposal ID to make a determination and state transition for
  */
  function processProposal(bytes32 _propID) public {
    if (propCanBeResolved(_propID)) {
      resolveProposal(_propID);
    } else {
      revert();
    }
  }

  /**
  @notice Determines whether a proposal exists for the provided proposal ID
  @param _propID The proposal ID whose existance is to be determined
  */
  function propExists(bytes32 _propID) view public returns (bool) {
    return proposals[_propID].processBy > 0;
  }

  /**
  @dev resolves a challenge for the provided _propID. It must be checked in advance whether the _propID has a challenge on it
  @param _propID the proposal ID whose challenge is to be resolved.
  */
  function resolveProposal(bytes32 _propID) private {
    GovtParamProposal storage prop = proposals[_propID];

    prop.resolved = true;

    if (voting.isPassed(prop.pollID)) { // The challenge failed
      if (prop.processBy > now) {
        set(prop.name, prop.value);
      }
      emit _ProposalPassed(_propID, prop.pollID);
    } else { // The challenge succeeded or nobody voted
      emit _ProposalFailed(_propID, prop.pollID);
    }
    delete proposals[_propID];
  }

  /**
  @notice Determines whether the provided proposal ID can be resolved
  @param _propID The ID of proposal to inspect
  */
  function propCanBeResolved(bytes32 _propID) view public returns (bool) {
    GovtParamProposal memory prop = proposals[_propID];

    return (prop.pollID > 0 && prop.resolved == false && voting.pollEnded(prop.pollID));
  }

  /**
  @notice sets the param keyed by the provided name to the provided value.
  @param name the name of the param to be set
  @param value the value to set the param to be set
  @dev this functionality is separated out from `set` so that we can bypass the `onlyAppellate`
  modifier when setting initial values in the constructor
  */
  function set(string name, uint value) internal {
    params[keccak256(name)] = value;
    emit ParameterSet(name, value);
  }

  /**
  @notice sets a new Appellate address (entity that is allowed to grant appeals and modify appeal parameters)
  @param newAppellate address of entity that will be made the Appellate
  */
  function setAppellate(address newAppellate) external onlyGovernmentController {
    require(newAppellate != 0);
    appellate = newAppellate;
    emit AppellateSet(newAppellate);
  }
}
