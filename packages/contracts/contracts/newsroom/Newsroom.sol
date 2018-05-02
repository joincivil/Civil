pragma solidity ^0.4.19;

import "./ACL.sol";
import "../zeppelin-solidity/ECRecovery.sol";

contract Newsroom is ACL {
  using ECRecovery for bytes32;

  event RevisionPublished(address indexed editor, uint indexed id, string uri);
  event RevisionSigned(address indexed editor, uint indexed id, address indexed author);
  event NameChanged(string newName);

  string private constant ROLE_EDITOR = "editor";

  uint private latestId;
  mapping(uint => Revision) public content;
  mapping(uint => SignedRevision) public signedContent;

  string public name;

  function Newsroom(string newsroomName) ACL() public {
    setName(newsroomName);
  }

  function setName(string newName) public onlyOwner() {
    require(bytes(newName).length > 0);
    name = newName;

    emit NameChanged(name);
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
      now
    );

    emit RevisionPublished(msg.sender, id, contentUri);
    return id;
  }

  function publishRevisionSigned(string contentUri, bytes32 contentHash, address author, bytes signature) public requireRole(ROLE_EDITOR) returns (uint) {
    verifyRevisionSignature(contentHash, author, signature);

    uint id = publishRevision(contentUri, contentHash);
    signedContent[id] = SignedRevision(
      author,
      signature
    );

    emit RevisionSigned(msg.sender, id, author);
  }

  function verifyRevisionSignature(bytes32 contentHash, address author, bytes signature) view internal {
    bytes32 hashedMessage = keccak256(
      address(this),
      contentHash
    ).toEthSignedMessageHash();

    require(hashedMessage.recover(signature) == author);
  }

  struct Revision {
    bytes32 contentHash;
    string uri;
    uint timestamp;
  }

  struct SignedRevision {
    address author;
    bytes signature;
  }
}
