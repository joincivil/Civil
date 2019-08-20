import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";
// import { REVERTED_CALL } from "../../utils/constants";

configureChai(chai);
const expect = chai.expect;
const ZERO_DATA = "0x";

contract("Registry With Appeals", accounts => {
  describe("Function: challengeCanBeResolved", () => {
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

    it("should return false if challenge doesn't exist", async () => {
      // web3.eth
      //   .call({
      //     to: registry.address,
      //     data: registry.contract.methods.challengeCanBeResolved(newsroomAddress).encodeABI(),
      //   })
      //   .then((res: any) => {
      //     console.log("result: ", res);
      //   });
      // TODO(dankins): boolean calls that revert are still returning true, is this a web3 bug?
      // await expect(registry.challengeCanBeResolved(newsroomAddress)).to.eventually.be.rejectedWith(REVERTED_CALL);
    });

    it("should return false if listings exists but challenge doesn't", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      // TODO(dankins): boolean calls that revert are still returning true, is this a web3 bug?
      // await expect(registry.challengeCanBeResolved(newsroomAddress)).to.eventually.be.rejectedWith(REVERTED_CALL);
    });

    it("should return false after challenge is resolved", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);
      await registry.updateStatus(newsroomAddress, { from: applicant });
      // const result = registry.challengeCanBeResolved(newsroomAddress);
      // TODO(dankins): boolean calls that revert are still returning true, is this a web3 bug?
      // expect(result).to.eventually.be.rejectedWith(REVERTED_CALL);
    });

    it("should return false immediately after challenge is appealed", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: challenger });

      const result = await registry.challengeCanBeResolved(newsroomAddress);
      await expect(result).to.be.false("Should return false immediately after challenge is appealed");
    });

    it("should return false after challenge is appealed and judge appeal phase ends (have to resolve appeal, not challenge)", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength);

      const result = await registry.challengeCanBeResolved(newsroomAddress);
      await expect(result).to.be.false(
        "Should return false after challenge is appealed and appeal phase ends (have to resolve appeal, not challenge)",
      );
    });

    it("should return false immediately after challenge is appealed and granted", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      const result = await registry.challengeCanBeResolved(newsroomAddress);
      await expect(result).to.be.false(
        "Should return false immdiately after challenge is appealed and appeal granted (have to resolve appeal, not challenge)",
      );
    });

    it("should return false  after challenge is appealed and granted", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      const result = await registry.challengeCanBeResolved(newsroomAddress);
      await expect(result).to.be.false(
        "Should return false after challenge is appealed and appeal phase ends (have to resolve appeal, not challenge)",
      );
    });

    it("should return false  after challenge is appealed and granted and challenge appeal phase is over", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 1);
      const result = await registry.challengeCanBeResolved(newsroomAddress);
      await expect(result).to.be.false(
        "Should return false after challenge is appealed and granted and challenge appeal phase ends",
      );
    });

    it("should return false immediately after challenge is appealed and granted and the appeal is challenged", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await registry.challengeGrantedAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      const result = await registry.challengeCanBeResolved(newsroomAddress);
      await expect(result).to.be.false(
        "Should return false immediately after challenge is appealed and granted and appeal is challenged",
      );
    });

    it("should return false after challenge is appealed and granted and the appeal is challenged and appeal challenge is over", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
      await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await registry.challengeGrantedAppeal(newsroomAddress, ZERO_DATA, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);
      const result = await registry.challengeCanBeResolved(newsroomAddress);
      await expect(result).to.be.false(
        "Should return false after challenge is appealed and granted and appeal is challenged and appeal challenge is over",
      );
    });

    it(
      "should return true if challenge request appeal expires, the challenge is " +
        "unresolved, and appeal not requested",
      async () => {
        await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });
        await registry.challenge(newsroomAddress, ZERO_DATA, { from: challenger });

        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength);
        await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);

        const result = await registry.challengeCanBeResolved(newsroomAddress);
        await expect(result).to.be.true("Should return true if challenge request appeal expires");
      },
    );
  });
});
