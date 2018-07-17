import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
const Token = artifacts.require("EIP20.sol");

configureChai(chai);
const expect = chai.expect;

contract("Parameterizer", accounts => {
  describe("Function: claimReward", () => {
    const [proposer, challenger, voterAlice, voterBob] = accounts;
    let parameterizer: any;
    let voting: any;
    let token: any;

    beforeEach(async () => {
      parameterizer = await utils.createAllTestParameterizerInstance(accounts);
      const votingAddress = await parameterizer.voting();
      voting = await PLCRVoting.at(votingAddress);
      const tokenAddress = await parameterizer.token();
      token = await Token.at(tokenAddress);
    });

    it("should give the correct number of tokens to a voter on the winning side.", async () => {
      const voterAliceStartingBalance = await token.balanceOf(voterAlice);

      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await parameterizer.processProposal(propID);

      await parameterizer.claimReward(challengeID, "420", { from: voterAlice });
      await voting.withdrawVotingRights("10", { from: voterAlice });

      const voterAliceFinalBalance = await token.balanceOf.call(voterAlice);
      const voterAliceExpected = voterAliceStartingBalance.add(
        utils.multiplyByPercentage(
          utils.paramConfig.pMinDeposit,
          utils
            .toBaseTenBigNumber(100)
            .sub(utils.toBaseTenBigNumber(utils.paramConfig.pDispensationPct))
            .toNumber(),
        ),
      );
      expect(voterAliceFinalBalance).to.be.bignumber.equal(voterAliceExpected);
    });

    it("should give the correct number of tokens to multiple voters on the winning side.", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "52", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await utils.commitVote(voting, challengeID, "1", "20", "420", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
      await voting.revealVote(challengeID, "1", "420", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await parameterizer.processProposal(propID);

      const voterAliceReward = await parameterizer.voterReward.call(voterAlice, challengeID, "420");
      await parameterizer.claimReward(challengeID, "420", { from: voterAlice });
      await voting.withdrawVotingRights("10", { from: voterAlice });

      const voterBobReward = await parameterizer.voterReward.call(voterBob, challengeID, "420");
      await parameterizer.claimReward(challengeID, "420", { from: voterBob });
      await voting.withdrawVotingRights("20", { from: voterBob });

      // TODO: do better than approximately.
      expect(voterBobReward.toNumber(10)).to.be.closeTo(
        voterAliceReward.mul(utils.toBaseTenBigNumber(2)).toNumber(10),
        2,
        "Rewards were not properly distributed between voters",
      );
      // TODO: add asserts for final balances
    });

    it("should not transfer tokens for an unresolved challenge", async () => {
      const proposerStartingBalance = await token.balanceOf(proposer);
      const aliceStartingBalance = await token.balanceOf(voterAlice);

      const proposalReceipt = await parameterizer.proposeReparameterization("pMinDeposit", "5000", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await expect(parameterizer.claimReward(challengeID, "420", { from: voterAlice })).to.eventually.be.rejectedWith(
        REVERTED,
      );

      const proposerEndingBalance = await token.balanceOf.call(proposer);
      const proposerExpected = proposerStartingBalance.sub(utils.toBaseTenBigNumber(utils.paramConfig.pMinDeposit));
      const aliceEndingBalance = await token.balanceOf.call(voterAlice);
      const aliceExpected = aliceStartingBalance.sub(utils.toBaseTenBigNumber(10));

      expect(proposerEndingBalance).to.be.bignumber.equal(proposerExpected, "proposers ending balance is incorrect");
      expect(aliceEndingBalance).to.be.bignumber.equal(aliceExpected, "alices ending balance is incorrect");
    });

    // it("should give zero tokens to a voter who cannot reveal a vote on the winning side.");
  });
});
