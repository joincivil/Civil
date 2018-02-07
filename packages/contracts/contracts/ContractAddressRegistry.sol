pragma solidity ^0.4.18;

import "./AddressRegistry.sol";
import "./ACL.sol";

contract ContractAddressRegistry is AddressRegistry {

  modifier onlyContract(address contractAddress) {
    uint size;
    assembly { size := extcodesize(contractAddress) }
    require(size > 0);
    _;
  }

  /**
  @dev Contructor         Sets the addresses for token, voting, and parameterizer
  @param _tokenAddr       Address of the TCR's intrinsic ERC20 token
  @param _plcrAddr        Address of a PLCR voting contract for the provided token
  @param _paramsAddr      Address of a Parameterizer contract 
  */
  function ContractAddressRegistry(
      address _tokenAddr,
      address _plcrAddr,
      address _paramsAddr
  ) public AddressRegistry(_tokenAddr, _plcrAddr, _paramsAddr) {
      
  }

  // --------------------
  // PUBLISHER INTERFACE:
  // --------------------

  /**
  @dev                Allows a user to start an application. Takes tokens from user and sets
                      apply stage end time.
  @param _amount      The number of ERC20 tokens a user is willing to potentially stake
  */
  function apply(address _listingAddress, uint _amount, string _data) onlyContract(_listingAddress) public {
    super.apply(_listingAddress, _amount, _data);
  }
}
