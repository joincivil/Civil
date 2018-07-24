import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");

configureChai(chai);
const expect = chai.expect;

contract("Registry with Appeals", accounts => {
  describe("Function: claimAppealChallengeReward", () => {
    const [JAB, applicant, challenger, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);

      testNewsroom = await utils.createDummyNewsrom(applicant);
      newsroomAddress = testNewsroom.address;
    });

    it("should transfer the correct number of tokens once an appeal challenge has been resolved", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });

      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      const appealChallengePollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengePollID, "1", "500", "1337", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengePollID, "1", "1337", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      await expect(registry.claimReward(appealChallengePollID, "1337", { from: voterBob })).to.eventually.be.fulfilled(
        "should have allowed voter in appeal challenge poll to claim reward after appeal challenge resolved",
      );
    });

    it("should revert if appeal challenge does not exist", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      const nonPollID = "666";
      await expect(registry.claimReward(nonPollID, "420", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
      );
    });
  });
});
