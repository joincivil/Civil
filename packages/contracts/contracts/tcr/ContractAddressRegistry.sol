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
  @dev Contructor         Sets the addresses for token, voting, and parameterizer
  @param tokenAddr       Address of the TCR's intrinsic ERC20 token
  @param plcrAddr        Address of a PLCR voting contract for the provided token
  @param paramsAddr      Address of a Parameterizer contract
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
  @dev                Allows a user to start an application. Takes tokens from user and sets
                      apply stage end time.
  @param amount      The number of ERC20 tokens a user is willing to potentially stake
  */
  function apply(address listingAddress, uint amount, string data) onlyContract(listingAddress) public {
    super.apply(listingAddress, amount, data);
  }
}
