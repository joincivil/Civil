import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");

configureChai(chai);
const expect = chai.expect;

contract("PLCRVoting", accounts => {
  describe("Function: didReveal", () => {
    const [proposer, challenger, voterAlice] = accounts;
    let parameterizer: any;
    let voting: any;

    beforeEach(async () => {
      parameterizer = await utils.createAllTestParameterizerInstance(accounts);
      const votingAddress = await parameterizer.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should revert if poll does not exists.", async () => {
      await expect(voting.didReveal(voterAlice, 123)).to.eventually.be.rejectedWith(
        REVERTED,
        "should have reverted if poll did not exist",
      );
    });

    it("should return false before vote committed", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);
      const didReveal = await voting.didReveal(voterAlice, challengeID);
      expect(didReveal).to.be.false("didCommit should have returned false before vote committed");
    });

    it("should return true after vote committed", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      const didReveal = await voting.didReveal(voterAlice, challengeID);
      expect(didReveal).to.be.true("didReveal should have returned true after vote committed");
    });
  });
});
