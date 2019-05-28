import { config } from "./utils";
const DelegateFactory = artifacts.require("DelegateFactory");
const PLCRVoting = artifacts.require("CivilPLCRVoting");
const Token = artifacts.require("CVLToken");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    console.log("deploying delegate factory");

    await deployer.deploy(DelegateFactory, Token, PLCRVoting);
  });
};
