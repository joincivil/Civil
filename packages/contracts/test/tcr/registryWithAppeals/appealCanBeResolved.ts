import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";
// import { REVERTED_CALL } from "../../utils/constants";

configureChai(chai);
const expect = chai.expect;
const ZERO_DATA = "0x";

contract("Registry With Appeals", accounts => {
  describe("Function: appealCanBeResolved", () => {
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
      // TODO(dankins): boolean calls that revert are still returning true, is this a web3 bug?
      // await expect(registry.appealCanBeResolved(newsroomAddress)).to.eventually.be.rejectedWith(REVERTED_CALL);
    });

    it("should return false if appeal not requested on challenge", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false("Should return false if appeal not requested on challenge");
    });

    it("should return false if appeal not granted and appeal phase has not expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
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

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.true("Should return true if appeal not granted and appeal phase has expired");
    });

    it("should return false if appeal granted and appeal open challenge phase not expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal granted and appeal open challenge phase not expired",
      );
    });

    it("should return false if appeal granted and challenged", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await registry.challengeGrantedAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal granted and appeal open challenge phase not expired",
      );
    });

    it("should return false if appeal granted and challenged even if we wait until can be challenged phase would have ended", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await registry.challengeGrantedAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 100);
      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal granted and appeal open challenge phase not expired",
      );
    });

    it("should return true if appeal granted and appeal open challenge phase expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 100);

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.true(
        "Should return true if appeal granted and appeal open challenge phase expired",
      );
    });
  });
});
