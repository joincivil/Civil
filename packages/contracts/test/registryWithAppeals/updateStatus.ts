import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");

contract("Registry With Appeals", (accounts) => {
  describe("Function: updateStatus", () => {
    const [JAB, applicant, challenger] = accounts;
    let registry: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
    });

    it("should whitelist listing if apply stage ended without a challenge", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      // note: this function calls registry.updateStatus at the end
      await utils.addToWhitelist(address, utils.paramConfig.minDeposit, applicant, registry);

      const result = await registry.getListingIsWhitelisted(address);
      expect(result).to.be.true("Listing should have been whitelisted");
    });

    it("should not be able to whitelist listing that has passed challenge, so doesn't need to appeal", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await expect(registry.updateStatus(address)).to.eventually.be.fulfilled(
        "Listing should not have been updated post challenge");

      const result = await registry.getListingIsWhitelisted(address);
      expect(result).to.be.false("Listing should have been whitelisted");
    });

    it("losing a challenge should start the request appeal phase", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });

      const appealPhase1 = await registry.getRequestAppealPhaseExpiry(address);
      expect(appealPhase1).to.be.bignumber.equal(0, "Appeal phase initialized early.");
      await registry.challenge(address, "", { from: challenger });

      const appealPhase2 = await registry.getRequestAppealPhaseExpiry(address);
      expect(appealPhase2).to.be.bignumber.equal(0, "Appeal phase initialized early.");

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await expect(registry.updateStatus(address)).to.eventually.be.fulfilled(
        "Listing should not have been updated post challenge");

      const result = await registry.getListingIsWhitelisted(address);
      expect(result).to.be.false("Listing should not have been whitelisted");

      const appealPhase3 = await registry.getRequestAppealPhaseExpiry(address);
      expect(appealPhase3).to.be.bignumber.greaterThan(0, "Appeal phase not initialized.");
    });

  });
});
