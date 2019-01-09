import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";
import { BigNumber } from "bignumber.js";
import { REVERTED } from "../../utils/constants";

const Token = artifacts.require("CVLToken");
configureChai(chai);
const expect = chai.expect;

contract("Registry With Appeals", accounts => {
  describe("Rewards for all participants", () => {
    const [JAB, applicant, challenger, voter, appealer, voter2, challenger2] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    let token: any;
    const minDeposit = utils.paramConfig.minDeposit;
    const halfAppeal = new BigNumber(utils.paramConfig.appealFeeAmount).div(2);

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);

      testNewsroom = await utils.createDummyNewsrom(applicant);
      newsroomAddress = testNewsroom.address;
      const tokenAddress = await registry.token();
      token = await Token.at(tokenAddress);
    });

    it("correct rewards when: challenge unsuccessful, appeal not requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted, , unstakedDeposit] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with unsuccessful challenge if appeal requested but not granted",
      );
      const reward = utils.getChallengeReward();
      expect(unstakedDeposit).to.be.bignumber.equal(new BigNumber(minDeposit).add(reward));
      const voterBalanceBeforeClaiming = await token.balanceOf(voter);
      await registry.claimReward(pollID, "420", { from: voter });
      const voterBalanceAfterClaiming = await token.balanceOf(voter);
      expect(voterBalanceAfterClaiming).to.be.bignumber.equal(
        voterBalanceBeforeClaiming.add(utils.getTotalVoterReward()),
      );
    });

    it("correct rewards when: challenge successful, appeal not requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);
      const challengerBalanceBefore = await token.balanceOf(challenger);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with successful challenge if appeal requested but not granted",
      );
      const challengerBalanceAfter = await token.balanceOf(challenger);
      expect(challengerBalanceAfter).to.be.bignumber.equal(
        challengerBalanceBefore.add(minDeposit).add(utils.getChallengeReward()),
      );
      const voterBalanceBeforeClaiming = await token.balanceOf(voter);
      await registry.claimReward(pollID, "420", { from: voter });
      const voterBalanceAfterClaiming = await token.balanceOf(voter);
      expect(voterBalanceAfterClaiming).to.be.bignumber.equal(
        voterBalanceBeforeClaiming.add(utils.getTotalVoterReward()),
      );
    });

    it("correct rewards when: challenge unsuccessful, appeal requested, no granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted, , unstakedDeposit] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with unsuccessful challenge if appeal requested but not granted",
      );
      const reward = utils.getChallengeReward();
      expect(unstakedDeposit).to.be.bignumber.equal(new BigNumber(minDeposit).add(reward).add(halfAppeal));
      const voterBalanceBeforeClaiming = await token.balanceOf(voter);
      await registry.claimReward(pollID, "420", { from: voter });
      const voterBalanceAfterClaiming = await token.balanceOf(voter);
      expect(voterBalanceAfterClaiming).to.be.bignumber.equal(
        voterBalanceBeforeClaiming.add(utils.getTotalVoterReward()).add(halfAppeal),
      );
    });

    it("correct rewards when: challenge successful, appeal requested, no granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
      const challengerBalanceBefore = await token.balanceOf(challenger);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with successful challenge if appeal requested but not granted",
      );
      const challengerBalanceAfter = await token.balanceOf(challenger);
      expect(challengerBalanceAfter).to.be.bignumber.equal(
        challengerBalanceBefore.add(minDeposit).add(utils.getChallengeReward().add(halfAppeal)),
      );
      const voterBalanceBeforeClaiming = await token.balanceOf(voter);
      await registry.claimReward(pollID, "420", { from: voter });
      const voterBalanceAfterClaiming = await token.balanceOf(voter);
      expect(voterBalanceAfterClaiming).to.be.bignumber.equal(
        voterBalanceBeforeClaiming.add(utils.getTotalVoterReward().add(halfAppeal)),
      );
    });

    it("correct rewards when: challenge successful, granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: appealer });
      await registry.grantAppeal(newsroomAddress, "", { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 1);
      const appealerBalanceBefore = await token.balanceOf(appealer);
      await registry.updateStatus(newsroomAddress);
      const appealerBalaceAfter = await token.balanceOf(appealer);
      expect(appealerBalaceAfter).to.be.bignumber.equal(
        appealerBalanceBefore.add(utils.paramConfig.appealFeeAmount),
        "appealer should have been refunded appeal fee",
      );
      const [, isWhitelisted, , unstakedDeposit] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with successful challenge if appeal granted and appeal not challenged",
      );
      const reward = utils.getChallengeReward();
      expect(unstakedDeposit).to.be.bignumber.equal(
        new BigNumber(minDeposit).add(reward).add(utils.getTotalVoterReward()), // add voter reward since there are no "winning voters" now, so everything goes to challenge winner
        "listing should have received reward",
      );
      await expect(registry.claimReward(pollID, "420", { from: voter })).to.eventually.be.rejectedWith(REVERTED);
    });

    it("correct rewards when: challenge unsuccessful, granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: appealer });
      await registry.grantAppeal(newsroomAddress, "", { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 1);
      const challengerBalanceBefore = await token.balanceOf(challenger);
      const appealerBalanceBefore = await token.balanceOf(appealer);
      await registry.updateStatus(newsroomAddress);
      const appealerBalaceAfter = await token.balanceOf(appealer);
      expect(appealerBalaceAfter).to.be.bignumber.equal(
        appealerBalanceBefore.add(utils.paramConfig.appealFeeAmount),
        "appealer should have been refunded appeal fee",
      );
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with unsuccessful challenge if appeal granted and appeal not challenged",
      );
      const challengerBalanceAfter = await token.balanceOf(challenger);
      expect(challengerBalanceAfter).to.be.bignumber.equal(
        challengerBalanceBefore
          .add(minDeposit)
          .add(utils.getChallengeReward())
          .add(utils.getTotalVoterReward()),
      );
      await expect(registry.claimReward(pollID, "420", { from: voter })).to.eventually.be.rejectedWith(REVERTED);
    });

    it("correct rewards when: challenge success, granted appeal, appeal challenge success", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: appealer });
      await registry.grantAppeal(newsroomAddress, "", { from: JAB });
      const pollID2 = await utils.simpleSuccessfulAppealChallenge(
        registry,
        newsroomAddress,
        challenger2,
        voter2,
        "123",
      );
      const challengerBalanceBefore = await token.balanceOf(challenger);
      const challenger2BalanceBefore = await token.balanceOf(challenger2);
      const appealerBalanceBefore = await token.balanceOf(appealer);
      const voterBalanceBefore = await token.balanceOf(voter);
      const voter2BalanceBefore = await token.balanceOf(voter2);

      await registry.updateStatus(newsroomAddress);
      const challengerBalanceAfter = await token.balanceOf(challenger);
      const challenger2BalanceAfter = await token.balanceOf(challenger2);
      const appealerBalanceAfter = await token.balanceOf(appealer);
      await registry.claimReward(pollID, "420", { from: voter });
      const voterBalanceAfter = await token.balanceOf(voter);
      expect(voterBalanceAfter).to.be.bignumber.equal(voterBalanceBefore.add(utils.getTotalVoterReward()));
      await registry.claimReward(pollID2, "123", { from: voter2 });
      const voter2BalanceAfter = await token.balanceOf(voter2);
      expect(voter2BalanceAfter).to.be.bignumber.equal(
        voter2BalanceBefore.add(utils.getTotalAppealChallengeVoterReward()),
      );
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with successful challenge, granted appeal, successful appeal challenge",
      );
      expect(appealerBalanceAfter).to.be.bignumber.equal(appealerBalanceBefore);
      expect(challengerBalanceAfter).to.be.bignumber.equal(
        challengerBalanceBefore.add(minDeposit).add(utils.getChallengeReward()),
      );
      expect(challenger2BalanceAfter).to.be.bignumber.equal(
        challenger2BalanceBefore.add(utils.paramConfig.appealFeeAmount).add(utils.getAppealChallengeReward()),
      );
    });
    it("correct rewards when: challenge success, granted appeal, appeal challenge failure", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: appealer });
      await registry.grantAppeal(newsroomAddress, "", { from: JAB });
      const pollID2 = await utils.simpleUnsuccessfulAppealChallenge(
        registry,
        newsroomAddress,
        challenger,
        voter2,
        "123",
      );
      const challengerBalanceBefore = await token.balanceOf(challenger);
      const challenger2BalanceBefore = await token.balanceOf(challenger2);
      const appealerBalanceBefore = await token.balanceOf(appealer);
      const voterBalanceBefore = await token.balanceOf(voter);
      const voter2BalanceBefore = await token.balanceOf(voter2);

      await registry.updateStatus(newsroomAddress);
      const challengerBalanceAfter = await token.balanceOf(challenger);
      const challenger2BalanceAfter = await token.balanceOf(challenger2);
      const appealerBalanceAfter = await token.balanceOf(appealer);
      await expect(registry.claimReward(pollID, "420", { from: voter })).to.eventually.be.rejectedWith(REVERTED);
      const voterBalanceAfter = await token.balanceOf(voter);
      expect(voterBalanceAfter).to.be.bignumber.equal(voterBalanceBefore);
      await registry.claimReward(pollID2, "123", { from: voter2 });
      const voter2BalanceAfter = await token.balanceOf(voter2);
      expect(voter2BalanceAfter).to.be.bignumber.equal(
        voter2BalanceBefore.add(utils.getTotalAppealChallengeVoterReward()),
      );
      const [, isWhitelisted, , unstakedDeposit] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with successful challenge, granted appeal, unsuccessful appeal challenge",
      );
      expect(unstakedDeposit).to.be.bignumber.equal(
        new BigNumber(minDeposit).add(utils.getChallengeReward()).add(utils.getTotalVoterReward()), // add voter reward since there are no "winning voters" now, so everything goes to challenge winner
        "listing should have received reward",
      );
      expect(appealerBalanceAfter).to.be.bignumber.equal(
        appealerBalanceBefore.add(utils.paramConfig.appealFeeAmount).add(utils.getAppealChallengeReward()),
      );
      expect(challengerBalanceAfter).to.be.bignumber.equal(challengerBalanceBefore);
      expect(challenger2BalanceAfter).to.be.bignumber.equal(challenger2BalanceBefore);
    });

    it("correct rewards when: challenge failure, granted appeal, appeal challenge success", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: appealer });
      await registry.grantAppeal(newsroomAddress, "", { from: JAB });
      const pollID2 = await utils.simpleSuccessfulAppealChallenge(
        registry,
        newsroomAddress,
        challenger2,
        voter2,
        "123",
      );
      const challengerBalanceBefore = await token.balanceOf(challenger);
      const challenger2BalanceBefore = await token.balanceOf(challenger2);
      const appealerBalanceBefore = await token.balanceOf(appealer);
      const voterBalanceBefore = await token.balanceOf(voter);
      const voter2BalanceBefore = await token.balanceOf(voter2);
      await registry.updateStatus(newsroomAddress);
      await registry.claimReward(pollID, "420", { from: voter });

      const voterBalanceAfter = await token.balanceOf(voter);
      await registry.claimReward(pollID2, "123", { from: voter2 });
      const voter2BalanceAfter = await token.balanceOf(voter2);
      const challengerBalanceAfter = await token.balanceOf(challenger);
      const challenger2BalanceAfter = await token.balanceOf(challenger2);
      const appealerBalanceAfter = await token.balanceOf(appealer);
      const [, isWhitelisted, , unstakedDeposit] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with unsuccessful challenge, granted appeal, successful appeal challenge",
      );
      expect(unstakedDeposit).to.be.bignumber.equal(
        new BigNumber(minDeposit).add(utils.getChallengeReward()),
        "listing should have received reward",
      );
      expect(appealerBalanceAfter).to.be.bignumber.equal(appealerBalanceBefore);
      expect(challengerBalanceAfter).to.be.bignumber.equal(challengerBalanceBefore);
      expect(challenger2BalanceAfter).to.be.bignumber.equal(
        challenger2BalanceBefore.add(utils.paramConfig.appealFeeAmount).add(utils.getAppealChallengeReward()),
      );
      expect(voterBalanceAfter).to.be.bignumber.equal(voterBalanceBefore.add(utils.getTotalVoterReward()));
      expect(voter2BalanceAfter).to.be.bignumber.equal(
        voter2BalanceBefore.add(utils.getTotalAppealChallengeVoterReward()),
      );
    });

    it("correct rewards when: challenge failure, granted appeal, appeal challenge failure", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter, "420");
      await registry.requestAppeal(newsroomAddress, "", { from: appealer });
      await registry.grantAppeal(newsroomAddress, "", { from: JAB });
      const pollID2 = await utils.simpleUnsuccessfulAppealChallenge(
        registry,
        newsroomAddress,
        challenger,
        voter2,
        "123",
      );
      const challengerBalanceBefore = await token.balanceOf(challenger);
      const challenger2BalanceBefore = await token.balanceOf(challenger2);
      const appealerBalanceBefore = await token.balanceOf(appealer);
      const voterBalanceBefore = await token.balanceOf(voter);
      const voter2BalanceBefore = await token.balanceOf(voter2);
      await registry.updateStatus(newsroomAddress);
      await expect(registry.claimReward(pollID, "420", { from: voter })).to.eventually.be.rejectedWith(REVERTED);

      const voterBalanceAfter = await token.balanceOf(voter);
      expect(voterBalanceAfter).to.be.bignumber.equal(voterBalanceBefore);
      await registry.claimReward(pollID2, "123", { from: voter2 });
      const voter2BalanceAfter = await token.balanceOf(voter2);
      const challengerBalanceAfter = await token.balanceOf(challenger);
      const challenger2BalanceAfter = await token.balanceOf(challenger2);
      const appealerBalanceAfter = await token.balanceOf(appealer);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with unsuccessful challenge, granted appeal, unsuccessful appeal challenge",
      );
      expect(appealerBalanceAfter).to.be.bignumber.equal(
        appealerBalanceBefore.add(utils.paramConfig.appealFeeAmount).add(utils.getAppealChallengeReward()),
      );
      expect(challengerBalanceAfter).to.be.bignumber.equal(
        challengerBalanceBefore
          .add(minDeposit)
          .add(utils.getChallengeReward())
          .add(utils.getTotalVoterReward()),
      );
      expect(challenger2BalanceAfter).to.be.bignumber.equal(challenger2BalanceBefore);
      expect(voter2BalanceAfter).to.be.bignumber.equal(
        voter2BalanceBefore.add(utils.getTotalAppealChallengeVoterReward()),
      );
    });
  });
});
