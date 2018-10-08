pragma solidity ^0.4.24;

contract ContributionProxyI {
  uint256 public tokensPerUnit;

  function tokensBought(address _contributor) external view returns(uint256);
  function close() external;
  function recordCardPayments(address[] _contributors, uint256[] _amounts) external;
}
