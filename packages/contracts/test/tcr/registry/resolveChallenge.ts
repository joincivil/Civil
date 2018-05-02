import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("Function: updateStatus", () => {
    const [applicant, challenger] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const listing21 = "0x0000000000000000000000000000000000000021";
    const listing22 = "0x0000000000000000000000000000000000000022";
    const listing23 = "0x0000000000000000000000000000000000000023";
    const listing24 = "0x0000000000000000000000000000000000000024";
    const listing25 = "0x0000000000000000000000000000000000000025";
    const listing26 = "0x0000000000000000000000000000000000000026";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
    });

    it("should not resolve a challenge for a listing that is still pending an application", async () => {
      await registry.apply(listing22, minDeposit, "", { from: applicant });

      await expect(registry.resolveChallenge(listing22, { from: applicant })).to.be.rejectedWith(
        REVERTED,
        "Listing should not have been whitelisted",
      );
    });

    it("should not resolve a challenge for a listing that is currently being challenged", async () => {
      await registry.apply(listing23, minDeposit, "", { from: applicant });
      await registry.challenge(listing23, "", { from: challenger });

      await expect(registry.resolveChallenge(listing23)).to.eventually.be.rejectedWith(
        REVERTED,
        "Listing should not have been whitelisted",
      );
    });

    it("should resolve a challenge for a listing that failed a challenge", async () => {
      await registry.apply(listing24, minDeposit, "", { from: applicant });
      await registry.challenge(listing24, "", { from: challenger });

      const plcrComplete = utils.paramConfig.revealStageLength + utils.paramConfig.commitStageLength + 1;
      await utils.advanceEvmTime(plcrComplete);

      await expect(registry.resolveChallenge(listing24)).to.eventually.be.fulfilled(
        "Should have been able to resolve challenge on listing with challenge that passed voting phase",
      );
      const [, isWhitelisted] = await registry.listings(listing24);
      expect(isWhitelisted).to.be.false("Listing should not have been whitelisted");
    });

    it("should not be possible to add a listing to the whitelist just by calling resolveChallenge", async () => {
      await expect(registry.resolveChallenge(listing25, { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
        "Listing should not have been whitelisted",
      );
    });

    it(
      "should not be possible to add a listing to the whitelist just " +
        "by calling resolveChallenge after it has been previously removed",
      async () => {
        await utils.addToWhitelist(listing26, minDeposit, applicant, registry);
        const [, resultOne] = await registry.listings(listing26);
        expect(resultOne).to.be.true("Listing should have been whitelisted");

        await registry.exitListing(listing26, { from: applicant });
        const [, resultTwo] = await registry.listings(listing26);
        expect(resultTwo).to.be.false("Listing should not be in the whitelist");

        await expect(registry.resolveChallenge(listing26, { from: applicant })).to.eventually.be.rejectedWith(
          REVERTED,
          "Listing should not have been whitelisted",
        );
      },
    );
  });
});
