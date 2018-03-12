import * as chai from "chai";
import { REVERTED } from "../utils/constants";
import { configureChai } from "@joincivil/dev-utils";
import * as utils from "../utils/contractutils";

const Newsroom = artifacts.require("Newsroom");

configureChai(chai);
const expect = chai.expect;

contract("Registry With Appeals", (accounts) => {
  describe("Function: challenge", () => {
    const [JAB, applicant, challenger] = accounts;
    let registry: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
    });

    it("should successfully challenge an application", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;

      await registry.apply(address, minDeposit, "", { from: applicant });
      await expect(registry.challenge(address, "", { from: challenger })).to.eventually.be.fulfilled(
        "Should have succeeded on regular application");
    });

    it("should fail on recently JEC-whitelisted application", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;

      await registry.whitelistAddress(address, minDeposit, { from: JAB });
      await expect(registry.challenge(address, "", { from: challenger })).to.eventually.be.rejectedWith(REVERTED,
        "Should have failed on JEC-whitelisted listing");
    });

    it("should succeed on JEC-whitelisted application past its grace period end", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;

      await registry.whitelistAddress(address, minDeposit, { from: JAB });
      const waitTime = Number(await registry.whitelistGracePeriodLength()) + 1;
      await utils.advanceEvmTime(waitTime);
      await expect(registry.challenge(address, "", { from: challenger })).to.eventually.be.fulfilled(
        "Should have succeeded on JEC-whitelisted listing past its grace period");
    });

  });
});
