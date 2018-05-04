import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");

configureChai(chai);
const expect = chai.expect;

contract("PLCRVoting", accounts => {
  describe("Function: commitVote", () => {
    const [proposer, challenger, voterAlice] = accounts;
    const unapproved = accounts[9];
    let parameterizer: any;
    let voting: any;

    beforeEach(async () => {
      parameterizer = await utils.createAllTestParameterizerInstance(accounts);
      const votingAddress = await parameterizer.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should revert if poll does not exists.", async () => {
      await expect(utils.commitVote(voting, "1", "1", "500", "123", voterAlice)).to.eventually.be.rejectedWith(
        REVERTED,
        "should have reverted if poll did not exist",
      );
    });

    it("should revert if pollID = 0.", async () => {
      await expect(utils.commitVote(voting, "0", "1", "500", "123", voterAlice)).to.eventually.be.rejectedWith(
        REVERTED,
        "should have reverted if pollID = 0",
      );
    });

    it("should succeed first time during vote commit stage", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await expect(utils.commitVote(voting, challengeID, "1", "500", "123", voterAlice)).to.eventually.be.fulfilled(
        "should have allowed user to commit vote during commit vote stage",
      );
    });

    it("should fail if user has not deposited tokens into voting contract", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await expect(utils.commitVote(voting, challengeID, "1", "500", "123", unapproved)).to.eventually.be.fulfilled(
        "should have allowed user to commit vote during commit vote stage",
      );
    });

    it("should revert after commit vote stage", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);
      await expect(utils.commitVote(voting, challengeID, "1", "500", "123", voterAlice)).to.eventually.be.rejectedWith(
        REVERTED,
        "should have reverted after commit vote stage",
      );
    });
  });
});
