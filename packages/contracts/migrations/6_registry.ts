/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const OwnedAddressTCRWithAppeals = artifacts.require("OwnedAddressTCRWithAppeals.sol");
const Token = artifacts.require("EIP20.sol");
const Parameterizer = artifacts.require("Parameterizer.sol");
const DLL = artifacts.require("dll/DLL.sol");
const AttributeStore = artifacts.require("attrstore/AttributeStore.sol");
const PLCRVoting = artifacts.require("PLCRVoting.sol");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, OwnedAddressTCRWithAppeals);
    await deployer.link(AttributeStore, OwnedAddressTCRWithAppeals);

    let tokenAddress = config.TokenAddress;

    if (network !== MAIN_NETWORK) {
      tokenAddress = Token.address;
    }
    await deployer.deploy(
      OwnedAddressTCRWithAppeals,
      tokenAddress,
      PLCRVoting.address,
      Parameterizer.address,
      accounts[0],
      accounts[0],
    );
    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), OwnedAddressTCRWithAppeals.address);
    }
  });
};
