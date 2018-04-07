import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", (accounts) => {
  describe("Function: updateStatus", () => {
    const [JAB, applicant, challenger] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should whitelist listing if apply stage ended without a challenge", async () => {
      // note: this function calls registry.updateStatus at the end
      await utils.addToWhitelist(newsroomAddress, utils.paramConfig.minDeposit, applicant, registry);

      const result = await registry.getListingIsWhitelisted(newsroomAddress);
      expect(result).to.be.true("Listing should have been whitelisted");
    });

    it("should not be able to whitelist listing that has passed challenge, so doesn't need to appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await expect(registry.updateStatus(newsroomAddress)).to.eventually.be.fulfilled(
        "Listing should not have been updated post challenge");

      const result = await registry.getListingIsWhitelisted(newsroomAddress);
      expect(result).to.be.false("Listing should have been whitelisted");
    });

    it("losing a challenge should start the request appeal phase", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });

      const appealPhase1 = await registry.getRequestAppealPhaseExpiry(newsroomAddress);
      expect(appealPhase1).to.be.bignumber.equal(0, "Appeal phase initialized early.");
      await registry.challenge(newsroomAddress, "", { from: challenger });

      const appealPhase2 = await registry.getRequestAppealPhaseExpiry(newsroomAddress);
      expect(appealPhase2).to.be.bignumber.equal(0, "Appeal phase initialized early.");

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await expect(registry.updateStatus(newsroomAddress)).to.eventually.be.fulfilled(
        "Listing should not have been updated post challenge");

      const result = await registry.getListingIsWhitelisted(newsroomAddress);
      expect(result).to.be.false("Listing should not have been whitelisted");

      const appealPhase3 = await registry.getRequestAppealPhaseExpiry(newsroomAddress);
      expect(appealPhase3).to.be.bignumber.greaterThan(0, "Appeal phase not initialized.");
    });

  });
});
