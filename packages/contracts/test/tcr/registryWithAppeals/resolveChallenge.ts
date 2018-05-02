import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";
import { REVERTED } from "../../utils/constants";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: resolveChallenge", () => {
    const [JAB, applicant, challenger] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should fail if apply stage in progress without a challenge", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      expect(registry.resolveChallenge(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to resolve challenge on application without challenge",
      );
    });

    it("should succeed if request appeal is over without one requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength);

      await expect(registry.resolveChallenge(newsroomAddress)).to.eventually.be.fulfilled(
        "should not have been able to resolve appeal on completed challenge with no appeal requested",
      );
    });

    it("should fail if request appeal is over and one is requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });

      await expect(registry.resolveChallenge(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to resolve challenge with appeal requested",
      );
    });

    it("should fail if appeal is requested and that phase ends without one being granted ", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
      await expect(registry.resolveChallenge(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to resolve challenge after appeal judgment phase ends",
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

      await expect(registry.resolveChallenge(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to resolve challenge after appeal challenge",
      );
    });

    it("should fail if appealChallenge is in progress", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });

      await expect(registry.resolveChallenge(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to resolve challenge with appeal challenged in progress",
      );
    });
  });
});
