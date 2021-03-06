import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";
import { BN } from "bn.js";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
const Token = artifacts.require("CVLToken");
utils.configureProviders(PLCRVoting, Token);
configureChai(chai);
const expect = chai.expect;

const ZERO_DATA = "0x";

contract("Registry with Appeals", accounts => {
  describe("Function: claimAppealChallengeReward", () => {
    const [JAB, applicant, challenger, challenger2, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let voting: any;
    let token: any;
    let testNewsroom: any;
    let newsroomAddress: string;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
      const tokenAddress = await registry.token();
      token = await Token.at(tokenAddress);
      testNewsroom = await utils.createDummyNewsrom(applicant);
      newsroomAddress = testNewsroom.address;
    });

    it("should transfer the correct number of tokens once an appeal challenge has been resolved", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });

      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      const appealChallengePollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengePollID, "1", "500", "1337", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengePollID, "1", "1337", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      await expect(registry.claimReward(appealChallengePollID, "1337", { from: voterBob })).to.eventually.be.fulfilled(
        "should have allowed voter in appeal challenge poll to claim reward after appeal challenge resolved",
      );
    });

    it("should transfer the correct number of tokens once an appeal challenge has been resolved that had no votes", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });

      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      await utils.challengeAppealAndGetPollID(newsroomAddress, challenger2, registry);

      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      const challenger2BalanceBefore = await token.balanceOf(challenger2);
      const appealerBalanceBefore = await token.balanceOf(voterBob);
      await registry.updateStatus(newsroomAddress);

      const challenger2BalanceAfter = await token.balanceOf(challenger2);
      const appealerBalanceAfter = await token.balanceOf(voterBob);

      expect(challenger2BalanceAfter).to.be.bignumber.equal(
        challenger2BalanceBefore,
        "appealer should not have gained money from losing",
      );
      const expected = appealerBalanceBefore.add(new BN(utils.paramConfig.appealFeeAmount).mul(new BN(2)));

      expect(appealerBalanceAfter).to.be.bignumber.equal(
        expected,
        "appeal challenger should have received both deposits",
      );
    });

    it("should transfer the correct number of tokens once an appeal challenge has been resolved with different amount of votes in each", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });

      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      const appealChallengePollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengePollID, "1", "50", "1337", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengePollID, "1", "1337", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      const balanceBeforeClaiming = await token.balanceOf(voterBob);
      await expect(registry.claimReward(appealChallengePollID, "1337", { from: voterBob })).to.eventually.be.fulfilled(
        "should have allowed voter in appeal challenge poll to claim reward after appeal challenge resolved",
      );
      const balanceAfterClaiming = await token.balanceOf(voterBob);
      const reward = new BN(100)
        .sub(new BN(utils.paramConfig.appealSupermajorityPercentage))
        .mul(new BN(utils.paramConfig.appealFeeAmount))
        .div(new BN(100));
      const expectedEndingBalance = balanceBeforeClaiming.add(reward);
      expect(expectedEndingBalance).to.be.bignumber.equal(balanceAfterClaiming);
    });

    it("should transfer the correct number of tokens once an appeal challenge has been resolved with different amount of votes in each", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });

      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      const appealChallengePollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengePollID, "0", "50", "1337", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengePollID, "0", "1337", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      const balanceBeforeClaiming = await token.balanceOf(voterBob);
      await expect(registry.claimReward(appealChallengePollID, "1337", { from: voterBob })).to.eventually.be.fulfilled(
        "should have allowed voter in appeal challenge poll to claim reward after appeal challenge resolved",
      );
      const balanceAfterClaiming = await token.balanceOf(voterBob);
      const reward = new BN(100)
        .sub(new BN(utils.paramConfig.appealSupermajorityPercentage))
        .mul(new BN(utils.paramConfig.appealFeeAmount))
        .div(new BN(100));
      const expectedEndingBalance = balanceBeforeClaiming.add(reward);
      expect(expectedEndingBalance).to.be.bignumber.equal(balanceAfterClaiming);
    });

    it("should transfer the correct number of tokens once an appeal challenge has been resolved with different amount of votes in each challenge and 2 voters each", async () => {
      await registry.apply(newsroomAddress, minDeposit, ZERO_DATA, { from: applicant });

      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.commitVote(voting, pollID, "0", "500", "123", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await voting.revealVote(pollID, "0", "123", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      const appealChallengePollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengePollID, "1", "50", "1337", voterBob);
      await utils.commitVote(voting, appealChallengePollID, "1", "450", "420420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengePollID, "1", "1337", { from: voterBob });
      await voting.revealVote(appealChallengePollID, "1", "420420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.updateStatus(newsroomAddress);

      const balanceBeforeClaiming = await token.balanceOf(voterBob);
      await expect(registry.claimReward(appealChallengePollID, "1337", { from: voterBob })).to.eventually.be.fulfilled(
        "should have allowed voter in appeal challenge poll to claim reward after appeal challenge resolved",
      );
      const balanceAfterClaiming = await token.balanceOf(voterBob);

      const appealAmount = new BN(utils.paramConfig.appealFeeAmount);
      const superMajorityPercent = new BN(utils.paramConfig.appealSupermajorityPercentage);
      const hundred = new BN(100);

      const reward = hundred
        .sub(superMajorityPercent)
        .mul(appealAmount)
        .div(hundred)
        .div(new BN(10));

      // const reward = new BN(100)
      //   .sub()
      //   .mul(new BN(utils.paramConfig.appealFeeAmount))
      //   .div(new BN(100))
      //   .mul(new BN(50).div(new BN(500)));
      const expectedEndingBalance = balanceBeforeClaiming.add(reward);
      expect(expectedEndingBalance).to.be.bignumber.equal(balanceAfterClaiming);
    });

    it("should revert if appeal challenge does not exist", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      const nonPollID = "666";
      await expect(registry.claimReward(nonPollID, "420", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
      );
    });
  });
});
