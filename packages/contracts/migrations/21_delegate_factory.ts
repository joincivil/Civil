import { config } from "./utils";
const DelegateFactory = artifacts.require("DelegateFactory");
const PLCRVoting = artifacts.require("CivilPLCRVoting");
const Token = artifacts.require("CVLToken");
// const CivilTokenController = artifacts.require("CivilTokenController");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    // console.log("deploying delegate factory");
    // console.log("Token.address: ", Token.address);
    const token = Token.at("0x3e39fa983abcd349d95aed608e798817397cf0d1");
    const voting = PLCRVoting.at("0x570bf68d286dd4225e2e77384c08dfebc4b01b5c");
    // console.log("token: ", token);
    // console.log("voting: ", voting);
    await deployer.deploy(
      DelegateFactory,
      "0x3e39fa983abcd349d95aed608e798817397cf0d1",
      "0x570bf68d286dd4225e2e77384c08dfebc4b01b5c",
      "0xdad6d7ea1e43f8492a78bab8bb0d45a889ed6ac3",
    );
  });
};
