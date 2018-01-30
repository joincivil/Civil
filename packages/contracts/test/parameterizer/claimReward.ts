import BN from "bignumber.js";
import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import {  advanceEvmTime,
          commitVote,
          // createTestParameterizerInstance,
          isEVMException,
          multiplyByPercentage,
          paramConfig,
        } from "../utils/contractutils";

const Parameterizer = artifacts.require("Parameterizer");
const PLCRVoting = artifacts.require("PLCRVoting");
const Token = artifacts.require("EIP20.sol");

ChaiConfig();
const expect = chai.expect;

const bigTen = (numberparam: number) => new BN(numberparam.toString(10), 10);

contract("Parameterizer", (accounts) => {
  describe("claimReward", () => {
    const [proposer, challenger, voterAlice, voterBob] = accounts;
    let parameterizer: any;
    let voting: any;
    let token: any;

    before(async () => {
      // await createTestParameterizerInstance(accounts);
      parameterizer = await Parameterizer.deployed();
      voting = await PLCRVoting.deployed();
      const tokenAddress = await parameterizer.token();
      token = await Token.at(tokenAddress);
    });

    it("should give the correct number of tokens to a voter on the winning side.", async () => {
      const voterAliceStartingBalance = await token.balanceOf(voterAlice);

      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt =
        await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.pollID;

      await commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await advanceEvmTime(paramConfig.pCommitStageLength + 1, accounts[0]);

      await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
      await advanceEvmTime(paramConfig.pRevealStageLength + 1, accounts[0]);

      await parameterizer.processProposal(propID);

      await parameterizer.claimReward(challengeID, "420", { from: voterAlice });
      await voting.withdrawVotingRights("10", { from: voterAlice });

      const voterAliceFinalBalance = await token.balanceOf.call(voterAlice);
      const voterAliceExpected = voterAliceStartingBalance.add(multiplyByPercentage(
        paramConfig.pMinDeposit,
        bigTen(100).sub(bigTen(paramConfig.pDispensationPct)).toNumber(),
      ));
      expect(voterAliceFinalBalance).to.be.bignumber.equal(voterAliceExpected);
    });

    it("should give the correct number of tokens to multiple voters on the winning side.", async () => {
        const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "52", { from: proposer });

        const { propID } = proposalReceipt.logs[0].args;

        const challengeReceipt =
          await parameterizer.challengeReparameterization(propID, { from: challenger });

        const challengeID = challengeReceipt.logs[0].args.pollID;

        await commitVote(voting, challengeID, "1", "10", "420", voterAlice);
        await commitVote(voting, challengeID, "1", "20", "420", voterBob);
        await advanceEvmTime(paramConfig.pCommitStageLength + 1, accounts[0]);

        await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
        await voting.revealVote(challengeID, "1", "420", { from: voterBob });
        await advanceEvmTime(paramConfig.pRevealStageLength + 1, accounts[0]);

        await parameterizer.processProposal(propID);

        const voterAliceReward = await parameterizer.voterReward.call(
          voterAlice,
          challengeID, "420",
        );
        await parameterizer.claimReward(challengeID, "420", { from: voterAlice });
        await voting.withdrawVotingRights("10", { from: voterAlice });

        const voterBobReward = await parameterizer.voterReward.call(
          voterBob,
          challengeID, "420",
        );
        await parameterizer.claimReward(challengeID, "420", { from: voterBob });
        await voting.withdrawVotingRights("20", { from: voterBob });

        // TODO: do better than approximately.
        expect(voterBobReward.toNumber(10)).to.be.closeTo(
          voterAliceReward.mul(new BN("2", 10)).toNumber(10),
          2,
          "Rewards were not properly distributed between voters",
        );
        // TODO: add asserts for final balances
      },
    );

    it("should not transfer tokens for an unresolved challenge", async () => {
      const proposerStartingBalance = await token.balanceOf(proposer);
      const aliceStartingBalance = await token.balanceOf(voterAlice);

      const proposalReceipt = await parameterizer.proposeReparameterization("pMinDeposit", "5000", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt =
        await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.pollID;

      await commitVote(voting, challengeID, "1", "10", "420", voterAlice);
      await advanceEvmTime(paramConfig.pCommitStageLength + 1, accounts[0]);

      await voting.revealVote(challengeID, "1", "420", { from: voterAlice });
      await advanceEvmTime(paramConfig.pRevealStageLength + 1, accounts[0]);

      try {
        await parameterizer.claimReward(challengeID, "420", { from: voterAlice });
        expect(true).to.be.false("should not have been able to claimReward for unresolved challenge");
      } catch (err) {
        expect(isEVMException(err)).to.be.true(err.toString());
      }

      const proposerEndingBalance = await token.balanceOf.call(proposer);
      const proposerExpected = proposerStartingBalance.sub(bigTen(paramConfig.pMinDeposit));
      const aliceEndingBalance = await token.balanceOf.call(voterAlice);
      const aliceExpected = aliceStartingBalance.sub(bigTen(10));

      expect(proposerEndingBalance).to.be.bignumber.equal(
        proposerExpected,
        "proposers ending balance is incorrect",
      );
      expect(aliceEndingBalance).to.be.bignumber.equal(
        aliceExpected,
        "alices ending balance is incorrect",
      );
    });

    // it("should give zero tokens to a voter who cannot reveal a vote on the winning side.");
  });
});
