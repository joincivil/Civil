pragma solidity ^0.4.19;

import "./AddressRegistry.sol";

contract ContractAddressRegistry is AddressRegistry {

  modifier onlyContract(address contractAddress) {
    uint size;
    assembly { size := extcodesize(contractAddress) }
    require(size > 0);
    _;
  }

  /**
  @notice Contructor Sets the addresses for token, voting, and parameterizer
  @dev passes tokenAddr, plcrAddr, paramsAddr up to AddressRegistry constructor
  @param tokenAddr Address of the TCR's intrinsic ERC20 token
  @param plcrAddr Address of a PLCR voting contract for the provided token
  @param paramsAddr Address of a Parameterizer contract
  */
  function ContractAddressRegistry(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr)
    public AddressRegistry(tokenAddr, plcrAddr, paramsAddr)
  {

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
  4) Listing Address must point to contract
  --------
  Emits `_Application` event if successful
  @param amount The number of ERC20 tokens a user is willing to potentially stake
  @param data Extra data relevant to the application. Think IPFS hashes.
  */
  function apply(address listingAddress, uint amount, string data) onlyContract(listingAddress) public {
    super.apply(listingAddress, amount, data);
  }
}
