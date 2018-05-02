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

contract("Registry", accounts => {
  describe("Function: claimAppealChallengeReward", () => {
    const [JAB, applicant, challenger, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let token: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const tokenAddress = await registry.token();
      token = await Token.at(tokenAddress);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);

      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should transfer the correct number of tokens once an appeal challenge has been resolved", async () => {
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

      await registry.requestAppeal(newsroomAddress, { from: voterBob });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      const appealChallengePollID = await utils.challengeAppealAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, appealChallengePollID, "0", "500", "1337", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeCommitStageLength + 1);
      await voting.revealVote(appealChallengePollID, "0", "1337", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.appealChallengeRevealStageLength + 1);

      await registry.resolveAppealChallenge(newsroomAddress);
      // Alice claims reward
      const aliceVoterReward = await registry.voterReward(voterAlice, pollID, "420");
      await registry.claimReward(pollID, "420", { from: voterAlice });

      // Alice withdraws her voting rights
      await voting.withdrawVotingRights("500", { from: voterAlice });

      const aliceExpected = aliceStartingBalance.add(aliceVoterReward);
      const aliceFinalBalance = await token.balanceOf(voterAlice);

      expect(aliceFinalBalance).to.be.bignumber.equal(
        aliceExpected,
        "alice should have the same balance as she started",
      );
    });

    it("should revert if appeal challenge does not exist", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      const nonPollID = "666";
      await expect(
        registry.claimAppealChallengeReward(nonPollID, "420", { from: voterAlice }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });
  });
});
