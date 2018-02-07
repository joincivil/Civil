import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const AddressRegistry = artifacts.require("AddressRegistry");
const ContractAddressRegistry = artifacts.require("ContractAddressRegistry");

contract("RestrictedAddressRegistry", (accounts) => {
  describe("Function: apply", () => {
    const [applicant, troll] = accounts;
    const listing1 = "0x0000000000000000000000000000000000000001";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryInstance(accounts);
    });

    it("should allow contract owner to apply on behalf of contract", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(testNewsroom.address, utils.paramConfig.minDeposit, "", {from: applicant });

      // get the struct in the mapping
      const applicationExpiry = await registry.getListingApplicationExpiry(address);
      const whitelisted = await registry.getListingIsWhitelisted(address);
      const owner = await registry.getListingOwner(address);
      const unstakedDeposit = await registry.getListingUnstakedDeposit(address);

      // check that Application is initialized correctly
      expect(applicationExpiry).to.be.bignumber.gt(0, "challenge time < now");
      expect(whitelisted).to.be.false("whitelisted != false");
      expect(owner).to.be.equal(applicant, "owner of application != address that applied");
      expect(unstakedDeposit).to.be.bignumber.equal(utils.paramConfig.minDeposit, "incorrect unstakedDeposit");
    });

    it("should prevent non-contract address from being listed", async () => {
      await expect(registry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should not allow a listing to apply which has a pending application", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, utils.paramConfig.minDeposit, "", {from: applicant });
      await expect(registry.apply(address, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it(
      "should add a listing to the whitelist which went unchallenged in its application period",
      async () => {
        const testNewsroom = await Newsroom.new({ from: applicant });
        const address = testNewsroom.address;
        await registry.apply(address, utils.paramConfig.minDeposit, "", {from: applicant });
        await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
        await registry.updateStatus(address);
        const result = await registry.getListingIsWhitelisted(address);
        expect(result).to.be.true("listing didn't get whitelisted");
      },
    );

    it("should not allow a listing to apply which is already listed", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await utils.addToWhitelist(address, utils.paramConfig.minDeposit, applicant, registry);
      await expect(registry.apply(address, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should not allow a non-contract owner to apply", async () => {
      const testNewsroom = await Newsroom.new({ from: troll });
      const address = testNewsroom.address;
      await expect(registry.apply(address, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should prevent non-contract address from being listed when registry cast to AddressRegistry", async () => {
      const parentRegistry = await AddressRegistry.at(registry.address);
      await expect(parentRegistry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should prevent un-owned address from being listed when registry cast to ContractAddressRegistry", async () => {
      const testNewsroom = await Newsroom.new({ from: troll });
      const address = testNewsroom.address;
      const parentRegistry = await ContractAddressRegistry.at(registry.address);
      await expect(parentRegistry.apply(address, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

  });
});
