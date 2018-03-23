import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const AddressRegistry = artifacts.require("AddressRegistry");
const ContractAddressRegistry = artifacts.require("ContractAddressRegistry");

const NEWSROOM_NAME = "unused newsroom name;";

contract("Registry With Appeals", (accounts) => {
  describe("Function: apply", () => {
    const [JAB, applicant, troll, challenger] = accounts;
    const listing1 = "0x0000000000000000000000000000000000000001";
    const minDeposit = utils.paramConfig.minDeposit;
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
    });

    describe("with real newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
        newsroomAddress = testNewsroom.address;
      });

      it("should allow contract owner to apply on behalf of contract", async () => {
        await registry.apply(testNewsroom.address, utils.paramConfig.minDeposit, "", {from: applicant });

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
        await registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", {from: applicant });
        await expect(registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", {from: applicant }))
          .to.eventually.be.rejectedWith(REVERTED);
      });

      it(
        "should add a listing to the whitelist which went unchallenged in its application period",
        async () => {
          await registry.apply(newsroomAddress, minDeposit, "", {from: applicant });
          await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
          await registry.updateStatus(newsroomAddress);
          const result = await registry.getListingIsWhitelisted(newsroomAddress);
          expect(result).to.be.true("listing didn't get whitelisted");
        },
      );

      it("should not allow a listing to apply which is already listed", async () => {
        await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);
        await expect(registry.apply(newsroomAddress, minDeposit, "", {from: applicant }))
          .to.eventually.be.rejectedWith(REVERTED);
      });

      it("should not allow a listing to re-apply after losing challenge, " +
      "not being granted appeal, not updating status", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
        await registry.updateStatus(newsroomAddress);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await utils.advanceEvmTime(1209620); // hack. should be getting value from registry contract

        const applyTx = registry.apply(newsroomAddress, minDeposit, "", { from: applicant});
        await expect(applyTx).to.eventually.be.rejectedWith(REVERTED,
          "should not have allowed new application after being denied appeal and not updating status");
    });

      it("should allow a listing to re-apply after losing challenge, " +
        "not being granted appeal, updating status", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.updateStatus(newsroomAddress);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await utils.advanceEvmTime(1209620); // hack. should be getting value from registry contract
        await registry.updateStatus(newsroomAddress);

        await expect(registry.apply(newsroomAddress, minDeposit, "", { from: applicant})).to.eventually.be.fulfilled(
          "should have allowed new application after being denied appeal");
      });
    });

    describe("with troll newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: troll });
        newsroomAddress = testNewsroom.address;
      });

      it("should not allow a non-contract owner to apply", async () => {
        await expect(registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", {from: applicant }))
          .to.eventually.be.rejectedWith(REVERTED);
      });

      it(
        "should prevent un-owned address from being listed when registry cast to ContractAddressRegistry",
        async () => {
        const parentRegistry = await ContractAddressRegistry.at(registry.address);
        await expect(parentRegistry.apply(newsroomAddress, minDeposit, "", {from: applicant }))
          .to.eventually.be.rejectedWith(REVERTED);
      });
    });

    it("should prevent non-contract address from being listed", async () => {
      await expect(registry.apply(listing1, utils.paramConfig.minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should prevent non-contract address from being listed when registry cast to AddressRegistry", async () => {
      const parentRegistry = await AddressRegistry.at(registry.address);

      await expect(parentRegistry.apply(listing1, minDeposit, "", {from: applicant }))
        .to.eventually.be.rejectedWith(REVERTED);
    });
  });
});
