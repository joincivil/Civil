/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("EIP20");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

const CivilTCR = artifacts.require("CivilTCR");
const Parameterizer = artifacts.require("Parameterizer");
const PLCRVoting = artifacts.require("PLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, CivilTCR);
    await deployer.link(AttributeStore, CivilTCR);

    const parameterizerConfig = config.paramDefaults;
    let tokenAddress = config.TokenAddress;

    if (network !== MAIN_NETWORK) {
      tokenAddress = Token.address;
    }
    await deployer.deploy(
      CivilTCR,
      tokenAddress,
      PLCRVoting.address,
      Parameterizer.address,
      accounts[0],
      parameterizerConfig.appealFeeAmount,
      parameterizerConfig.requestAppealPhaseLength,
      parameterizerConfig.judgeAppealPhaseLength,
    );
    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), CivilTCR.address);
    }
  });
};
