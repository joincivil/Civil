pragma solidity ^0.4.23;

import "../proof-of-use/telemetry/TokenTelemetryI.sol";

contract DummyTokenTelemetry is TokenTelemetryI {
  function onTokensUsed(address user, uint tokenAmount) external {

  }
}
