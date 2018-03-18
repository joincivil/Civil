/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("EIP20.sol");
const DLL = artifacts.require("dll/DLL.sol");
const AttributeStore = artifacts.require("attrstore/AttributeStore.sol");

const AddressRegistry = artifacts.require("tcr/AddressRegistry.sol");
const Parameterizer = artifacts.require("tcr/Parameterizer.sol");
const PLCRVoting = artifacts.require("tcr/PLCRVoting.sol");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, AddressRegistry);
    await deployer.link(AttributeStore, AddressRegistry);

    let tokenAddress = config.TokenAddress;

    if (network !== MAIN_NETWORK) {
      tokenAddress = Token.address;
    }

    await deployer.deploy(
      AddressRegistry,
      tokenAddress,
      PLCRVoting.address,
      Parameterizer.address,
    );
    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), AddressRegistry.address);
    }
  });
};
