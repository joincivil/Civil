import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: isWhitelisted", () => {
    const [JAB, applicant, challenger, voter] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    let voting: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);

      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should whitelist if original challenge fails, appeal granted, appeal challenge succeeds", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 420, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });

      await utils.advanceEvmTime(
        utils.paramConfig.appealChallengeCommitStageLength + utils.paramConfig.appealChallengeRevealStageLength + 1,
      );

      await registry.updateStatus(newsroomAddress);

      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with failed challenge if appeal granted and appeal challenge succeeds",
      );
    });

    it("should not whitelist if original challenge succeeds, appeal granted, appeal challenge succeeds", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });

      await utils.advanceEvmTime(
        utils.paramConfig.appealChallengeCommitStageLength + utils.paramConfig.appealChallengeRevealStageLength + 1,
      );

      await registry.updateStatus(newsroomAddress);

      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with successful challenge if appeal granted and appeal challenge fails",
      );
    });

    it("should not whitelist if original challenge fails, appeal granted, appeal challenge fails", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 420, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      // await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });
      const appealPollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, appealPollID, "1", "10", "520", voter);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealPollID, "1", "520", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with failed challenge if appeal granted and appeal challenge fails",
      );
    });

    it("should whitelist if original challenge succeeds, appeal granted, appeal challenge fails", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const appealPollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, appealPollID, "1", "10", "520", voter);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealPollID, 1, 520, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with successful challenge if appeal granted and appeal challenge fails",
      );
    });
  });
});
