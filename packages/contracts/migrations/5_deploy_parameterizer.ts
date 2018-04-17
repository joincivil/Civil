/* global artifacts */

import { approveEverything, config, inTesting } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const Token = artifacts.require("EIP20");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

const Parameterizer = artifacts.require("Parameterizer");
const PLCRVoting = artifacts.require("PLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, Parameterizer);
    await deployer.link(AttributeStore, Parameterizer);

    const parameterizerConfig = config.paramDefaults;
    let tokenAddress = config.TokenAddress;

    if (network !== MAIN_NETWORK) {
      tokenAddress = Token.address;
    }

    await deployer.deploy(Parameterizer, tokenAddress, PLCRVoting.address, [
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
      parameterizerConfig.pProcessBy,
      parameterizerConfig.challengeAppealLength,
      parameterizerConfig.appealChallengeCommitStageLength,
      parameterizerConfig.appealChallengeRevealStageLength,
    ]);
    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), Parameterizer.address);
    }
  });
};
