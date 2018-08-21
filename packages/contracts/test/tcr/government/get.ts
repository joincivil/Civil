import { configureChai } from "@joincivil/dev-utils";
import { BigNumber } from "bignumber.js";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const Government = artifacts.require("Government");
const PLCRVoting = artifacts.require("PLCRVoting");
utils.configureProviders(Government);

configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: get", () => {
    const [JAB, nobody, voter] = accounts;
    let registry: any;
    let government: any;
    let voting: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
      voting = await PLCRVoting.at(await registry.voting());
    });

    it("judgeAppealLen value should be same as in config after deployment", async () => {
      const judgeAppealLength = await government.get("judgeAppealLen");
      expect(judgeAppealLength).to.be.bignumber.equal(
        new BigNumber(utils.paramConfig.judgeAppealPhaseLength),
        "judgeAppealLen was not equal to value in config immediately after deployment",
      );
    });

    it("judgeAppealLength should be new value after processing proposal", async () => {
      const receipt = await government.proposeReparameterization("judgeAppealLen", 100, { from: JAB });

      const { propID, pollID } = receipt.logs[0].args;
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await voting.revealVote(pollID, "1", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);
      await government.processProposal(propID, { from: nobody });
      const judgeAppealLength = await government.get("judgeAppealLen");
      expect(judgeAppealLength).to.be.bignumber.equal(
        new BigNumber(100),
        "judgeAppealLen was not equal to value it was set to",
      );
    });
  });
});
