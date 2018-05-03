import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

contract("AddressRegistry", accounts => {
  describe("Function: apply", () => {
    const [applicant] = accounts;
    const unapproved = accounts[9];
    const listing1 = "0x0000000000000000000000000000000000000001";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
    });

    it("should allow a new listing to apply", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant });
      const [applicationExpiry, whitelisted, owner, unstakedDeposit] = await registry.listings(listing1);

      // check that Application is initialized correctly
      expect(applicationExpiry).to.be.bignumber.gt(0, "challenge time < now");
      expect(whitelisted).to.be.false("whitelisted != false");
      expect(owner).to.be.equal(applicant, "owner of application != address that applied");
      expect(unstakedDeposit).to.be.bignumber.equal(utils.paramConfig.minDeposit, "incorrect unstakedDeposit");
    });

    it("should fail if applicant has not approved registry as spender of token", async () => {
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: unapproved }),
      ).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed applicant to apply if they have not approved registry as spender",
      );
    });

    it("should fail if deposit is less than minimum required", async () => {
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit - 1, "", { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED, "should not have allowed application with deposit less than minimum");
    });

    it("should not allow a listing to apply which has a pending application", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant });
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("should add a listing to the whitelist which went unchallenged in its application period", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
      await registry.updateStatus(listing1);
      const [, isWhitelisted] = await registry.listings(listing1);
      expect(isWhitelisted).to.be.true("listing didn't get whitelisted");
    });

    it("should not allow a listing to apply which is already listed", async () => {
      await utils.addToWhitelist(listing1, utils.paramConfig.minDeposit, applicant, registry);
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });
  });
});
