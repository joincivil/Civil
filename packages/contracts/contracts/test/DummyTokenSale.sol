pragma solidity ^0.4.23;

import "../proof-of-use/telemetry/TokenSaleI.sol";

contract DummyTokenSale is TokenSaleI {
  uint256 private _saleTokensPerUnit;
  mapping(address => uint256) private _unitContributions;

  constructor(uint256 _tokensPerUnit) public {
    _saleTokensPerUnit = _tokensPerUnit;
  }

  function saleTokensPerUnit() external view returns (uint256) {
    return _saleTokensPerUnit;
  }

  function unitContributions(address who) external view returns (uint256) {
    return _unitContributions[who];
  }

  function setUnitContributions(address who, uint256 amount) external {
    _unitContributions[who] = amount;
  }
}
