import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const Token = artifacts.require("EIP20");
const PLCRVoting = artifacts.require("PLCRVoting");
const Newsroom = artifacts.require("Newsroom");

const NEWSROOM_NAME = "unused newsroom name";

configureChai(chai);
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: claimReward", () => {
    const [JAB, applicant, challenger, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let token: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
      const tokenAddress = await registry.token();
      token = await Token.at(tokenAddress);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);

      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should transfer the correct number of tokens once a challenge has been resolved", async () => {
      // Apply
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const aliceStartingBalance = await token.balanceOf(voterAlice);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      // Alice is so committed
      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      // Update status
      await registry.updateStatus(newsroomAddress, { from: applicant });

      // Pass Request Appeal Phase without requesting
      const waitTime = Number(await registry.requestAppealPhaseLength()) + 1;
      await utils.advanceEvmTime(waitTime);
      await registry.updateStatus(newsroomAddress);

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
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      const nonPollID = "666";
      await expect(registry.claimReward(nonPollID, "420", { from: voterAlice }))
      .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should revert if provided salt is incorrect", async () => {
      const applicantStartingBalance = await token.balanceOf(applicant);
      const aliceStartBal = await token.balanceOf(voterAlice);
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

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
      await registry.updateStatus(newsroomAddress, { from: applicant });

      await expect(registry.claimReward(pollID, "421", { from: voterAlice }))
        .to.eventually.be.rejectedWith(REVERTED);
    });

    it("should not transfer tokens if msg.sender has already claimed tokens for a challenge", async () => {
      const applicantStartingBalance = await token.balanceOf(applicant);
      const aliceStartingBalance = await token.balanceOf(voterAlice);

      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      // Alice is so committed
      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      // Update status
      await registry.updateStatus(newsroomAddress, { from: applicant });

      const waitTime = Number(await registry.requestAppealPhaseLength()) + 1;
      await utils.advanceEvmTime(waitTime);
      await registry.updateStatus(newsroomAddress);

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

      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

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

    it("should not transfer tokens to majority voters if challenge is overturned on appeal", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.updateStatus(newsroomAddress, { from: applicant });

      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      const waitTime = Number(await registry.judgeAppealPhaseLength()) + 1;
      await utils.advanceEvmTime(waitTime);

      await registry.updateStatus(newsroomAddress);

      // Claim reward
      await expect(registry.claimReward(pollID, "42", { from: voterAlice })).to.be.rejectedWith(REVERTED,
        "should have reverted since voter commit hash does not match winning hash for salt");
    });

    // TODO(nickreynolds)
    // "challenger" should not be able to claim reward for overturned challenge
    // "applicant" should be able to claim reward for overturned challenge

    it("should transfer tokens to minority voters if challenge is overturned on appeal", async () => {
      const bobStartingBalance = await token.balanceOf(voterBob);
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
      await utils.commitVote(voting, pollID, "1", "30", "32", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
      await voting.revealVote(pollID, "1", "32  ", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.updateStatus(newsroomAddress, { from: applicant });

      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      const waitTime = Number(await registry.judgeAppealPhaseLength());
      await utils.advanceEvmTime(waitTime + 1);

      await registry.updateStatus(newsroomAddress);

      // Claim reward
      await expect(registry.claimReward(pollID, "32", { from: voterBob })).to.be.fulfilled(
        "should have allowed minority voter to claim reward");

      await voting.withdrawVotingRights("30", { from: voterBob }); // get all tokens back
      const bobEndingBalance = await token.balanceOf(voterBob);

      // starting balance + (minDeposit * dispensationPct)
      const expectedBobEndingBalance = utils.toBaseTenBigNumber(bobStartingBalance).add(
        utils.toBaseTenBigNumber(utils.paramConfig.minDeposit).mul(
          utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(100)));

      expect(bobEndingBalance).to.be.bignumber.equal(expectedBobEndingBalance,
        "Bob's ending balance did not equal expected value");
    });
  });
});
