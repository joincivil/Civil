/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("CVLToken");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");
const CivilTokenController = artifacts.require("CivilTokenController");

const PLCRVoting = artifacts.require("CivilPLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, PLCRVoting);
    await deployer.link(AttributeStore, PLCRVoting);

    const tokenAddress = Token.address;
    await deployer.deploy(PLCRVoting, tokenAddress, CivilTokenController.address);

    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), PLCRVoting.address);
    }
  });
};
