pragma solidity ^0.4.19;

import "../zeppelin-solidity/Ownable.sol";

import "./ContractAddressRegistry.sol";

contract RestrictedAddressRegistry is ContractAddressRegistry {

  modifier onlyContractOwner(address _contractAddress) {
    Ownable ownedContract = Ownable(_contractAddress);
    require(ownedContract.owner() == msg.sender);
    _;
  }

  /**
  @dev Contructor         Sets the addresses for token, voting, and parameterizer
  @param tokenAddr       Address of the TCR's intrinsic ERC20 token
  @param plcrAddr        Address of a PLCR voting contract for the provided token
  @param paramsAddr      Address of a Parameterizer contract
  */
  function RestrictedAddressRegistry(
    address tokenAddr,
    address plcrAddr,
    address paramsAddr)
    public ContractAddressRegistry(tokenAddr, plcrAddr, paramsAddr)
  {

  }

  // --------------------
  // PUBLISHER INTERFACE:
  // --------------------

  /**
  @dev                  Allows a user to start an application. Takes tokens from user and sets
                        apply stage end time.
  @param listingAddress Address of contract to apply
  @param amount         The number of ERC20 tokens a user is willing to potentially stake
  */
  function apply(address listingAddress, uint amount, string data) onlyContractOwner(listingAddress) public {
    super.apply(listingAddress, amount, data);
  }
}
