import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const AddressRegistry = artifacts.require("AddressRegistry");
const Token = artifacts.require("EIP20");
const PLCRVoting = artifacts.require("PLCRVoting");

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: claimReward", () => {
    const [applicant, challenger, voterAlice] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const listing8 = "0x0000000000000000000000000000000000000008";
    const listing9 = "0x0000000000000000000000000000000000000009";
    const listing10 = "0x0000000000000000000000000000000000000010";
    const listing11 = "0x0000000000000000000000000000000000000011";
    const listing12 = "0x0000000000000000000000000000000000000012";
    let registry: any;
    let token: any;
    let voting: any;

    before(async () => {
      registry = await AddressRegistry.deployed();
      token = await Token.deployed();
      voting = await PLCRVoting.deployed();
    });

    it("should transfer the correct number of tokens once a challenge has been resolved", async () => {
      // Apply
      await registry.apply(listing8, minDeposit, "", { from: applicant });
      const aliceStartingBalance = await token.balanceOf(voterAlice);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(listing8, challenger, registry);

      // Alice is so committed
      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      // Update status
      await registry.updateStatus(listing8, { from: applicant });

      // Alice claims reward
      const aliceVoterReward = await registry.voterReward(voterAlice, pollID, "420");
      await registry.claimReward(pollID, "420", { from: voterAlice });

      // Alice withdraws her voting rights
      await voting.withdrawVotingRights("500", { from: voterAlice });

      const aliceExpected = aliceStartingBalance.add(aliceVoterReward);
      const aliceFinalBalance = await token.balanceOf(voterAlice);

      expect(aliceFinalBalance).to.be.bignumber.equal(aliceExpected,
        "alice should have the same balance as she started",
      );
    });

    it("should revert if challenge does not exist", async () => {
      await utils.addToWhitelist(listing9, minDeposit, applicant, registry);

      const nonPollID = "666";
      await expect(registry.claimReward(nonPollID, "420", { from: voterAlice }))
      .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should revert if provided salt is incorrect", async () => {
      const applicantStartingBalance = await token.balanceOf(applicant);
      const aliceStartBal = await token.balanceOf(voterAlice);
      await utils.addToWhitelist(listing10, minDeposit, applicant, registry);

      const pollID = await utils.challengeAndGetPollID(listing10, challenger, registry);

      // Alice is so committed
      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      const applicantFinalBalance = await token.balanceOf(applicant);
      const aliceFinalBalance = await token.balanceOf(voterAlice);
      const expectedBalance = applicantStartingBalance.sub(minDeposit);

      expect(applicantFinalBalance).to.be.bignumber.equal(expectedBalance,
        "applicants final balance should be what they started with minus the minDeposit",
      );
      expect(aliceFinalBalance).to.be.bignumber.equal(aliceStartBal.sub(utils.toBaseTenBigNumber(500)),
        "alices final balance should be exactly the same as her starting balance",
      );

      // Update status
      await registry.updateStatus(listing10, { from: applicant });

      await expect(registry.claimReward(pollID, "421", { from: voterAlice }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should not transfer tokens if msg.sender has already claimed tokens for a challenge", async () => {
      const applicantStartingBalance = await token.balanceOf(applicant);
      const aliceStartingBalance = await token.balanceOf(voterAlice);

      await utils.addToWhitelist(listing11, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(listing11, challenger, registry);

      // Alice is so committed
      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      // Update status
      await registry.updateStatus(listing11, { from: applicant });

      // Claim reward
      await registry.claimReward(pollID, "420", { from: voterAlice });

      await expect(registry.claimReward(pollID, "420", { from: voterAlice }))
      .to.eventually.be.rejectedWith(REVERTED, "should not have been able to call claimReward twice");

      const applicantEndingBalance = await token.balanceOf(applicant);
      const appExpected = applicantStartingBalance.sub(minDeposit);

      const aliceEndingBalance = await token.balanceOf(voterAlice);
      const aliceExpected = aliceStartingBalance.add(minDeposit.div(utils.toBaseTenBigNumber(2)))
      .sub(utils.toBaseTenBigNumber(500));

      expect(applicantEndingBalance).to.be.bignumber.equal(appExpected,
        "applicants ending balance is incorrect",
      );
      expect(aliceEndingBalance).to.be.bignumber.equal(aliceExpected,
        "alices ending balance is incorrect",
      );
    });

    it("should not transfer tokens for an unresolved challenge", async () => {
      const applicantStartingBalance = await token.balanceOf(applicant);
      const aliceStartingBalance = await token.balanceOf(voterAlice);

      await utils.addToWhitelist(listing12, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(listing12, challenger, registry);

      // Alice is so committed
      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await expect(registry.claimReward(pollID, "420", { from: voterAlice }))
      .to.eventually.be.rejectedWith(REVERTED, "should not have been able to claimReward for unresolved challenge");

      const applicantEndingBalance = await token.balanceOf.call(applicant);
      const appExpected = applicantStartingBalance.sub(minDeposit);

      const aliceEndingBalance = await token.balanceOf.call(voterAlice);
      const aliceExpected = aliceStartingBalance.sub(utils.toBaseTenBigNumber(500));

      expect(applicantEndingBalance).to.be.bignumber.equal(appExpected,
        "applicants ending balance is incorrect",
      );
      expect(aliceEndingBalance).to.be.bignumber.equal(aliceExpected,
        "alices ending balance is incorrect",
      );
    });
  });
});
