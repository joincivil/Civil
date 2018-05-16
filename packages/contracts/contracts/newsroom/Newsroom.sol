pragma solidity ^0.4.19;

import "./ACL.sol";
import "../zeppelin-solidity/ECRecovery.sol";

contract Newsroom is ACL {
  using ECRecovery for bytes32;

  event ContentPublished(address indexed editor, uint indexed contentId, string uri);
  event ContentSigned(uint indexed contentId, address indexed author);
  event RevisionUpdated(address indexed editor, uint indexed contentId, uint indexed revisionId, string uri);
  event NameChanged(string newName);

  string private constant ROLE_EDITOR = "editor";

  mapping(uint => Revision[]) private content;
  mapping(uint => SignedContent) public signedContent;

  /**
  @notice The number of different contents in this Newsroom, indexed in <0, contentCount) (exclusive) range
  */
  uint public contentCount;
  string public name;

  function Newsroom(string newsroomName) ACL() public {
    setName(newsroomName);
  }

  function getContent(uint contentId) external view returns (bytes32 contentHash, string uri, uint timestamp) {
    Revision[] storage myContent = content[contentId];
    require(myContent.length > 0);

    Revision storage myRevision = myContent[myContent.length - 1];

    return (myRevision.contentHash, myRevision.uri, myRevision.timestamp);
  }

  function getRevision(uint contentId, uint revisionId) external view returns (bytes32 contentHash, string uri, uint timestamp) {
    Revision[] storage myContent = content[contentId];
    require(myContent.length > revisionId);

    Revision storage myRevision = myContent[revisionId];

    return (myRevision.contentHash, myRevision.uri, myRevision.timestamp);
  }

  function revisionCount(uint contentId) external view returns (uint) {
    return content[contentId].length;
  }

  function isSigned(uint contentId) public view returns (bool) {
    return signedContent[contentId].author != 0x0;
  }

  function setName(string newName) public onlyOwner() {
    require(bytes(newName).length > 0);
    name = newName;

    emit NameChanged(name);
  }

  function addRole(address who, string role) external requireRole(ROLE_EDITOR) {
    _addRole(who, role);
  }

  function removeRole(address who, string role) external requireRole(ROLE_EDITOR) {
    _removeRole(who, role);
  }

  function publishContent(string contentUri, bytes32 contentHash) public requireRole(ROLE_EDITOR) returns (uint) {
    uint contentId = contentCount;
    contentCount++;

    pushRevision(contentId, contentUri, contentHash);

    emit ContentPublished(msg.sender, contentId, contentUri);
    return contentId;
  }

  function publishContentSigned(
    string contentUri,
    bytes32 contentHash,
    address author,
    bytes signature
  ) external requireRole(ROLE_EDITOR) returns (uint)
  {
    uint contentId = publishContent(contentUri, contentHash);

    SignedContent storage signData = signedContent[contentId];
    signData.author = author;

    pushSignature(signData, contentHash, signature);

    emit ContentSigned(contentId, author);
  }

  function updateRevision(uint contentId, string contentUri, bytes32 contentHash) external requireRole(ROLE_EDITOR) {
    require(!isSigned(contentId));
    pushRevision(contentId, contentUri, contentHash);
  }

  function updateRevisionSigned(
    uint contentId,
    string contentUri,
    bytes32 contentHash,
    bytes signature
  ) external requireRole(ROLE_EDITOR)
  {
    require(isSigned(contentId));

    pushSignature(signedContent[contentId], contentHash, signature);
    pushRevision(contentId, contentUri, contentHash);
  }

  function verifyRevisionSignature(bytes32 contentHash, address author, bytes signature) view internal {
    require(author != 0x0);
    bytes32 hashedMessage = keccak256(
      address(this),
      contentHash
    ).toEthSignedMessageHash();

    require(hashedMessage.recover(signature) == author);
  }

  function pushRevision(uint contentId, string contentUri, bytes32 contentHash) internal {
    require(contentId < contentCount);
    require(bytes(contentUri).length > 0);
    require(contentHash != 0x0);

    Revision[] storage revisions = content[contentId];
    uint revisionId = revisions.length;

    revisions.push(Revision(
      contentHash,
      contentUri,
      now
    ));

    emit RevisionUpdated(msg.sender, contentId, revisionId, contentUri);
  }

  function pushSignature(SignedContent storage signData, bytes32 contentHash, bytes signature) internal {
    verifyRevisionSignature(contentHash, signData.author, signature);
    signData.revisionSignatures.push(signature);
  }

  struct Revision {
    bytes32 contentHash;
    string uri;
    uint timestamp;
  }

  struct SignedContent {
    address author;
    bytes[] revisionSignatures;
  }
}
