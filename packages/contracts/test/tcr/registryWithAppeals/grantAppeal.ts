import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: setAppealFee", () => {
    const [JAB, applicant, challenger, voter] = accounts;

    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
    });

    it("should fail if the fee is == 0", async() => {
      await expect(registry.setAppealFee(0, { from: JAB })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed a fee that is 0",
      );
    });

    it("should succeed in setting the fee if > 0", async() => {
      const dummyFee = 1000;
      await registry.setAppealFee(dummyFee, { from: JAB });
      const newAppealFee = await registry.appealFee();
      await expect(newAppealFee).to.be.bignumber.equal(
        dummyFee,
        "Current appeal fee should be equal to appeal fee set",
      );
    });
  });

  describe("Function: setMakeAppealLength", () => {
    const [JAB, applicant, challenger, voter] = accounts;

    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
    });

    it("should fail if the appeal phase length is == 0", async() => {
      await expect(registry.setMakeAppealLength(0, { from: JAB })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed an appeal phase length that is 0",
      );
    });

    it("should succeed in setting the appeal phase length if > 0", async() => {
      const dummyLength = 1000;
      await registry.setMakeAppealLength(dummyLength, { from: JAB });
      const newMakeAppealLength = await registry.requestAppealPhaseLength();
      await expect(newMakeAppealLength).to.be.bignumber.equal(
        dummyLength,
        "Current request appeal phase len should be equal to appeal phase len set",
      );
    });
  });

  describe("Function: setAppealLength", () => {
    const [JAB, applicant, challenger, voter] = accounts;

    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
    });

    it("should fail if the judge appeal phase length is == 0", async() => {
      await expect(registry.setAppealLength(0, { from: JAB })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed a judge appeal length that is 0",
      );
    });

    it("should succeed in setting the judge appeal phase length if > 0", async() => {
      const dummyLength = 1000;
      await registry.setAppealLength(dummyLength, { from: JAB });
      const newJudgeAppealLength = await registry.judgeAppealPhaseLength();
      await expect(newJudgeAppealLength).to.be.bignumber.equal(
        dummyLength,
        "Current request judge appeal len should be equal to judge appeal len set",
      );
    });
  });

  describe("Function: grantAppeal", () => {
    const [JAB, applicant, challenger, voter] = accounts;

    let registry: any;
    let voting: any;

    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    describe("with real newsroom", async () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
        newsroomAddress = testNewsroom.address;
      });

      it("should fail if no application has been made", async () => {
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on non-existent application",
        );
      });

      it("should fail if application is in progress", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });

        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application in progress",
        );
      });

      it("should fail if challenge is in progress", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with challenge in progress",
        );

        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with challenge in progress",
        );

        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with challenge not yet resolved",
        );
      });

      it("should fail if challenge is lost and status is updated, but appeal not requested", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed appeal on application with failed challenge that has been processed",
        );
      });

      it("should fail if challenge is lost, status is updated, and request phase has ended", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
        // hack. can't read directly from contract for some reason, was causing crash
        await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength);
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with failed challenge that has been processed",
        );
      });

      it("should fail if challenge is won by applicant", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
        await utils.commitVote(voting, pollID, "1", "10", "420", voter);
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
        await voting.revealVote(pollID, 1, 420, { from: voter });
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not allow grant appeal if challenge is won by applicant",
        );
      });

      it("should succeed if challenge is lost and status is updated, and appeal requested", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await expect(registry.grantAppeal(newsroomAddress, { from: JAB })).to.eventually.be.fulfilled(
          "Should not have allowed appeal on application with failed challenge that has been processed",
        );
      });

      it("should fail if not appellate granting appeal", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await expect(registry.grantAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal if not granted from appellate",
        );
      });
    });
  });
});
