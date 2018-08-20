import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";
import { BigNumber } from "bignumber.js";

const Government = artifacts.require("Government");
const PLCRVoting = artifacts.require("PLCRVoting");

utils.configureProviders(Government);
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: proposeReparameterization", () => {
    const [JAB, troll, nobody, voter] = accounts;
    let registry: any;
    let government: any;
    let voting: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
      voting = await PLCRVoting.at(await registry.voting());
    });

    it("should be possible for JAB to propose new judgeAppealLen value", async () => {
      await expect(
        government.proposeReparameterization("judgeAppealLen", 100, { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new judgeAppealLen");
    });

    it("should be possible for JAB to propose new appealVotePercentage value less than or equal to 100", async () => {
      await expect(
        government.proposeReparameterization("appealVotePercentage", 99, { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new judgeAppealLen");
    });

    it("should be possible for JAB to propose new appealVotePercentage value less than or equal to 100", async () => {
      await expect(
        government.proposeReparameterization("appealVotePercentage", 100, { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new judgeAppealLen");
    });

    it("should be possible for JAB to propose new appealVotePercentage value less than or equal to 100", async () => {
      await expect(
        government.proposeReparameterization("appealVotePercentage", 1, { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new judgeAppealLen");
    });

    it("should not be possible for JAB to propose new appealVotePercentage value greater than 100", async () => {
      await expect(
        government.proposeReparameterization("appealVotePercentage", 101, { from: JAB }),
      ).to.eventually.be.rejectedWith(REVERTED, "Should not have allowed JAB to propose new judgeAppealLen");
    });

    it("should not be possible for JAB to propose new appealVotePercentage value greater than 100", async () => {
      await expect(
        government.proposeReparameterization("appealVotePercentage", 10000, { from: JAB }),
      ).to.eventually.be.rejectedWith(REVERTED, "Should not have allowed JAB to propose new judgeAppealLen");
    });

    it("should not be possible for troll to propose new judgeAppealLen value", async () => {
      await expect(
        government.proposeReparameterization("judgeAppealLen", 100, { from: troll }),
      ).to.eventually.be.rejectedWith(REVERTED, "Should not have allowed troll to propose new judgeAppealLen");
    });

    it("should be possible for JAB to propose new judgeAppealLen value again after processing first proposal", async () => {
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

      await expect(
        government.proposeReparameterization("judgeAppealLen", 100, { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new judgeAppealLen");
    });

    it("should be possible for JAB to propose judgeAppealLen same as current value again after processing first proposal", async () => {
      await expect(
        government.proposeReparameterization("judgeAppealLen", utils.paramConfig.judgeAppealPhaseLength, { from: JAB }),
      ).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed JAB to propose new judgeAppealLen same as current value",
      );
    });

    it("should not be possible for JAB to propose new judgeAppealLen value while same proposal currently in progress", async () => {
      await expect(
        government.proposeReparameterization("judgeAppealLen", 100, { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new judgeAppealLen");
      await expect(
        government.proposeReparameterization("judgeAppealLen", 100, { from: JAB }),
      ).to.eventually.be.rejectedWith(REVERTED, "Should have allowed JAB to propose new judgeAppealLen");
    });
  });
});
