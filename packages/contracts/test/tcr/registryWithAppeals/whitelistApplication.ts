import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";
import { REVERTED } from "../../utils/constants";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: whitelistApplication", () => {
    const [JAB, applicant, challenger, voter] = accounts;
    let registry: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should whitelist listing if apply stage ended without a challenge", async () => {
      // note: this function calls registry.whitelistApplication at the end
      await utils.addToWhitelist(newsroomAddress, utils.paramConfig.minDeposit, applicant, registry);

      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true("Listing should have been whitelisted");
    });

    it("should fail if challenge is in progress", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application with challenge in progress",
      );
    });

    it("should fail if request appeal is over without one requested on challenge with no votes", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength);

      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application after challenge",
      );
    });

    it("should fail if request appeal is over without one requested on challenge with only YES votes", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "520", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 520, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength);

      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application after challenge",
      );
    });

    it("should fail if request appeal is over without one requested with only NO votes", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, pollID, "0", "10", "520", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 0, 520, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength);

      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application after challenge",
      );
    });

    it("should fail if request appeal is over and one is requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "520", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 520, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });

      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application with appeal requested",
      );
    });

    it("should fail if appeal is requested and that phase ends without one being granted ", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application with appeal requested even if judge appeal phase is over",
      );
    });

    it("should fail if appealChallenge is over", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });

      await utils.advanceEvmTime(
        utils.paramConfig.appealChallengeCommitStageLength + utils.paramConfig.appealChallengeRevealStageLength + 1,
      );

      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application after appeal challenge",
      );
    });

    it("should fail if appealChallenge is still in progress", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });

      await expect(registry.whitelistApplication(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to whitelist application with appeal challenge in progress",
      );
    });
  });
});
