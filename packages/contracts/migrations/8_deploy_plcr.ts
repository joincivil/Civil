/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("EIP20");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

const UserGroups = artifacts.require("UserGroups");
const PLCRVoting = artifacts.require("CivilPLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, PLCRVoting);
    await deployer.link(AttributeStore, PLCRVoting);

    let tokenAddress;
    if (network === MAIN_NETWORK) {
      tokenAddress = config.nets[network].TokenAddress;
    } else {
      tokenAddress = Token.address;
    }
    await deployer.deploy(PLCRVoting, tokenAddress, UserGroups.address);

    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), PLCRVoting.address);
    }
  });
};
