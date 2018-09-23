import { configureChai } from "@joincivil/dev-utils";
import BN from "bignumber.js";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const Parameterizer = artifacts.require("CivilParameterizer");
const Token = artifacts.require("EIP20");
utils.configureProviders(Parameterizer, Token);

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("Function: challenge", () => {
    const [applicant, challenger, voter, proposer] = accounts;
    const unapproved = accounts[9];
    const listing3 = "0x0000000000000000000000000000000000000003";
    const listing4 = "0x0000000000000000000000000000000000000004";
    const listing5 = "0x0000000000000000000000000000000000000005";
    const listing6 = "0x0000000000000000000000000000000000000006";
    const listing7 = "0x0000000000000000000000000000000000000007";
    let registry: any;
    let parameterizer: any;
    let token: any;
    const minDeposit = new BN(utils.paramConfig.minDeposit);

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const parameterizerAddress = await registry.parameterizer();
      parameterizer = await Parameterizer.at(parameterizerAddress);
      const tokenAddress = await registry.token();
      token = await Token.at(tokenAddress);
    });

    it("should successfully challenge an application", async () => {
      const challengerStartingBalance = await token.balanceOf.call(challenger);

      await registry.apply(listing3, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, listing3, challenger, voter);
      await registry.updateStatus(listing3);

      const [, isWhitelisted] = await registry.listings(listing3);
      expect(isWhitelisted).to.be.false("An application which should have failed succeeded");

      const challengerFinalBalance = await token.balanceOf.call(challenger);
      const expectedFinalBalance = challengerStartingBalance.add(
        minDeposit.mul(utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(utils.toBaseTenBigNumber(100))),
      );
      expect(challengerFinalBalance).to.be.bignumber.equal(
        expectedFinalBalance,
        "The challenge winner was not properly disbursed their tokens",
      );
    });

    it("should fail if challenge is already in progress", async () => {
      await registry.apply(listing3, utils.paramConfig.minDeposit, "", { from: applicant });
      await utils.challengeAndGetPollID(listing3, challenger, registry);
      await expect(registry.challenge(listing3, "", { from: challenger })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed user to challenge listing currently undergoing a challenge",
      );
    });

    it("should fail if challenger has not approved registry as spender of token", async () => {
      await registry.apply(listing3, utils.paramConfig.minDeposit, "", { from: applicant });
      await expect(registry.challenge(listing3, "", { from: unapproved })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have allowed challenge if challenger has not approved registry as spender of token",
      );
    });

    it("should successfully challenge a listing", async () => {
      const challengerStartingBalance = await token.balanceOf.call(challenger);

      await utils.addToWhitelist(listing4, utils.paramConfig.minDeposit, applicant, registry);
      await utils.simpleSuccessfulChallenge(registry, listing4, challenger, voter);
      await registry.updateStatus(listing4);

      const [, isWhitelisted] = await registry.listings(listing4);
      expect(isWhitelisted).to.be.false("An application which should have failed succeeded");

      const challengerFinalBalance = await token.balanceOf.call(challenger);
      const expectedFinalBalance = challengerStartingBalance.add(
        minDeposit.mul(utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(utils.toBaseTenBigNumber(100))),
      );
      expect(challengerFinalBalance).to.be.bignumber.equal(
        expectedFinalBalance,
        "The challenge winner was not properly disbursed their tokens",
      );
    });

    it("should unsuccessfully challenge an application", async () => {
      await registry.apply(listing5, minDeposit, "", { from: applicant });
      await utils.simpleUnsuccessfulChallenge(registry, listing5, challenger, voter);
      await registry.updateStatus(listing5);

      const [, isWhitelisted, , unstakedDeposit] = await registry.listings(listing5);
      expect(isWhitelisted).to.be.true("An application which should have succeeded failed");

      const expectedUnstakedDeposit = minDeposit.add(
        minDeposit.mul(utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(utils.toBaseTenBigNumber(100))),
      );
      expect(unstakedDeposit).to.be.bignumber.equal(
        expectedUnstakedDeposit,
        "The challenge winner was not properly disbursed their tokens",
      );
    });

    it("should unsuccessfully challenge a listing", async () => {
      await utils.addToWhitelist(listing6, minDeposit, applicant, registry);
      await utils.simpleUnsuccessfulChallenge(registry, listing6, challenger, voter);
      await registry.updateStatus(listing6);

      const [, isWhitelisted, , unstakedDeposit] = await registry.listings(listing6);
      expect(isWhitelisted).to.be.true("An application which should have succeeded failed");

      const expectedUnstakedDeposit = minDeposit.add(
        minDeposit.mul(utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(utils.toBaseTenBigNumber(100))),
      );
      expect(unstakedDeposit).to.be.bignumber.equal(
        expectedUnstakedDeposit,
        "The challenge winner was not properly disbursed their tokens",
      );
    });

    it("should touch-and-remove a listing with a depost below the current minimum", async () => {
      const newMinDeposit = minDeposit.add(1);

      const applicantStartingBal = await token.balanceOf(applicant);

      await utils.addToWhitelist(listing7, minDeposit, applicant, registry);

      const receipt = await parameterizer.proposeReparameterization("minDeposit", newMinDeposit, { from: proposer });
      const propID = utils.getReceiptValue(receipt, "propID");

      await utils.advanceEvmTime(utils.paramConfig.pApplyStageLength + 1);

      await parameterizer.processProposal(propID);

      const challengerStartingBal = await token.balanceOf(challenger);
      await registry.challenge(listing7, "", { from: challenger });

      const [, isWhitelisted] = await registry.listings(listing7);
      expect(isWhitelisted).to.be.false("Listing was not removed");

      const challengerFinalBal = await token.balanceOf(challenger);
      expect(challengerStartingBal).to.be.bignumber.equal(challengerFinalBal, "Tokens were not returned to challenger");

      const applicantFinalBal = await token.balanceOf(applicant);
      expect(applicantStartingBal).to.be.bignumber.equal(applicantFinalBal, "Tokens were not returned to applicant");
    });
  });
});
