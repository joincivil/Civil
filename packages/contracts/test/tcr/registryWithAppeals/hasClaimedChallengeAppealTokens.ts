import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("Function: hasClaimedChallengeAppealTokens", () => {
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

    it("should be false every time we check until appeal challenge reward is claimed", async () => {
      // Apply
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "1", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "1", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const appealChallengePollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengePollID, "1", "500", "1337", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);

      await voting.revealVote(appealChallengePollID, "1", "1337", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      const hasClaimedBefore = await registry.hasClaimedTokens(appealChallengePollID, voterBob);
      expect(hasClaimedBefore).to.be.false("hasClaimedTokens should have been false for unclaimed reward 2");

      await registry.claimReward(appealChallengePollID, "1337", { from: voterBob });

      const hasClaimedAfter = await registry.hasClaimedTokens(appealChallengePollID, voterBob);
      expect(hasClaimedAfter).to.be.true(
        "hasClaimedTokens should have been true for voter than has claimed challenge reward",
      );
    });
  });
});
