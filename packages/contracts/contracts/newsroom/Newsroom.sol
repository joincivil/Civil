pragma solidity ^0.4.19;
import "./ACL.sol";

contract Newsroom is ACL {
  event ContentAdded(address indexed editor, uint indexed id);
  event NameChanged(string newName);

  string private constant ROLE_REPORTER = "reporter";
  string private constant ROLE_EDITOR = "editor";

  uint private latestId;
  mapping(uint => Revision) private content;

  string public name;

  function Newsroom(string newsroomName) ACL() public {
    setName(newsroomName);
  }

  function author(uint contentId) public view returns (address) {
    return content[contentId].author;
  }

  function uri(uint contentId) public view returns (string) {
    return content[contentId].uri;
  }

  function hash(uint contentId) public view returns (bytes32) {
    return content[contentId].hash;
  }

  function timestamp(uint contentId) public view returns (uint) {
    return content[contentId].timestamp;
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

  function addContent(string contentUri, bytes32 contentHash) public requireRole(ROLE_EDITOR) returns (uint) {
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

    ContentAdded(msg.sender, id);
    return id;
  }

  struct Revision {
    bytes32 hash;
    string uri;
    uint timestamp;
    address author;
  }
}
