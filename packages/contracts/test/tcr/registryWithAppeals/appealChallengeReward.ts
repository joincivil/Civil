import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: determineAppealChallengeReward", () => {
    const [JAB, applicant, challenger, voter] = accounts;

    let registry: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;

    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should succeed if the challenge been issued and voting has ended with no votes", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const pollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await expect(registry.determineReward(pollID)).to.eventually.be.fulfilled(
        "Should have allowed determineReward to succeed",
      );
      // TODO(PN): Add check to ensure value is returned as expected.
    });

    it("should succeed if the challenge been issued and voting has ended with a few votes", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const pollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(pollID, "1", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await expect(registry.determineReward(pollID)).to.eventually.be.fulfilled(
        "Should have allowed determineReward to succeed",
      );
      // TODO(PN): Add check to ensure value is returned as expected.
    });
  });
});
