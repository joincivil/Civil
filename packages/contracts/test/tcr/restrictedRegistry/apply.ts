import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const AddressRegistry = artifacts.require("AddressRegistry");
const ContractAddressRegistry = artifacts.require("ContractAddressRegistry");
utils.configureProviders(AddressRegistry, ContractAddressRegistry);

const CHARTER_HASH = "0x";

contract("RestrictedAddressRegistry", accounts => {
  describe("Function: apply", () => {
    const [applicant, troll] = accounts;
    const listing1 = "0x0000000000000000000000000000000000000001";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryInstance(accounts);
    });

    describe("with real newsroom", () => {
      let testNewsroom: any;
      let address: string;

      beforeEach(async () => {
        testNewsroom = await utils.createDummyNewsrom(applicant);
        address = testNewsroom.address;
      });

      it("should allow contract owner to apply on behalf of contract", async () => {
        await registry.apply(testNewsroom.address, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant });

        // get the struct in the mapping
        const [applicationExpiry, whitelisted, owner, unstakedDeposit] = await registry.listings(address);

        // check that Application is initialized correctly
        expect(applicationExpiry).to.be.bignumber.gt(0, "challenge time < now");
        expect(whitelisted).to.be.false("whitelisted != false");
        expect(owner).to.be.equal(applicant, "owner of application != address that applied");
        expect(unstakedDeposit).to.be.bignumber.equal(utils.paramConfig.minDeposit, "incorrect unstakedDeposit");
      });

      it("should not allow a listing to apply which has a pending application", async () => {
        await registry.apply(address, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant });
        await expect(
          registry.apply(address, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("should add a listing to the whitelist which went unchallenged in its application period", async () => {
        await registry.apply(address, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant });
        await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
        await registry.updateStatus(address);
        const [, isWhitelisted] = await registry.listings(address);
        expect(isWhitelisted).to.be.true("listing didn't get whitelisted");
      });

      it("should not allow a listing to apply which is already listed", async () => {
        await utils.addToWhitelist(address, utils.paramConfig.minDeposit, applicant, registry);
        await expect(
          registry.apply(address, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });
    });

    describe("with fake newsroom", () => {
      let testNewsroom: any;
      let address: string;

      beforeEach(async () => {
        testNewsroom = await utils.createDummyNewsrom(troll);
        address = testNewsroom.address;
      });

      it("should not allow a non-contract owner to apply", async () => {
        await expect(
          registry.apply(address, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("should prevent un-owned address from being listed when registry cast to ContractAddressRegistry", async () => {
        const parentRegistry = await ContractAddressRegistry.at(registry.address);
        await expect(
          parentRegistry.apply(address, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });
    });

    it("should prevent non-contract address from being listed", async () => {
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("should prevent non-contract address from being listed when registry cast to AddressRegistry", async () => {
      const parentRegistry = await AddressRegistry.at(registry.address);
      await expect(
        parentRegistry.apply(listing1, utils.paramConfig.minDeposit, CHARTER_HASH, { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });
  });
});
