import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Token = artifacts.require("EIP20");
utils.configureProviders(Token);

contract("Registry", accounts => {
  describe("Function: deposit", () => {
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const incAmount = minDeposit.div(utils.toBaseTenBigNumber(2));
    const [applicant, challenger] = accounts;
    const unapproved = accounts[9];

    const listing13 = "0x0000000000000000000000000000000000000013";
    const listing14 = "0x0000000000000000000000000000000000000014";
    const listing15 = "0x0000000000000000000000000000000000000015";
    const listing16 = "0x0000000000000000000000000000000000000016";
    const listing17 = "0x0000000000000000000000000000000000000017";
    let registry: any;
    let token: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const tokenAddress = await registry.token();
      token = await Token.at(tokenAddress);
    });

    it("should increase the deposit for a specific listing in the listing", async () => {
      await utils.addToWhitelist(listing13, minDeposit, applicant, registry);
      await registry.deposit(listing13, incAmount, { from: applicant });

      const [, , , unstakedDeposit] = await registry.listings(listing13);
      const expectedAmount = incAmount.add(minDeposit);
      expect(unstakedDeposit).to.be.bignumber.equal(
        expectedAmount,
        "Unstaked deposit should be equal to the sum of the original + increase amount",
      );
    });

    it("should fail for depositer that has not approved registry as spender of additiona tokens after application", async () => {
      await token.approve(registry.address, minDeposit, { from: unapproved });
      await utils.addToWhitelist(listing17, minDeposit, unapproved, registry);
      await expect(registry.deposit(listing17, incAmount, { from: unapproved })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed listing owner to deposit tokens if they have not approved registry as spender for more than original deposit amount",
      );
    });

    it("should increase a deposit for a pending application", async () => {
      await registry.apply(listing14, minDeposit, "", { from: applicant });

      await registry.deposit(listing14, incAmount, { from: applicant });

      const [, , , unstakedDeposit] = await registry.listings(listing14);
      const expectedAmount = incAmount.add(minDeposit);
      expect(unstakedDeposit).to.be.bignumber.equal(
        expectedAmount,
        "Deposit should have increased for pending application",
      );
    });

    it("should increase deposit for a whitelisted, challenged listing", async () => {
      await utils.addToWhitelist(listing15, minDeposit, applicant, registry);
      const [, , , originalDeposit] = await registry.listings(listing15);

      // challenge, then increase deposit
      await registry.challenge(listing15, "", { from: challenger });
      await registry.deposit(listing15, incAmount, { from: applicant });

      const [, , , afterIncDeposit] = await registry.listings(listing15);

      const expectedAmount = originalDeposit.add(incAmount).sub(minDeposit);

      expect(afterIncDeposit).to.be.bignumber.equal(
        expectedAmount,
        "Deposit should have increased for whitelisted, challenged listing",
      );
    });

    it("should not increase deposit for a listing not owned by the msg.sender", async () => {
      await utils.addToWhitelist(listing16, minDeposit, applicant, registry);

      await expect(registry.deposit(listing16, incAmount, { from: challenger })).to.eventually.be.rejectedWith(
        REVERTED,
        "Deposit should not have increased when sent by the wrong msg.sender",
      );
    });
  });
});
