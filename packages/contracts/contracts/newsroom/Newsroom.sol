pragma solidity ^0.4.19;

import "./ACL.sol";
import "../zeppelin-solidity/ECRecovery.sol";

/**
@title Newsroom - Smart-contract allowing for Newsroom-like goverance and content publishing

@dev The content number 0 is created automatically and it's use is reserved for the Newsroom charter / about page

Roles that are currently supported are:
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
The signing can be seen in (at)joincivil/utils package, function prepareNewsroomMessage function (and web3.eth.sign() it afterwards)
*/
contract Newsroom is ACL {
  using ECRecovery for bytes32;

  event ContentPublished(address indexed editor, uint indexed contentId, string uri);
  event RevisionSigned(uint indexed contentId, uint indexed revisionId, address indexed author);
  event RevisionUpdated(address indexed editor, uint indexed contentId, uint indexed revisionId, string uri);
  event NameChanged(string newName);

  string private constant ROLE_EDITOR = "editor";

  mapping(uint => Content) private contents;
  /*
  Maps the revision hash to original contentId where it was first used.
  This is used to prevent replay attacks in which a bad actor reuses an already used signature to sign a new revision of new content.
  New revisions with the same contentID can reuse signatures by design -> this is to allow the Editors to change the canonical URL (eg, website change).
  The end-client of those smart-contracts MUST (RFC-Like) verify the content to it's hash and the the hash to the signature.
  */
  mapping(bytes32 => UsedSignature) private usedSignatures;

  /**
  @notice The number of different contents in this Newsroom, indexed in <0, contentCount) (exclusive) range
  */
  uint public contentCount;
  /**
  @notice User readable name of this Newsroom
  */
  string public name;

  function Newsroom(string newsroomName, string charterUri, bytes32 charterHash) ACL() public {
    setName(newsroomName);
    publishContent(charterUri, charterHash, 0x0, "");
  }

  /**
  @notice Gets the latest revision of the content at id contentId
  */
  function getContent(uint contentId) external view returns (bytes32 contentHash, string uri, uint timestamp, address author, bytes signature) {
    return getRevision(contentId, contents[contentId].revisions.length - 1);
  }

  /**
  @notice Gets a specific revision of the content. Each revision increases the ID from the previous one
  @param contentId Which content to get
  @param revisionId Which revision in that get content to get
  */
  function getRevision(
    uint contentId,
    uint revisionId
  ) public view returns (bytes32 contentHash, string uri, uint timestamp, address author, bytes signature)
  {
    Content storage content = contents[contentId];
    require(content.revisions.length > revisionId);

    Revision storage revision = content.revisions[revisionId];

    return (revision.contentHash, revision.uri, revision.timestamp, content.author, revision.signature);
  }

  /**
  @return Number of revisions for a this content, 0 if never published
  */
  function revisionCount(uint contentId) external view returns (uint) {
    return contents[contentId].revisions.length;
  }

  /**
  @notice Returns if the latest revision of the content at ID has the author's signature associated with it
  */
  function isContentSigned(uint contentId) public view returns (bool) {
    return isRevisionSigned(contentId, contents[contentId].revisions.length - 1);
  }

  /**
  @notice Returns if that specific revision of the content has the author's signature
  */
  function isRevisionSigned(uint contentId, uint revisionId) public view returns (bool) {
    Revision[] storage revisions = contents[contentId].revisions;
    require(revisions.length > revisionId);
    return revisions[revisionId].signature.length != 0;
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

  function addEditor(address who) external requireRole(ROLE_EDITOR) {
    _addRole(who, ROLE_EDITOR);
  }

  /**
  @notice Removes a string-based role from the specific address, requires ROLE_EDITOR to use
  */
  function removeRole(address who, string role) external requireRole(ROLE_EDITOR) {
    _removeRole(who, role);
  }

  /**
  @notice Saves the content's URI and it's hash into this Newsroom, this creates a new Content and Revision number 0.
  This function requires ROLE_EDITOR or owner to use.
  The content can be cryptographicaly secured / approved by author as per signing procedure
  @param contentUri Canonical URI to access the content. The client should then verify that the content has the same hash
  @param contentHash Keccak256 hash of the content that is linked
  @param author Author that cryptographically signs the content. 0x0 if not signed
  @param signature Cryptographic signature of the author. Empty if not signed
  @return Content ID of the newly published content

  @dev Emits `ContentPublished`, `RevisionUpdated` and optionaly `ContentSigned` events
  */
  function publishContent(
    string contentUri,
    bytes32 contentHash,
    address author,
    bytes signature
  ) public requireRole(ROLE_EDITOR) returns (uint)
  {
    uint contentId = contentCount;
    contentCount++;

    require((author == 0x0 && signature.length == 0) || (author != 0x0 && signature.length != 0));
    contents[contentId].author = author;
    pushRevision(contentId, contentUri, contentHash, signature);

    emit ContentPublished(msg.sender, contentId, contentUri);
    return contentId;
  }

  /**
  @notice Updates the existing content with a new revision, the content id stays the same while revision id increases afterwards
  Requires that the content was first published
  This function can be only called by ROLE_EDITOR or the owner.
  The new revision can be left unsigned, even if the previous revisions were signed.
  If the new revision is also signed, it has to be approved by the same author that has signed the first revision.
  No signing can be done for articles that were published without any cryptographic author in the first place
  @param signature Signature that cryptographically approves this revision. Empty if not approved
  @return Newest revision id

  @dev Emits `RevisionUpdated`  event
  */
  function updateRevision(uint contentId, string contentUri, bytes32 contentHash, bytes signature) external requireRole(ROLE_EDITOR) {
    pushRevision(contentId, contentUri, contentHash, signature);
  }

  /**
  @notice Allows to backsign a revision by the author. This is indented when an author didn't have time to access
  to their private key but after time they do.
  The author must be the same as the one during publishing.
  If there was no author during publishing this functions allows to update the 0x0 author to a real one.
  Once done, the author can't be changed afterwards

  @dev Emits `RevisionSigned` event
  */
  function signRevision(uint contentId, uint revisionId, address author, bytes signature) external requireRole(ROLE_EDITOR) {
    require(contentId < contentCount);

    Content storage content = contents[contentId];

    require(content.author == 0x0 || content.author == author);
    require(content.revisions.length > revisionId);

    if (contentId == 0) {
      require(isOwner(msg.sender));
    }

    content.author = author;

    Revision storage revision = content.revisions[revisionId];
    revision.signature = signature;

    require(verifyRevisionSignature(author, contentId, revision));

    emit RevisionSigned(contentId, revisionId, author);
  }

  function verifyRevisionSignature(address author, uint contentId, Revision storage revision) internal returns (bool isSigned) {
    if (author == 0x0 || revision.signature.length == 0) {
      require(revision.signature.length == 0);
      return false;
    } else {
      // The url is is not used in the cryptography by design,
      // the rationale is that the Author can approve the content and the Editor might need to set the url
      // after the fact, or things like DNS change, meaning there would be a question of canonical url for that article
      //
      // The end-client of this smart-contract MUST (RFC-like) compare the authenticity of the content behind the URL with the hash of the revision
      bytes32 hashedMessage = keccak256(
        address(this),
        revision.contentHash
      ).toEthSignedMessageHash();

      require(hashedMessage.recover(revision.signature) == author);

      // Prevent replay attacks
      UsedSignature storage lastUsed = usedSignatures[hashedMessage];
      require(lastUsed.wasUsed == false || lastUsed.contentId == contentId);

      lastUsed.wasUsed = true;
      lastUsed.contentId = contentId;

      return true;
    }
  }

  function pushRevision(uint contentId, string contentUri, bytes32 contentHash, bytes signature) internal returns (uint) {
    require(contentId < contentCount);

    if (contentId == 0) {
      require(isOwner(msg.sender));
    }

    Content storage content = contents[contentId];

    uint revisionId = content.revisions.length;

    content.revisions.push(Revision(
      contentHash,
      contentUri,
      now,
      signature
    ));

    if (verifyRevisionSignature(content.author, contentId, content.revisions[revisionId])) {
      emit RevisionSigned(contentId, revisionId, content.author);
    }

    emit RevisionUpdated(msg.sender, contentId, revisionId, contentUri);
  }

  struct Content {
    Revision[] revisions;
    address author;
  }

  struct Revision {
    bytes32 contentHash;
    string uri;
    uint timestamp;
    bytes signature;
  }

  // Since all uints are 0x0 by default, we require additional bool to confirm that the contentID is not equal to content with actualy ID 0x0
  struct UsedSignature {
    bool wasUsed;
    uint contentId;
  }
}
