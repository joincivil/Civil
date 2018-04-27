import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: appealCanBeResolved", () => {
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

    it("should fail if challenge doesn't exist", async () => {
      await expect(registry.appealCanBeResolved(newsroomAddress)).to.eventually.be.rejectedWith(
        REVERTED,
        "Should fail if a challenge doesn't exist",
      );
    });

    it("should return false if appeal not requested on challenge", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false("Should return false if appeal not requested on challenge");
    });

    it("should return false if appeal not granted and appeal phase has not expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal not granted and appeal phase has not expired",
      );
    });

    it("should return true if appeal not granted and appeal phase expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.true("Should return true if appeal not granted and appeal phase has expired");
    });

    it("should return false if appeal granted and appeal open challenge phase not expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.false(
        "Should return false if appeal granted and appeal open challenge phase not expired",
      );
    });

    it("should return true if appeal granted and appeal open challenge phase expired", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 100);

      const canBeResolved = await registry.appealCanBeResolved(newsroomAddress);
      await expect(canBeResolved).to.be.true(
        "Should return true if appeal granted and appeal open challenge phase expired",
      );
    });
  });
});
