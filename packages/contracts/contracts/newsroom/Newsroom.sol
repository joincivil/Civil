pragma solidity ^0.4.19;

import "./ACL.sol";
import "../zeppelin-solidity/ECRecovery.sol";

/**
@title Newsroom - Smart-contract allowing for Newsroom-like goverance and content publishing
@notice

@dev Roles that are currently supported are:
- "editor" -> which can publish content, update revisions and add/remove more editors

To post cryptographicaly pre-approved content on the Newsroom, the author's signature must be included and
"Signed"-suffix functions used. Here are the steps to generate authors signature:
1. Take the address of this newsroom and the contentHash as bytes32 and tightly pack them
2. Calculate the keccak256 of tightly packed of above
3. Take the keccak and prepend it with the standard "Ethereum signed message" preffix (see ECRecovery and Ethereum's JSON PRC).
  a. Note - if you're using Ethereum's node instead of manual private key signing, that message shall be prepended by the Node itself
4. Take a keccak256 of that signed messaged
5. Verification can be done by using EC recovery algorithm using the authors signature
The verification can be seen in the internal `verifyRevisionsSignature` function.
The signing can be seen in @joincivil/utils prepareNewsroomMessage function (and web3.eth.sign() it afterwards)
*/
contract Newsroom is ACL {
  using ECRecovery for bytes32;

  event ContentPublished(address indexed editor, uint indexed contentId, string uri);
  event ContentSigned(uint indexed contentId, address indexed author);
  event RevisionUpdated(address indexed editor, uint indexed contentId, uint indexed revisionId, string uri);
  event NameChanged(string newName);

  string private constant ROLE_EDITOR = "editor";

  uint private latestContentId;
  mapping(uint => Revision[]) private content;
  mapping(uint => SignedContent) public signedContent;

  /**
  @notice User readable name of this Newsroom
  */
  string public name;

  function Newsroom(string newsroomName) ACL() public {
    setName(newsroomName);
  }

  /**
  @notice Gets the latest revision of the content at id contentId
  */
  function getContent(uint contentId) external view returns (bytes32 contentHash, string uri, uint timestamp) {
    Revision[] storage myContent = content[contentId];
    require(myContent.length > 0);

    Revision storage myRevision = myContent[myContent.length - 1];

    return (myRevision.contentHash, myRevision.uri, myRevision.timestamp);
  }

  /**
  @notice Gets a specific revision of the content. Each revision increases the ID from the previous one
  @param contentId Which content to get
  @param revisionId Which revision in that get content to get
  */
  function getRevision(uint contentId, uint revisionId) external view returns (bytes32 contentHash, string uri, uint timestamp) {
    Revision[] storage myContent = content[contentId];
    require(myContent.length > revisionId);

    Revision storage myRevision = myContent[revisionId];

    return (myRevision.contentHash, myRevision.uri, myRevision.timestamp);
  }

  /**
  @notice Returns if the content at the id has the author's signature associated with it
  */
  function isSigned(uint contentId) public view returns (bool) {
    return signedContent[contentId].author != 0x0;
  }

  /**
  @notice Changes the user-readable name of this contract.
  This function can be only called by the owner of the Newsroom
  */
  function setName(string newName) public onlyOwner() {
    require(bytes(newName).length > 0);
    name = newName;

    emit NameChanged(name);
  }

  /**
  @notice Adds a string-based role to the specific address, requires ROLE_EDITOR to use
  */
  function addRole(address who, string role) external requireRole(ROLE_EDITOR) {
    _addRole(who, role);
  }

  /**
  @notice Removes a string-based role from the specific address, requires ROLE_EDITOR to use
  */
  function removeRole(address who, string role) external requireRole(ROLE_EDITOR) {
    _removeRole(who, role);
  }

  /**
  @notice Saves the content's URI and it's hash into this Newsroom, this creates a new Content and Revision number 0.
  This function requires ROLE_EDITOR or owner to use
  @param contentUri Canonical URI to access the content. The client should then verify that the content has the same hash
  @param contentHash Keccak256 hash of the content that is linked
  @return Content ID of the newly published content

  @dev Emits `ContentPublished` and `RevisionUpdated` events
  */
  function publishContent(string contentUri, bytes32 contentHash) public requireRole(ROLE_EDITOR) returns (uint) {
    uint contentId = latestContentId;
    latestContentId++;

    pushRevision(contentId, contentUri, contentHash);

    emit ContentPublished(msg.sender, contentId, contentUri);
    return contentId;
  }

  /**
  @notice Allows the editor to publish content that has been cryptographically pre-approved by the author.
  The signature is verified before the content is added to the newsroom.
  This function requires ROLE_EDITOR or owner to use
  @param contentUri Canonical URI to access the content. The client should then verify that the content has the same hash
  @param contentHash Keccak256 hash of the content that is linked
  @param author The public address of the author that is cryptographically approving this content
  @param signature The signature of authors approval as per the signing procedure
  @return Content ID of the newly published content

  @dev See the signing procedure in the dev comments of the whole smart-contract
  Emits `ContentPublished`, `ContentSigned` and `RevisionUpdated` events
  */
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

  /**
  @notice Updates the existing content with a new revision, the content id stays the same while revision id increases afterwards
  Requires that the content was first published
  This function can be only called by ROLE_EDITOR or the owner.
  Can't be used for signed content.

  @dev Emits `RevisionUpdated` event
  */
  function updateRevision(uint contentId, string contentUri, bytes32 contentHash) external requireRole(ROLE_EDITOR) {
    require(!isSigned(contentId));
    pushRevision(contentId, contentUri, contentHash);
  }

  /**
  @notice Updates the existing content with new revision, the content id stays the same while the revision id increases aftewards
  Requires that the content was first published and signed.
  This function can be only called by ROLE_EDITOR or the owner.
  No new author is accepted as the revision needs to be pre-approved by the same author as the original published article

  @dev See the signing procedure in the dev comments of the whole smart-contract
  Emits `RevisionUpdated` event
  */
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
    require(contentId < latestContentId);
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
