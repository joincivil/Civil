import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const AddressRegistry = artifacts.require("AddressRegistry");
const Parameterizer = artifacts.require("Parameterizer");
const Token = artifacts.require("EIP20");
const PLCRVoting = artifacts.require("PLCRVoting");

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: challenge", () => {
    const [applicant, challenger, voter, proposer] = accounts;
    const listing3 = "0x0000000000000000000000000000000000000003";
    const listing4 = "0x0000000000000000000000000000000000000004";
    const listing5 = "0x0000000000000000000000000000000000000005";
    const listing6 = "0x0000000000000000000000000000000000000006";
    const listing7 = "0x0000000000000000000000000000000000000007";
    let registry: any;
    let parameterizer: any;
    let token: any;
    let voting: any;

    before(async () => {
      registry = await AddressRegistry.deployed();
      parameterizer = await Parameterizer.deployed();
      token = await Token.deployed();
      voting = await PLCRVoting.deployed();
    });

    it("should successfully challenge an application", async () => {
      const challengerStartingBalance = await token.balanceOf.call(challenger);

      await registry.apply(listing3, utils.paramConfig.minDeposit, "", { from: applicant });
      await utils.challengeAndGetPollID(listing3, challenger, registry);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(listing3);

      const isWhitelisted = await registry.isWhitelisted.call(listing3);
      expect(isWhitelisted).to.be.false("An application which should have failed succeeded");

      const challengerFinalBalance = await token.balanceOf.call(challenger);
      // Note edge case: no voters, so challenger gets entire stake
      const expectedFinalBalance =
        challengerStartingBalance.add(utils.toBaseTenBigNumber(utils.paramConfig.minDeposit));
      expect(challengerFinalBalance).to.be.bignumber.equal(expectedFinalBalance,
        "Reward not properly disbursed to challenger",
      );
    });

    it("should successfully challenge a listing", async () => {
      const challengerStartingBalance = await token.balanceOf.call(challenger);

      await utils.addToWhitelist(listing4, utils.paramConfig.minDeposit, applicant, registry);

      await utils.challengeAndGetPollID(listing4, challenger, registry);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(listing4);

      const isWhitelisted = await registry.isWhitelisted.call(listing4);
      expect(isWhitelisted).to.be.false("An application which should have failed succeeded");

      const challengerFinalBalance = await token.balanceOf.call(challenger);
      // Note edge case: no voters, so challenger gets entire stake
      const expectedFinalBalance =
        challengerStartingBalance.add(utils.toBaseTenBigNumber(utils.paramConfig.minDeposit));
      expect(challengerFinalBalance).to.be.bignumber.equal(expectedFinalBalance,
        "Reward not properly disbursed to challenger",
      );
    });

    it("should unsuccessfully challenge an application", async () => {
      const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);

      await registry.apply(listing5, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(listing5, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 420, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(listing5);

      const isWhitelisted = await registry.isWhitelisted(listing5);
      expect(isWhitelisted).to.be.true(
        "An application which should have succeeded failed",
      );

      const unstakedDeposit = await utils.getUnstakedDeposit(listing5, registry);
      const expectedUnstakedDeposit =
        minDeposit.add(minDeposit.mul(utils.paramConfig.dispensationPct).div(100));

      expect(unstakedDeposit).to.be.bignumber.equal(expectedUnstakedDeposit,
        "The challenge winner was not properly disbursed their tokens",
      );
    });

    it("should unsuccessfully challenge a listing", async () => {
      const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);

      await utils.addToWhitelist(listing6, minDeposit, applicant, registry);

      const pollID = await utils.challengeAndGetPollID(listing6, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 420, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(listing6);

      const isWhitelisted = await registry.isWhitelisted(listing6);
      expect(isWhitelisted).to.be.true("An application which should have succeeded failed");

      const unstakedDeposit = await utils.getUnstakedDeposit(listing6, registry);
      const expectedUnstakedDeposit = minDeposit.add(
        minDeposit.mul(utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(utils.toBaseTenBigNumber(100))));
      expect(unstakedDeposit).to.be.bignumber.equal(expectedUnstakedDeposit,
        "The challenge winner was not properly disbursed their tokens",
      );
    });

    it("should touch-and-remove a listing with a depost below the current minimum", async () => {
      const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
      const newMinDeposit = minDeposit.add(utils.toBaseTenBigNumber(1));

      const applicantStartingBal = await token.balanceOf(applicant);

      await utils.addToWhitelist(listing7, minDeposit, applicant, registry);

      const receipt = await parameterizer.proposeReparameterization("minDeposit", newMinDeposit, { from: proposer });
      const propID = utils.getReceiptValue(receipt, "propID");

      await utils.advanceEvmTime(utils.paramConfig.pApplyStageLength + 1);

      await parameterizer.processProposal(propID);

      const challengerStartingBal = await token.balanceOf(challenger);
      registry.challenge(listing7, "", { from: challenger});
      const challengerFinalBal = await token.balanceOf(challenger);

      expect(challengerStartingBal).to.be.bignumber.equal(challengerFinalBal, "Tokens were not returned to challenger");

      const applicantFinalBal = await token.balanceOf(applicant);

      expect(applicantStartingBal).to.be.bignumber.equal(applicantFinalBal, "Tokens were not returned to applicant");

      const isWhitelisted = await registry.isWhitelisted(listing7);
      expect(isWhitelisted).to.be.false("Listing was not removed");
    });
  });
});
