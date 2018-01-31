import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const AddressRegistry = artifacts.require("AddressRegistry");

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: isWhitelisted", () => {
    const [applicant] = accounts;
    const listing19 = "0x0000000000000000000000000000000000000019";
    let registry: any;
    before(async () => {
      registry = await AddressRegistry.deployed();
    });

    it("should verify a listing is not in the whitelist", async () => {
      const result = await registry.isWhitelisted(listing19);
      expect(result).to.be.false("Listing should not be whitelisted");
    });

    it("should verify a listing is in the whitelist", async () => {
      await utils.addToWhitelist(listing19, utils.paramConfig.minDeposit, applicant, registry);
      const result = await registry.isWhitelisted.call(listing19);
      expect(result).to.be.true("Listing should have been whitelisted");
    });
  });
});
