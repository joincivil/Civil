pragma solidity ^0.4.24;
import "./ManagedWhitelist.sol";
import "./ERC1404/ERC1404.sol";
import "./ERC1404/MessagesAndCodes.sol";
import "../newsroom/NewsroomFactory.sol";
import "../proof-of-use/telemetry/TokenTelemetryI.sol";

contract CivilTokenController is ManagedWhitelist, ERC1404, TokenTelemetryI {
  using MessagesAndCodes for MessagesAndCodes.Data;
  MessagesAndCodes.Data internal messagesAndCodes;

  uint8 public constant SUCCESS_CODE = 0;
  string public constant SUCCESS_MESSAGE = "SUCCESS";

  uint8 public constant MUST_BE_A_CIVILIAN_CODE = 1;
  string public constant MUST_BE_A_CIVILIAN_ERROR = "MUST_BE_A_CIVILIAN";

  uint8 public constant MUST_BE_UNLOCKED_CODE = 2;
  string public constant MUST_BE_UNLOCKED_ERROR = "MUST_BE_UNLOCKED";

  uint8 public constant MUST_BE_VERIFIED_CODE = 3;
  string public constant MUST_BE_VERIFIED_ERROR = "MUST_BE_VERIFIED";

  constructor () public {
    messagesAndCodes.addMessage(SUCCESS_CODE, SUCCESS_MESSAGE);
    messagesAndCodes.addMessage(MUST_BE_A_CIVILIAN_CODE, MUST_BE_A_CIVILIAN_ERROR);
    messagesAndCodes.addMessage(MUST_BE_UNLOCKED_CODE, MUST_BE_UNLOCKED_ERROR);
    messagesAndCodes.addMessage(MUST_BE_VERIFIED_CODE, MUST_BE_VERIFIED_ERROR);

  }

  function detectTransferRestriction (address from, address to, uint value)
      public
      view
      returns (uint8)
  {
    // FROM is core or users that have proved use
    if (coreList[from] || unlockedList[from]) {
      return SUCCESS_CODE;
    } else if (storefrontList[from]) { // FROM is a storefront wallet
      // allow if this is going to a verified user or a core address
      if (verifiedList[to] || coreList[to]) {
        return SUCCESS_CODE;
      } else {
        // Storefront cannot transfer to wallets that have not been KYCed
        return MUST_BE_VERIFIED_CODE;
      }
    } else if (newsroomMultisigList[from]) { // FROM is a newsroom multisig
      // TO is CORE or CIVILIAN
      if ( coreList[to] || civilianList[to]) {
        return SUCCESS_CODE;
      } else {
        return MUST_BE_UNLOCKED_CODE;
      }
    } else if (civilianList[from]) { // FROM is a civilian
      // FROM is sending TO a core address or a newsroom
      if (coreList[to] || newsroomMultisigList[to]) {
        return SUCCESS_CODE;
      } else {
        // otherwise fail
        return MUST_BE_UNLOCKED_CODE;
      }
    } else {
      // reject if FROM is not a civilian
      return MUST_BE_A_CIVILIAN_CODE;
    }
  }

  function messageForTransferRestriction (uint8 restrictionCode)
    public
    view
    returns (string message)
  {
    message = messagesAndCodes.messages[restrictionCode];
  }

  function onRequestVotingRights(address user, uint tokenAmount) external {
    addToUnlocked(user);
  }
}
