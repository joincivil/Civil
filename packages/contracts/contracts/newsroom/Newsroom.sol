pragma solidity ^0.4.19;
import "./ACL.sol";

contract Newsroom is ACL {
  event RevisionPublished(address indexed editor, uint indexed id, string uri);
  event NameChanged(string newName);

  string private constant ROLE_REPORTER = "reporter";
  string private constant ROLE_EDITOR = "editor";

  uint private latestId;
  mapping(uint => Revision) public content;

  string public name;

  function Newsroom(string newsroomName) ACL() public {
    setName(newsroomName);
  }

  function setName(string newName) public onlyOwner() {
    require(bytes(newName).length > 0);
    name = newName;

    NameChanged(name);
  }

  function addRole(address who, string role) public requireRole(ROLE_EDITOR) {
    _addRole(who, role);
  }

  function removeRole(address who, string role) public requireRole(ROLE_EDITOR) {
    _removeRole(who, role);
  }

  function publishRevision(string contentUri, bytes32 contentHash) public requireRole(ROLE_EDITOR) returns (uint) {
    require(bytes(contentUri).length > 0);
    require(contentHash.length > 0);

    uint id = latestId;
    latestId++;

    content[id] = Revision(
      contentHash,
      contentUri,
      now,
      0x0
    );

    RevisionPublished(msg.sender, id, contentUri);
    return id;
  }

  struct Revision {
    bytes32 hash;
    string uri;
    uint timestamp;
    address author;
  }
}
