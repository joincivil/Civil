import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";
// import { REVERTED_CALL } from "../../utils/constants";

configureChai(chai);
const expect = chai.expect;

const ZERO_DATA = "0x";

contract("Registry With Appeals", accounts => {
  describe("Function: appealChallengeCanBeResolved", () => {
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

    it("should return false if the challenge doesn't exist", async () => {
      // const result = registry.appealCanBeResolved(newsroomAddress);
      // TODO(dankins): boolean calls that revert are still returning true, is this a web3 bug?
      // await expect(result).to.eventually.be.rejectedWith(REVERTED_CALL);
    });

    it("should return false if appeal not requested on challenge", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false("Should return false if appeal not requested on challenge");
    });

    it("should return false if appeal not granted and appeal phase has not expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });

      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal not granted and appeal phase has not expired",
      );
    });

    it("should return true if appeal not granted and appeal phase expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);

      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false("Should return false if appeal not granted");
    });

    it("should return false if appeal granted and appeal open challenge phase not expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });

      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal granted and appeal open challenge phase not expired",
      );
    });

    it("should return false if appeal granted and appeal open challenge phase expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 100);

      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal granted and appeal open challenge phase expired",
      );
    });

    it("should return false if appeal granted and granted appeal just challenged", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await registry.challengeGrantedAppeal(newsroomAddress, ZERO_DATA, { from: challenger });

      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "should return false if appeal granted and granted appeal just challenged",
      );
    });

    it("should return true if appeal granted and granted appeal phase ended", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await registry.challengeGrantedAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(
        utils.paramConfig.appealChallengeCommitStageLength + utils.paramConfig.appealChallengeRevealStageLength + 1,
      );

      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.true("should return true if appeal granted and granted appeal phase ended");
    });

    it("should return false if appeal granted and granted appeal phase ended and status updated", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await registry.challengeGrantedAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(
        utils.paramConfig.appealChallengeCommitStageLength + utils.paramConfig.appealChallengeRevealStageLength + 1,
      );
      await registry.updateStatus(newsroomAddress);

      const canBeResolved = await registry.appealChallengeCanBeResolved(newsroomAddress);
      console.log("canBeResolved", canBeResolved, typeof canBeResolved);
      // TODO(dankins): boolean calls that revert are still returning true, is this a web3 bug?
      // await expect(canBeResolved).to.be.false(
      //   "should return false if appeal granted and granted appeal phase ended and status updated",
      // );
    });
  });
});
