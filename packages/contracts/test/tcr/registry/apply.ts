import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";
import { BN } from "bn.js";

configureChai(chai);
const expect = chai.expect;
const Parameterizer = artifacts.require("CivilParameterizer");
utils.configureProviders(Parameterizer);
const ZERO_DATA = "0x";

contract("AddressRegistry", accounts => {
  describe("Function: apply", () => {
    const [applicant, proposer] = accounts;
    const unapproved = accounts[9];
    const listing1 = "0x0000000000000000000000000000000000000001";
    let registry: any;
    let parameterizer: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const parameterizerAddr = await registry.parameterizer();
      parameterizer = await Parameterizer.at(parameterizerAddr);
    });

    it("should allow a new listing to apply", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, ZERO_DATA, { from: applicant });
      const [applicationExpiry, whitelisted, owner, unstakedDeposit] = await registry.listings(listing1);

      // check that Application is initialized correctly
      expect(applicationExpiry).to.be.bignumber.gt(0, "challenge time < now");
      expect(whitelisted).to.be.false("whitelisted != false");
      expect(owner).to.be.equal(applicant, "owner of application != address that applied");
      expect(unstakedDeposit).to.be.bignumber.equal(utils.paramConfig.minDeposit, "incorrect unstakedDeposit");
    });

    it("should fail if applicant has not approved registry as spender of token", async () => {
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, ZERO_DATA, { from: unapproved }),
      ).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed applicant to apply if they have not approved registry as spender",
      );
    });

    it("should fail if deposit is less than minimum required", async () => {
      const deposit = new BN(utils.paramConfig.minDeposit).sub(new BN(1));
      await expect(
        registry.apply(listing1, deposit.toString(), ZERO_DATA, { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED, "should not have allowed application with deposit less than minimum");
    });

    it("should not allow a listing to apply which has a pending application", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, ZERO_DATA, { from: applicant });
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, ZERO_DATA, { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("should add a listing to the whitelist which went unchallenged in its application period", async () => {
      await registry.apply(listing1, utils.paramConfig.minDeposit, ZERO_DATA, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
      await registry.updateStatus(listing1);
      const [, isWhitelisted] = await registry.listings(listing1);
      expect(isWhitelisted).to.be.true("listing didn't get whitelisted");
    });

    it("should not allow a listing to apply which is already listed", async () => {
      await utils.addToWhitelist(listing1, utils.paramConfig.minDeposit, applicant, registry);
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, ZERO_DATA, { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("should revert if the listing's applicationExpiry would overflow", async () => {
      // calculate an applyStageLen which when added to the current block time will be greater
      // than 2^256 - 1
      const blockTimestamp = await utils.getBlockTimestamp();
      const maxEVMuint = new BN(2).pow(new BN(256)).sub(new BN(1));
      const applyStageLen = maxEVMuint.sub(new BN(blockTimestamp)).add(new BN(1));

      const receipt = await parameterizer.proposeReparameterization("applyStageLen", applyStageLen.toString(), {
        from: proposer,
      });
      const { propID } = receipt.logs[0].args;

      // wait until the apply stage has elapsed and process the proposal
      await utils.advanceEvmTime(utils.paramConfig.pApplyStageLength + 1);
      await parameterizer.processProposal(propID);

      // make sure that the reparameterization proposal was processed as expected
      const actualApplyStageLen = await parameterizer.get.call("applyStageLen");
      expect(actualApplyStageLen.toString()).to.be.equal(
        applyStageLen.toString(),
        "the applyStageLen should have been the proposed value",
      );

      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, ZERO_DATA, { from: applicant }),
      ).to.eventually.be.rejected("should not have allowed applicant to apply if application expiry would overflow");
    });
  });
});
