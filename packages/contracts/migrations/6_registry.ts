/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("EIP20.sol");
const DLL = artifacts.require("dll/DLL.sol");
const AttributeStore = artifacts.require("attrstore/AttributeStore.sol");

const CivilTCR = artifacts.require("CivilTCR");
const Parameterizer = artifacts.require("Parameterizer");
const PLCRVoting = artifacts.require("PLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, CivilTCR);
    await deployer.link(AttributeStore, CivilTCR);

    let tokenAddress = config.TokenAddress;

    if (network !== MAIN_NETWORK) {
      tokenAddress = Token.address;
    }
    await deployer.deploy(CivilTCR, tokenAddress, PLCRVoting.address, Parameterizer.address, accounts[0], accounts[0]);
    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), CivilTCR.address);
    }
  });
};
