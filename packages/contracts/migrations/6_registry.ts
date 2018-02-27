/* global artifacts */

import { config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const AddressRegistry = artifacts.require("AddressRegistry.sol");
const Token = artifacts.require("EIP20.sol");
const Parameterizer = artifacts.require("Parameterizer.sol");
const DLL = artifacts.require("dll/DLL.sol");
const AttributeStore = artifacts.require("attrstore/AttributeStore.sol");
const PLCRVoting = artifacts.require("PLCRVoting.sol");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  async function approveRegistryFor(addresses: string[]): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(AddressRegistry.address, balanceOfUser, { from: user });
    if (addresses.length === 1) { return true; }
    return approveRegistryFor(addresses.slice(1));
  }

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
      await approveRegistryFor(accounts);
    }
  });
};
