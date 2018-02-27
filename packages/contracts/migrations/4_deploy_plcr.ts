/* global artifacts */

import { config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("EIP20.sol");
const DLL = artifacts.require("dll/DLL.sol");
const AttributeStore = artifacts.require("attrstore/AttributeStore.sol");
const PLCRVoting = artifacts.require("PLCRVoting.sol");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  async function approvePLCRFor(addresses: string[]): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(PLCRVoting.address, balanceOfUser, { from: user });
    if (addresses.length === 1) { return true; }
    return approvePLCRFor(addresses.slice(1));
  }

  deployer.then(async () => {
    await deployer.link(DLL, PLCRVoting);
    await deployer.link(AttributeStore, PLCRVoting);

    let tokenAddress = config.TokenAddress;

    if (network !== MAIN_NETWORK) {
      tokenAddress = Token.address;
    }

    await deployer.deploy(
      PLCRVoting,
      tokenAddress,
    );

    if (inTesting(network)) {
      await approvePLCRFor(accounts);
    }
  });
};
