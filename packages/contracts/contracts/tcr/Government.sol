pragma solidity ^0.4.24;
import "../interfaces/IGovernment.sol";
import "../installed_contracts/PLCRVoting.sol";
import "../installed_contracts/EIP20Interface.sol";
import "../zeppelin-solidity/math/SafeMath.sol";

/**
@title Government
@notice The Government contract keeps track of parameters related to the CivilTCR appeals process.
@dev These parameters are kept in a mapping, similar to that of the Parameterizer, in order to save on gas
cost of deployment (specifically to minimize the size of the IGovernment interface)
@author Nick Reynolds - nick@joincivil.com
*/
contract Government is IGovernment {
  event _AppellateSet(address newAppellate);
  event _ParameterSet(string name, uint value);
  event _GovtReparameterizationProposal(string name, uint value, bytes32 propID, uint pollID);
  event _ProposalPassed(bytes32 propId, uint pollID);
  event _ProposalFailed(bytes32 propId, uint pollID);
  event _NewConstProposal(bytes32 proposedHash, string proposedURI, uint pollID);
  event _NewConstProposalPassed(bytes32 constHash, string constURI);
  event _NewConstProposalFailed(bytes32 constHash, string constURI);

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
  }

  struct NewConstProposal {
    uint pollID;
    bytes32 newConstHash;
    string newConstURI;
    uint processBy;
  }

  address public appellate;
  address public governmentController;
  bytes32 public constitutionHash;
  string public constitutionURI;
  mapping(bytes32 => uint) public params;
  mapping(bytes32 => GovtParamProposal) public proposals;
  NewConstProposal activeConstProp;

  // Global Variables
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
      value: _value
    });

    emit _GovtReparameterizationProposal(_name, _value, propID, pollID);
    return propID;
  }

    /**
  @notice propose a new constitution to be voted on.
  @param _newConstHash the hash of the proposed constitution
  @param _newConstURI the URI of the proposed constitution
  */
  function proposeNewConstitution(bytes32 _newConstHash, string _newConstURI) public onlyAppellate {
    require(activeConstProp.processBy == 0); // no active proposal
    //start poll
    uint pollID = voting.startPoll(
      get("appealVotePercentage"),
      get("govtPCommitStageLen"),
      get("govtPRevealStageLen")
    );
    // attach name and value to pollID
    activeConstProp = NewConstProposal({
      pollID: pollID,
      newConstHash: _newConstHash,
      newConstURI: _newConstURI,
      processBy: now.add(get("govtPCommitStageLen"))
        .add(get("govtPRevealStageLen"))
        .add(PROCESSBY)
    });

    emit _NewConstProposal(_newConstHash, _newConstURI, pollID);
  }

  /**
  @notice for the provided proposal ID, set it, resolve its vote, or delete it depending on whether it can be set, has a vote which can be resolved, or if its "process by" date has passed
  @param _propID the proposal ID to make a determination and state transition for
  */
  function processProposal(bytes32 _propID) public {
    if (propCanBeResolved(_propID)) {
      resolveProposal(_propID);
    } else {
      revert();
    }
  }

  /**
  @notice try to process a constitution change proposal
  */
  function processConstChangeProp() public {
    if (constChangePropCanBeResolved()) {
      resolveConstChangeProp();
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
  @dev resolves a proposal for the provided _propID.
  @param _propID the proposal ID that is to be resolved.
  */
  function resolveProposal(bytes32 _propID) private {
    GovtParamProposal storage prop = proposals[_propID];

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
  @dev resolves a vote for a proposed constitution change
  */
  function resolveConstChangeProp() private {
    if (voting.isPassed(activeConstProp.pollID)) { // The challenge failed
      if (activeConstProp.processBy > now) {
        constitutionHash = activeConstProp.newConstHash;
        constitutionURI = activeConstProp.newConstURI;
      }
      emit _NewConstProposalPassed(activeConstProp.newConstHash, activeConstProp.newConstURI);
    } else { // The challenge succeeded or nobody voted
      emit _NewConstProposalFailed(activeConstProp.newConstHash, activeConstProp.newConstURI);
    }
    delete activeConstProp;
  }

  /**
  @notice Determines whether the provided proposal ID can be resolved
  @param _propID The ID of proposal to inspect
  */
  function propCanBeResolved(bytes32 _propID) view public returns (bool) {
    GovtParamProposal memory prop = proposals[_propID];

    return (prop.pollID > 0 && voting.pollEnded(prop.pollID));
  }

  function constChangePropCanBeResolved() view public returns (bool) {
    return (activeConstProp.pollID > 0 && voting.pollEnded(activeConstProp.pollID));
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
    emit _ParameterSet(name, value);
  }

  /**
  @notice sets a new Appellate address (entity that is allowed to grant appeals and modify appeal parameters)
  @param newAppellate address of entity that will be made the Appellate
  */
  function setAppellate(address newAppellate) external onlyGovernmentController {
    require(newAppellate != 0);
    appellate = newAppellate;
    emit _AppellateSet(newAppellate);
  }
}
