import { config } from "./utils";
const Government = artifacts.require("Government");
const Token = artifacts.require("EIP20");
const PLCRVoting = artifacts.require("CivilPLCRVoting");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  deployer.then(async () => {
    let appellate = accounts[0];
    let govtController = accounts[0];

    if (config.nets[network]) {
      if (config.nets[network].AppellateAddress) {
        appellate = config.nets[network].AppellateAddress;
      }

      if (config.nets[network].GovernmentControllerAddress) {
        govtController = config.nets[network].GovernmentControllerAddress;
      }
    }

    const parameterizerConfig = config.paramDefaults;
    // const estimate = web3.eth.estimateGas({ data: Government.bytecode });
    // console.log("Government gas cost estimate: " + estimate);

    await deployer.deploy(
      Government,
      appellate,
      govtController,
      Token.address,
      PLCRVoting.address,
      parameterizerConfig.appealFeeAmount,
      parameterizerConfig.requestAppealPhaseLength,
      parameterizerConfig.judgeAppealPhaseLength,
      parameterizerConfig.appealSupermajorityPercentage,
      parameterizerConfig.govtPDeposit,
      parameterizerConfig.govtPCommitStageLength,
      parameterizerConfig.govtPRevealStageLength,
      web3.sha3("Constitution: Be Bad."),
      "http://madeupURL.com",
    );
  });
};
