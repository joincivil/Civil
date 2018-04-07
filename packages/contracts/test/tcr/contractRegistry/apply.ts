import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const NEWSROOM_NAME = "unused newsroom name";
const Newsroom = artifacts.require("Newsroom");
const AddressRegistry = artifacts.require("AddressRegistry");

contract("ContractAddressRegistry", accounts => {
  describe("Function: apply", () => {
    const [applicant, troll] = accounts;
    const listing1 = "0x0000000000000000000000000000000000000001";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestContractAddressRegistryInstance(accounts);
    });

    describe("with real newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
        newsroomAddress = testNewsroom.address;
      });

      it("should allow contract owner to apply on behalf of contract", async () => {
        await expect(
          registry.apply(testNewsroom.address, utils.paramConfig.minDeposit, "", { from: applicant }),
        ).to.eventually.be.fulfilled();

        // get the struct in the mapping
        const applicationExpiry = await registry.getListingApplicationExpiry(newsroomAddress);
        const whitelisted = await registry.getListingIsWhitelisted(newsroomAddress);
        const owner = await registry.getListingOwner(newsroomAddress);
        const unstakedDeposit = await registry.getListingUnstakedDeposit(newsroomAddress);

        // check that Application is initialized correctly
        expect(applicationExpiry).to.be.bignumber.gt(0, "challenge time < now");
        expect(whitelisted).to.be.false("whitelisted != false");
        expect(owner).to.be.equal(applicant, "owner of application != address that applied");
        expect(unstakedDeposit).to.be.bignumber.equal(utils.paramConfig.minDeposit, "incorrect unstakedDeposit");
      });

      it("should not allow a listing to apply which has a pending application", async () => {
        await registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant });
        await expect(
          registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("should add a listing to the whitelist which went unchallenged in its application period", async () => {
        await registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant });
        await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
        await registry.updateStatus(newsroomAddress);
        const result = await registry.getListingIsWhitelisted(newsroomAddress);
        expect(result).to.be.true("listing didn't get whitelisted");
      });

      it("should not allow a listing to apply which is already listed", async () => {
        await utils.addToWhitelist(newsroomAddress, utils.paramConfig.minDeposit, applicant, registry);
        await expect(
          registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });
    });

    describe("with troll newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: troll });
        newsroomAddress = testNewsroom.address;
      });

      it("should allow a non-contract owner to apply", async () => {
        await expect(
          registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant }),
        ).to.eventually.be.fulfilled();
      });
    });

    it("should prevent non-contract address from being listed", async () => {
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("should prevent non-contract address from being listed when registry cast to AddressRegistry", async () => {
      const parentRegistry = await AddressRegistry.at(registry.address);
      await expect(
        parentRegistry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });
  });
});
