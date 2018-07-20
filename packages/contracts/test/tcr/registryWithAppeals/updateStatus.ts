import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

contract("Registry With Appeals", accounts => {
  describe("Function: updateStatus", () => {
    const [JAB, applicant, challenger] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      testNewsroom = await utils.createDummyNewsrom(applicant);
      newsroomAddress = testNewsroom.address;
    });

    it("should whitelist listing if apply stage ended without a challenge", async () => {
      // note: this function calls registry.updateStatus at the end
      await utils.addToWhitelist(newsroomAddress, utils.paramConfig.minDeposit, applicant, registry);

      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true("Listing should have been whitelisted");
    });

    it("should succeed if request appeal is over without one requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength);

      await expect(registry.updateStatus(newsroomAddress)).to.eventually.be.fulfilled(
        "should have been able to update status after appeal challenge",
      );

      const [, , , , challengeID] = await registry.listings(newsroomAddress);
      await expect(challengeID).to.be.equal(0, "challengeID should be 0 after successfully updating status");
    });

    it("should fail if request appeal is over and one is requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });

      await expect(registry.updateStatus(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to update status before appeal challenge is over",
      );
    });

    it("should succeed if appeal is requested and that phase ends without one being granted ", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
      await expect(registry.updateStatus(newsroomAddress)).to.eventually.be.fulfilled(
        "should not have been able to update status before appeal challenge is over",
      );

      const [, , , , challengeID] = await registry.listings(newsroomAddress);
      await expect(challengeID).to.be.equal(0, "challengeID should be 0 after successfully updating status");
    });

    it("should succeed if appealChallenge is over", async () => {
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

      await expect(registry.updateStatus(newsroomAddress)).to.eventually.be.fulfilled(
        "should have been able to update status after appeal challenge",
      );

      const [, , , , challengeID] = await registry.listings(newsroomAddress);
      await expect(challengeID).to.be.equal(0, "challengeID should be 0 after successfully updating status");
    });

    it("should fail if appealChallenge is still in progress", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      await registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger });

      await expect(registry.updateStatus(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to update status before appeal challenge is over",
      );
    });
  });
});
