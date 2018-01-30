import * as fs from "fs";

/* global artifacts */

const AddressRegistry = artifacts.require("AddressRegistry.sol");
const Token = artifacts.require("EIP20.sol");
const Parameterizer = artifacts.require("Parameterizer.sol");
const DLL = artifacts.require("dll/DLL.sol");
const AttributeStore = artifacts.require("attrstore/AttributeStore.sol");
const PLCRVoting = artifacts.require("PLCRVoting.sol");

module.exports = (deployer: any, network: any, accounts: string[]) => {
  async function approveRegistryFor(addresses: string[]): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(AddressRegistry.address, balanceOfUser, { from: user });
    if (addresses.length === 1) { return true; }
    return approveRegistryFor(addresses.slice(1));
  }

  deployer.link(DLL, AddressRegistry);
  deployer.link(AttributeStore, AddressRegistry);

  return deployer.then(async () => {
    const config = JSON.parse(
      fs.readFileSync("./conf/config.json")
      .toString());
    let tokenAddress = config.TokenAddress;

    if (network !== "mainnet") {
      tokenAddress = Token.address;
    }

    return deployer.deploy(
      AddressRegistry,
      tokenAddress,
      PLCRVoting.address,
      Parameterizer.address,
    );
  })
  .then(async () => {
    if (network === "test") {
      await approveRegistryFor(accounts);
    }
  })
  .catch((err: any) => {
    throw err;
  });
};
