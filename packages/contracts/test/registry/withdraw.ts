import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
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

    it("should not withdraw tokens from a listing that has a deposit === minDeposit", async () => {
      const errMsg = "applicant was able to withdraw tokens";

      await utils.addToWhitelist(dontChallengeListing, minDeposit, applicant, registry);
      const origDeposit = await utils.getUnstakedDeposit(dontChallengeListing, registry);

      await expect(registry.withdraw(dontChallengeListing, withdrawAmount, { from: applicant }))
      .to.eventually.be.rejectedWith(REVERTED);

      const afterWithdrawDeposit = await utils.getUnstakedDeposit(dontChallengeListing, registry);

      expect(afterWithdrawDeposit).to.be.bignumber.equal(origDeposit, errMsg);
    });

    it("should not withdraw tokens from a listing that is locked in a challenge", async () => {
      // Whitelist, then challenge
      await utils.addToWhitelist(listing13, minDeposit, applicant, registry);
      await registry.challenge(listing13, "", { from: challenger });

      // Attempt to withdraw; should fail
      await expect(registry.withdraw(listing13, withdrawAmount, { from: applicant }))
      .to.eventually.be.rejectedWith(REVERTED,
        "Applicant should not have been able to withdraw from a challenged, locked listing");
      // TODO: check balance
      // TODO: apply, gets challenged, and then minDeposit lowers during challenge.
      // still shouldn"t be able to withdraw anything.
      // when challenge ends, should be able to withdraw origDeposit - new minDeposit
    });
  });
});
