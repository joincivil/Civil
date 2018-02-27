/* global artifacts */

import { config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("EIP20.sol");
const Parameterizer = artifacts.require("Parameterizer.sol");
const DLL = artifacts.require("dll/DLL.sol");
const AttributeStore = artifacts.require("attrstore/AttributeStore.sol");
const PLCRVoting = artifacts.require("PLCRVoting.sol");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  async function approveParameterizerFor(addresses: string[]): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(Parameterizer.address, balanceOfUser, { from: user });
    if (addresses.length === 1) { return true; }
    return approveParameterizerFor(addresses.slice(1));
  }

  deployer.then(async () => {
    await deployer.link(DLL, Parameterizer);
    await deployer.link(AttributeStore, Parameterizer);

    const parameterizerConfig = config.paramDefaults;
    let tokenAddress = config.TokenAddress;

    if (network !== MAIN_NETWORK) {
      tokenAddress = Token.address;
    }

    await deployer.deploy(
      Parameterizer,
      tokenAddress,
      PLCRVoting.address,
      parameterizerConfig.minDeposit,
      parameterizerConfig.pMinDeposit,
      parameterizerConfig.applyStageLength,
      parameterizerConfig.pApplyStageLength,
      parameterizerConfig.commitStageLength,
      parameterizerConfig.pCommitStageLength,
      parameterizerConfig.revealStageLength,
      parameterizerConfig.pRevealStageLength,
      parameterizerConfig.dispensationPct,
      parameterizerConfig.pDispensationPct,
      parameterizerConfig.voteQuorum,
      parameterizerConfig.pVoteQuorum,
    );
    if (inTesting(network)) {
      await approveParameterizerFor(accounts);
    }
  });
};
