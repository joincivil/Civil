import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("Function: isWhitelisted", () => {
    const [applicant] = accounts;
    const listing19 = "0x0000000000000000000000000000000000000019";
    let registry: any;
    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
    });

    it("should verify a listing is not in the whitelist", async () => {
      const [, isWhitelisted] = await registry.listings(listing19);
      expect(isWhitelisted).to.be.false("Listing should not be whitelisted");
    });

    it("should verify a listing is in the whitelist", async () => {
      await utils.addToWhitelist(listing19, utils.paramConfig.minDeposit, applicant, registry);
      const [, isWhitelisted] = await registry.listings(listing19);
      expect(isWhitelisted).to.be.true("Listing should have been whitelisted");
    });
  });
});
