pragma solidity ^0.4.23;

interface TokenSaleI {
  function unitContributions(address buyer) external view returns (uint256);
  function saleTokensPerUnit() external view returns (uint256);
}
