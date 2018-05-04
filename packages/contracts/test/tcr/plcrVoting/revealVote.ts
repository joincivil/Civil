import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");

configureChai(chai);
const expect = chai.expect;

contract("PLCRVoting", accounts => {
  describe("Function: revealVote", () => {
    const [proposer, challenger, voterAlice] = accounts;
    let parameterizer: any;
    let voting: any;

    beforeEach(async () => {
      parameterizer = await utils.createAllTestParameterizerInstance(accounts);
      const votingAddress = await parameterizer.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should revert if poll does not exists.", async () => {
      await expect(voting.revealVote("1", "1", "123", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
        "should have reverted if poll did not exist",
      );
    });

    it("should revert before vote committed", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await expect(voting.revealVote(challengeID, "1", "420", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed user to reveal vote before vote committed",
      );
    });

    it("should revert after vote committed but before conclusion of commit vote stage", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await expect(voting.revealVote(challengeID, "1", "420", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed user to reveal vote after vote committed but before commit stage is over",
      );
    });

    it("should allow reveal vote after vote committed but before conclusion of reveal vote stage", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await expect(voting.revealVote(challengeID, "1", "420", { from: voterAlice })).to.eventually.be.fulfilled(
        "should have allowed user to reveal vote after vote committed immediately after commit stage is over",
      );
    });

    it("should revert is salt is incorrect", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await expect(voting.revealVote(challengeID, "1", "420", { from: voterAlice })).to.eventually.be.fulfilled(
        "should have allowed user to reveal vote after vote committed immediately after commit stage is over",
      );
    });

    it("should revert if user has already revealed vote", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
      await expect(voting.revealVote(challengeID, "1", "420", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed user to reveal after vote already revealed",
      );
    });

    it("should revert if reveal stage is over", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await expect(voting.revealVote(challengeID, "1", "420", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed user to reveal after vote reveal stage is over",
      );
    });
  });
});
