/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { RINKEBY } from "./utils/consts";

const Token = artifacts.require("EIP20");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

const PLCRVoting = artifacts.require("PLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, PLCRVoting);
    await deployer.link(AttributeStore, PLCRVoting);

    let tokenAddress = Token.address;

    if (network === RINKEBY) {
      tokenAddress = config.rinkebyTokenAddress;
    }

    await deployer.deploy(PLCRVoting, tokenAddress);

    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), PLCRVoting.address);
    }
  });
};
