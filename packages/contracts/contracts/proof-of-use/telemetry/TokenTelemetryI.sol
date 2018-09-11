pragma solidity ^0.4.23;

interface TokenTelemetryI {
  function onTokensUsed(address user, uint tokenAmount) external;
}
