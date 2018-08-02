pragma solidity ^0.4.19;

import "../zeppelin-solidity/Ownable.sol";

import "./ContractAddressRegistry.sol";

contract RestrictedAddressRegistry is ContractAddressRegistry {

  modifier onlyContractOwner(address _contractAddress) {
    Ownable ownedContract = Ownable(_contractAddress);
    require(ownedContract.owner() == msg.sender);
    _;
  }

  // --------------------
  // PUBLISHER INTERFACE:
  // --------------------

  /**
  @notice Allows a user to start an application. Takes tokens from user and sets apply stage end time.
  --------
  In order to apply:
  1) Listing must not currently be whitelisted
  2) Listing must not currently be in application pahse
  3) Tokens deposited must be greater than or equal to the minDeposit value from the parameterizer
  4) Listing Address must point to owned contract
  5) Sender of message must be owner of contract at Listing Address
  --------
  Emits `_Application` event if successful
  @param amount The number of ERC20 tokens a user is willing to potentially stake
  @param data Extra data relevant to the application. Think IPFS hashes.
  */
  function apply(address listingAddress, uint amount, string data) onlyContractOwner(listingAddress) public {
    super.apply(listingAddress, amount, data);
  }
}
