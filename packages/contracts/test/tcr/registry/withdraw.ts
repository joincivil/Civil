import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";
import { BigNumber } from "bignumber.js";

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("Function: withdraw", () => {
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const withdrawAmount = minDeposit.div(utils.toBaseTenBigNumber(2));
    const [applicant, challenger] = accounts;
    const dontChallengeListing = "0x0000000000000000000000000000000000000014";
    const listing13 = "0x00000000000000000000000000000000000000013";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
    });

    it("should be able to withdraw tokens if remaining tokens greater than minDeposit", async () => {
      await utils.addToWhitelist(dontChallengeListing, minDeposit.add(50), applicant, registry);
      await expect(
        registry.withdraw(dontChallengeListing, new BigNumber(40), { from: applicant }),
      ).to.eventually.be.fulfilled(
        "should have allowed listing owner to withdraw tokens if remaing tokens greater than minDeposit",
      );
    });

    it("should be able to withdraw tokens if remaining tokens equal to minDeposit", async () => {
      await utils.addToWhitelist(dontChallengeListing, minDeposit.add(50), applicant, registry);
      await expect(
        registry.withdraw(dontChallengeListing, new BigNumber(50), { from: applicant }),
      ).to.eventually.be.fulfilled(
        "should have allowed listing owner to withdraw tokens if remaing tokens equal to minDeposit",
      );
    });

    it("should not withdraw tokens from a listing that has a deposit === minDeposit", async () => {
      const errMsg = "applicant was able to withdraw tokens";

      await utils.addToWhitelist(dontChallengeListing, minDeposit, applicant, registry);
      const listing = await registry.listings(dontChallengeListing);
      const origDeposit = listing[3];

      await expect(
        registry.withdraw(dontChallengeListing, withdrawAmount, { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);

      const listingAfterWithdraw = await registry.listings(dontChallengeListing);
      const afterWithdrawDeposit = listingAfterWithdraw[3];

      expect(afterWithdrawDeposit).to.be.bignumber.equal(origDeposit, errMsg);
    });

    it("should not withdraw tokens from a listing that is locked in a challenge", async () => {
      // Whitelist, then challenge
      await utils.addToWhitelist(listing13, minDeposit, applicant, registry);
      await registry.challenge(listing13, "", { from: challenger });

      // Attempt to withdraw; should fail
      await expect(registry.withdraw(listing13, withdrawAmount, { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
        "Applicant should not have been able to withdraw from a challenged, locked listing",
      );
      // TODO: check balance
      // TODO: apply, gets challenged, and then minDeposit lowers during challenge.
      // still shouldn"t be able to withdraw anything.
      // when challenge ends, should be able to withdraw origDeposit - new minDeposit
    });

    it("should be able to withdraw unstakedDeposit from a listing that is locked in a challenge", async () => {
      // Whitelist, then challenge
      await utils.addToWhitelist(listing13, minDeposit.mul(2), applicant, registry);
      await registry.challenge(listing13, "", { from: challenger });

      // Attempt to withdraw; should succeed
      await expect(registry.withdraw(listing13, minDeposit, { from: applicant })).to.eventually.be.fulfilled(
        "Applicant should have been able to withdraw unstakedDeposit from a challenged listing",
      );
    });

    it("should not be able to withdraw unstakedDeposit+1 from a listing that is locked in a challenge", async () => {
      // Whitelist, then challenge
      await utils.addToWhitelist(listing13, minDeposit.mul(2), applicant, registry);
      await registry.challenge(listing13, "", { from: challenger });

      // Attempt to withdraw; should succeed
      await expect(registry.withdraw(listing13, minDeposit.add(1), { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
        "Applicant should not have been able to withdraw unstakedDeposit+1 from a challenged listing",
      );
    });

    it("should not withdraw tokens if user making withdrawal is not listing owner", async () => {
      // Whitelist, then challenge
      await utils.addToWhitelist(listing13, minDeposit, applicant, registry);

      // Attempt to withdraw; should fail
      await expect(registry.withdraw(listing13, withdrawAmount, { from: challenger })).to.eventually.be.rejectedWith(
        REVERTED,
        "Non-owner should not have been able to withdraw from a whitelisted listing",
      );
    });
  });
});
