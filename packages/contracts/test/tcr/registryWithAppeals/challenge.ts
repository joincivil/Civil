import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const Newsroom = artifacts.require("Newsroom");

configureChai(chai);
const expect = chai.expect;

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", (accounts) => {
  describe("Function: challenge", () => {
    const [JAB, applicant, challenger] = accounts;
    let registry: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
    });

    describe("with real newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: any;

      beforeEach(async () => {
        testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
        newsroomAddress = testNewsroom.address;
      });

      it("should successfully challenge an application", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await expect(registry.challenge(newsroomAddress, "", { from: challenger })).to.eventually.be.fulfilled(
          "Should have succeeded on regular application");
      });

      it("should fail on recently JEC-whitelisted application", async () => {
        await registry.whitelistAddress(newsroomAddress, minDeposit, { from: JAB });

        const challengeTx = registry.challenge(newsroomAddress, "", { from: challenger });
        await expect(challengeTx).to.eventually.be.rejectedWith(REVERTED,
          "Should have failed on JEC-whitelisted listing");
      });

      it("should succeed on JEC-whitelisted application past its grace period end", async () => {
        await registry.whitelistAddress(newsroomAddress, minDeposit, { from: JAB });
        const waitTime = Number(await registry.whitelistGracePeriodLength()) + 1;
        await utils.advanceEvmTime(waitTime);
        await expect(registry.challenge(newsroomAddress, "", { from: challenger })).to.eventually.be.fulfilled(
          "Should have succeeded on JEC-whitelisted listing past its grace period");
      });
    });
  });
});
