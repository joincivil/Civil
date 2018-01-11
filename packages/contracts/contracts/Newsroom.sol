pragma solidity 0.4.18;
import "./ACL.sol";


contract Newsroom is ACL {
  event ContentProposed(address indexed author, uint indexed id);
  event ContentApproved(uint id);
  event ContentDenied(uint id);

  string constant ROLE_REPORTER = "reporter";
  string constant ROLE_EDITOR = "editor";

  uint private latestId;
  mapping(uint => Content) private content;
  mapping(uint => bool) private waiting;
  mapping(uint => bool) private approved;

  function Newsroom() public {
    _addSuperuser(msg.sender);
  }

  function author(uint contentId) public view returns (address) {
    return content[contentId].author;
  }

  function uri(uint contentId) public view returns (string) {
    return content[contentId].uri;
  }

  function timestamp(uint contentId) public view returns (uint) {
    return content[contentId].timestamp;
  }

  function isProposed(uint contentId) public view returns (bool) {
    return waiting[contentId];
  }

  function isApproved(uint contentId) public view returns (bool) {
    return approved[contentId];
  }

  function addDirector(address who) public requireSuperuser() {
    _addSuperuser(who);
  }

  function removeDirector(address who) public requireSuperuser() {
    _removeSuperuser(who);
  }

  function addRole(address who, string role) public requireRole(ROLE_EDITOR) {
    _addRole(who, role);
  }

  function removeRole(address who, string role) public requireRole(ROLE_EDITOR) {
    _removeRole(who, role);
  }

  function proposeContent(string contentUri) public requireRole(ROLE_REPORTER) returns (uint) {
    require(bytes(contentUri).length > 0);

    uint id = latestId;
    latestId++;

    content[id] = Content(
      contentUri,
      msg.sender,
      now
    );
    waiting[id] = true;
    ContentProposed(msg.sender, id);
    return id;
  }

  function approveContent(uint id) public requireRole(ROLE_EDITOR) {
    require(waiting[id] == true);
    require(content[id].author != 0x0);
    delete waiting[id];
    approved[id] = true;
    ContentApproved(id);
  }

  function denyContent(uint id) public requireRole(ROLE_EDITOR) {
    require(waiting[id] == true);
    delete waiting[id];
    delete content[id];
    ContentDenied(id);
  }

  struct Content {
    string uri;
    address author;
    uint timestamp;
  }
}
