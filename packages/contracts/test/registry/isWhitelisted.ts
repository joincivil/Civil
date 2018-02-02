import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: isWhitelisted", () => {
    const [applicant] = accounts;
    const listing19 = "0x0000000000000000000000000000000000000019";
    let registry: any;
    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
    });

    it("should verify a listing is not in the whitelist", async () => {
      const result = await registry.getListingIsWhitelisted(listing19);
      expect(result).to.be.false("Listing should not be whitelisted");
    });

    it("should verify a listing is in the whitelist", async () => {
      await utils.addToWhitelist(listing19, utils.paramConfig.minDeposit, applicant, registry);
      const result = await registry.getListingIsWhitelisted.call(listing19);
      expect(result).to.be.true("Listing should have been whitelisted");
    });
  });
});
