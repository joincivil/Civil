/* global artifacts */
import { approveEverything, config, inTesting } from "./utils";
import { BN } from "bn.js";

const Token = artifacts.require("CVLToken");
const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

const Parameterizer = artifacts.require("CivilParameterizer");
const PLCRVoting = artifacts.require("CivilPLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    await deployer.link(DLL, Parameterizer);
    await deployer.link(AttributeStore, Parameterizer);

    const parameterizerConfig = config.nets[network].paramDefaults;
    const tokenAddress = Token.address;

    // const estimate = web3.eth.estimateGas({ data: Parameterizer.bytecode });
    // console.log("Parameterizer gas cost estimate: " + estimate);
    await deployer.deploy(Parameterizer, tokenAddress, PLCRVoting.address, [
      new BN(parameterizerConfig.minDeposit),
      new BN(parameterizerConfig.pMinDeposit),
      new BN(parameterizerConfig.applyStageLength),
      new BN(parameterizerConfig.pApplyStageLength),
      new BN(parameterizerConfig.commitStageLength),
      new BN(parameterizerConfig.pCommitStageLength),
      new BN(parameterizerConfig.revealStageLength),
      new BN(parameterizerConfig.pRevealStageLength),
      new BN(parameterizerConfig.dispensationPct),
      new BN(parameterizerConfig.pDispensationPct),
      new BN(parameterizerConfig.voteQuorum),
      new BN(parameterizerConfig.pVoteQuorum),
      new BN(parameterizerConfig.challengeAppealLength),
      new BN(parameterizerConfig.appealChallengeCommitStageLength),
      new BN(parameterizerConfig.appealChallengeRevealStageLength),
    ]);

    if (inTesting(network)) {
      await approveEverything(accounts, Token.at(tokenAddress), Parameterizer.address);
    }
  });
};
