pragma solidity ^0.4.23;

interface TokenTelemetryI {
  function onRequestVotingRights(address user, uint tokenAmount) external;
}
