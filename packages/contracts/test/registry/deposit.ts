import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const AddressRegistry = artifacts.require("AddressRegistry");

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: deposit", () => {
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const incAmount = minDeposit.div(utils.toBaseTenBigNumber(2));
    const [applicant, challenger] = accounts;

    const listing13 = "0x0000000000000000000000000000000000000013";
    const listing14 = "0x0000000000000000000000000000000000000014";
    const listing15 = "0x0000000000000000000000000000000000000015";
    const listing16 = "0x0000000000000000000000000000000000000016";
    let registry: any;

    before(async () => {
      registry = await AddressRegistry.deployed();
    });

    it("should increase the deposit for a specific listing in the listing", async () => {
      await utils.addToWhitelist(listing13, minDeposit, applicant, registry);
      await registry.deposit(listing13, incAmount, { from: applicant });

      const unstakedDeposit = await utils.getUnstakedDeposit(listing13, registry);
      const expectedAmount = incAmount.add(minDeposit);
      expect(unstakedDeposit).to.be.bignumber.equal(expectedAmount,
        "Unstaked deposit should be equal to the sum of the original + increase amount",
      );
    });

    it("should increase a deposit for a pending application", async () => {
      await registry.apply(listing14, minDeposit, "", { from: applicant });

      await registry.deposit(listing14, incAmount, { from: applicant });

      const unstakedDeposit = await utils.getUnstakedDeposit(listing14, registry);
      const expectedAmount = incAmount.add(minDeposit);
      expect(unstakedDeposit).to.be.bignumber.equal(expectedAmount,
        "Deposit should have increased for pending application");
    });

    it("should increase deposit for a whitelisted, challenged listing", async () => {
      await utils.addToWhitelist(listing15, minDeposit, applicant, registry);
      const originalDeposit = await utils.getUnstakedDeposit(listing15, registry);

      // challenge, then increase deposit
      await registry.challenge(listing15, "", { from: challenger });
      await registry.deposit(listing15, incAmount, { from: applicant });

      const afterIncDeposit = await utils.getUnstakedDeposit(listing15, registry);

      const expectedAmount = originalDeposit.add(incAmount).sub(minDeposit);

      expect(afterIncDeposit).to.be.bignumber.equal(expectedAmount,
        "Deposit should have increased for whitelisted, challenged listing");
    });

    it("should not increase deposit for a listing not owned by the msg.sender", async () => {
      await utils.addToWhitelist(listing16, minDeposit, applicant, registry);

      await expect(registry.deposit(listing16, incAmount, { from: challenger }))
      .to.eventually.be.rejectedWith(REVERTED, "Deposit should not have increased when sent by the wrong msg.sender");
    });
  });
});
