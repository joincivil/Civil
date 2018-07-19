import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

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
      await expect(registry.challengeCanBeResolved(newsroomAddress)).to.eventually.be.false();
    });

    it(
      "should return true if challenge request appeal expires, the challenge is " +
        "unresolved, and appeal not requested",
      async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });

        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength);
        await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);

        const result = await registry.challengeCanBeResolved(newsroomAddress);
        await expect(result).to.be.true("Should return true if challenge request appeal expires");
      },
    );
  });
});
