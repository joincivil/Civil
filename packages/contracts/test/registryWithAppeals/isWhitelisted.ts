import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");

contract("Registry With Appeals", (accounts) => {
  describe("Function: isWhitelisted", () => {
    const [JAB, applicant] = accounts;
    let registry: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
    });

    it("should succeed if no application has already been made", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.whitelistAddress(address, minDeposit, { from: JAB });
      const result = await registry.getListingIsWhitelisted(address);
      expect(result).to.be.true("Listing should have been whitelisted");
    });
  });
});
