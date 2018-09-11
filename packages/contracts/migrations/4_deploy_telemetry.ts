/* global artifacts */
const TokenTelemetry = artifacts.require("TokenTelemetry");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.deploy(TokenTelemetry);
  });
};
