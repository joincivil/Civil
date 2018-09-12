import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const PLCRVoting = artifacts.require("CivilPLCRVoting");

contract("Registry With Appeals", accounts => {
  describe("check appeal challenge vote outcomes", () => {
    const [JAB, applicant, challenger, voterTim, voterGregg] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    let voting: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      testNewsroom = await utils.createDummyNewsrom(applicant);
      newsroomAddress = testNewsroom.address;
      const votingAddress = await registry.voting();
      voting = PLCRVoting.at(votingAddress);
    });

    it("should be whitelisted if challenge succeeds, appeal granted, appeal challenge gets less than supermajority", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voterTim);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);
      await registry.updateStatus(newsroomAddress);

      const isWhitelisted = await registry.isWhitelisted(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "should have been whitelisted after successful challenge, granted appeal, failed appeal challenge",
      );
    });

    it("should be whitelisted if challenge succeeds, appeal granted, appeal challenge gets equal votes for and against", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voterTim);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const appealChallengeID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengeID, "1", "100", "420", voterTim);
      await utils.commitVote(voting, appealChallengeID, "0", "100", "420", voterGregg);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengeID, "1", "420", { from: voterTim });
      await voting.revealVote(appealChallengeID, "0", "420", { from: voterGregg });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);
      await registry.updateStatus(newsroomAddress);

      const isWhitelisted = await registry.isWhitelisted(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "should have been whitelisted after successful challenge, granted appeal, failed appeal challenge",
      );
    });

    it("should be whitelisted if challenge succeeds, appeal granted, appeal challenge gets supermajority against", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voterTim);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const appealChallengeID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengeID, "1", "100", "420", voterTim);
      await utils.commitVote(voting, appealChallengeID, "0", "1000", "420", voterGregg);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengeID, "1", "420", { from: voterTim });
      await voting.revealVote(appealChallengeID, "0", "420", { from: voterGregg });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);
      await registry.updateStatus(newsroomAddress);

      const isWhitelisted = await registry.isWhitelisted(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "should have been whitelisted after successful challenge, granted appeal, failed appeal challenge",
      );
    });

    it("should be rejected if challenge succeeds, appeal granted, appeal challenge gets supermajority in favor", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voterTim);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const appealChallengeID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengeID, "1", "1000", "420", voterTim);
      await utils.commitVote(voting, appealChallengeID, "0", "100", "420", voterGregg);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengeID, "1", "420", { from: voterTim });
      await voting.revealVote(appealChallengeID, "0", "420", { from: voterGregg });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);
      await registry.updateStatus(newsroomAddress);

      const isWhitelisted = await registry.isWhitelisted(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "should have been rejected after successful challenge, granted appeal, sucessful appeal challenge",
      );
    });
  });
});
