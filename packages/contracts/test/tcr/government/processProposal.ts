import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";
import { BigNumber } from "bignumber.js";
import { REVERTED } from "../../utils/constants";
const Government = artifacts.require("Government");
const PLCRVoting = artifacts.require("PLCRVoting");
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: processProposal", () => {
    const [JAB, nobody, voter] = accounts;
    let registry: any;
    let government: any;
    let voting: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
      voting = await PLCRVoting.at(await registry.voting());
    });

    it("processProposal should fail if proposal not active", async () => {
      await expect(government.processProposal("1234", { from: nobody })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to process nonexistent proposal",
      );
    });

    it("processProposal should fail if proposal just begun", async () => {
      const receipt = await government.proposeReparameterization("judgeAppealLen", 100, { from: JAB });
      const { propID } = receipt.logs[0].args;
      await expect(government.processProposal(propID, { from: nobody })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to process nonexistent proposal",
      );
    });

    it("processProposal should fail if proposal vote not over", async () => {
      const receipt = await government.proposeReparameterization("judgeAppealLen", 100, { from: JAB });
      const { propID } = receipt.logs[0].args;
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await expect(government.processProposal(propID, { from: nobody })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to process proposal before vote is over",
      );
    });

    it("processProposal should succeed if proposal vote over", async () => {
      const receipt = await government.proposeReparameterization("judgeAppealLen", 100, { from: JAB });
      const { propID } = receipt.logs[0].args;
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);
      await expect(government.processProposal(propID, { from: nobody })).to.eventually.be.fulfilled(
        "should have been able to process proposal after vote is over",
      );
    });

    it("judgeAppealLength should be new value after processing successful proposal", async () => {
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

    it("judgeAppealLength should be old value after processing unsuccessful proposal", async () => {
      const receipt = await government.proposeReparameterization("judgeAppealLen", 100, { from: JAB });

      const { propID, pollID } = receipt.logs[0].args;
      await utils.commitVote(voting, pollID, "0", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await voting.revealVote(pollID, "0", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);
      await government.processProposal(propID, { from: nobody });
      const judgeAppealLength = await government.get("judgeAppealLen");
      expect(judgeAppealLength).to.be.bignumber.equal(
        new BigNumber(utils.paramConfig.judgeAppealPhaseLength),
        "judgeAppealLen was not equal to value it was set to",
      );
    });
  });
});
