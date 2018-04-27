/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { RINKEBY } from "./utils/consts";

const Token = artifacts.require("EIP20");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

const CivilTCR = artifacts.require("CivilTCR");
const Parameterizer = artifacts.require("Parameterizer");
const PLCRVoting = artifacts.require("PLCRVoting");
const Government = artifacts.require("Government");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, CivilTCR);
    await deployer.link(AttributeStore, CivilTCR);

    let tokenAddress;
    if (network === RINKEBY) {
      tokenAddress = config.nets[network].TokenAddress;
    } else {
      tokenAddress = Token.address;
    }

    console.log("governmentAddress: " + Government.address);
    const government = await Government.deployed();
    const appellateAddress = await government.appellate();
    console.log("appellateAddress: " + appellateAddress);

    const estimate = web3.eth.estimateGas({ data: CivilTCR.bytecode });
    console.log("CivilTCR gas cost estimate: " + estimate);

    await deployer.deploy(CivilTCR, tokenAddress, PLCRVoting.address, Parameterizer.address, Government.address);
    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), CivilTCR.address);
    }
  });
};
