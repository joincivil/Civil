/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { RINKEBY } from "./utils/consts";

const Token = artifacts.require("EIP20");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

const TokenTelemetry = artifacts.require("TokenTelemetry");
const PLCRVoting = artifacts.require("CivilPLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    console.log("plcr");
    await deployer.link(DLL, PLCRVoting);
    await deployer.link(AttributeStore, PLCRVoting);

    let tokenAddress;
    if (network === RINKEBY) {
      tokenAddress = config.nets[network].TokenAddress;
    } else {
      tokenAddress = Token.address;
    }
    await deployer.deploy(PLCRVoting, tokenAddress, TokenTelemetry.address);

    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), PLCRVoting.address);
    }
  });
};
