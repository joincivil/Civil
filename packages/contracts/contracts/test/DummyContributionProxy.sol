pragma solidity ^0.4.24;

import "../proof-of-use/telemetry/ContributionProxyI.sol";

contract DummyContributionProxy is ContributionProxyI {
  mapping(address => uint256) private amounts;

  function tokensBought(address _contributor) external view returns(uint256) {
    return amounts[_contributor];
  }

  function close() external {
    revert("Unsupported in dummy");
  }

  function recordCardPayments(address[] _contributors, uint256[] _amounts) external {
    for (uint256 i = 0; i < _contributors.length; i++) {
      address contributor = _contributors[i];
      uint256 amount = _amounts[i];
      amounts[contributor] = amount;
    }
  }
}
