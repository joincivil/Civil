pragma solidity ^0.4.23;

interface TokenSaleI {
  function unitContributions(address buyer) external returns (uint256);
  function saleTokensPerUnit() external returns (uint256);
}
