import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

contract("AddressRegistry", (accounts) => {
  describe("Function: apply", () => {
    const [applicant] = accounts;
    const listing1 = "0x0000000000000000000000000000000000000001";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
    });

    it("should allow a new listing to apply", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant });
      // get the struct in the mapping
      // TODO: getting structs is undefined behavior, convert this to multiple gets
      const applicationExpiry = await registry.getListingApplicationExpiry(listing1);
      const whitelisted = await registry.getListingIsWhitelisted(listing1);
      const owner = await registry.getListingOwner(listing1);
      const unstakedDeposit = await registry.getListingUnstakedDeposit(listing1);
      // check that Application is initialized correctly
      expect(applicationExpiry).to.be.bignumber.gt(0, "challenge time < now");
      expect(whitelisted).to.be.false("whitelisted != false");
      expect(owner).to.be.equal(applicant, "owner of application != address that applied");
      expect(unstakedDeposit).to.be.bignumber.equal(utils.paramConfig.minDeposit, "incorrect unstakedDeposit");
    });

    it("should not allow a listing to apply which has a pending application", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant });
      await expect(registry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it(
      "should add a listing to the whitelist which went unchallenged in its application period",
      async () => {
        await registry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant });
        await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
        await registry.updateStatus(listing1);
        const result = await registry.getListingIsWhitelisted(listing1);
        expect(result).to.be.true("listing didn't get whitelisted");
      },
    );

    it("should not allow a listing to apply which is already listed", async () => {
      await utils.addToWhitelist(listing1, utils.paramConfig.minDeposit, applicant, registry);
      await expect(registry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });
  });
});
