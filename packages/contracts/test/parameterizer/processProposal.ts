import BN from "bignumber.js";
import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import {  advanceEvmTime,
          commitVote,
          // createTestParameterizerInstance,
          multiplyByPercentage,
          paramConfig,
        } from "../utils/contractutils";

const Parameterizer = artifacts.require("Parameterizer");
const PLCRVoting = artifacts.require("PLCRVoting");
const Token = artifacts.require("EIP20.sol");

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts) => {
  describe("processProposal", () => {
    const [proposer, challenger, voter] = accounts;
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

    it("should set new parameters if a proposal went unchallenged", async () => {
      const receipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      await advanceEvmTime(paramConfig.pApplyStageLength + 1, accounts[0]);

      const { propID } = receipt.logs[0].args;
      await parameterizer.processProposal(propID);

      const voteQuorum = await parameterizer.get("voteQuorum");
      expect(voteQuorum.toString(10)).to.be.equal(
        "51",
        "A proposal which went unchallenged failed to update its parameter",
      );
    });

    it("should not set new parameters if a proposal\'s processBy date has passed", async () => {
      const receipt = await parameterizer.proposeReparameterization("voteQuorum", "69", { from: proposer });

      const { propID } = receipt.logs[0].args;
      const paramProp = await parameterizer.proposals(propID);
      const processBy = paramProp[5];
      await advanceEvmTime(processBy.toNumber() + 1, accounts[0]);

      await parameterizer.processProposal(propID);

      const voteQuorum = await parameterizer.get("voteQuorum");
      expect(voteQuorum).to.be.bignumber.equal(
        "51",
        "A proposal whose processBy date passed was able to update the parameterizer",
      );
    });

    it("should not set new parameters if a proposal\'s processBy date has passed, " +
    "but should resolve any challenges against the domain", async () => {
      const proposerStartingBalance = await token.balanceOf(proposer);
      const challengerStartingBalance = await token.balanceOf(challenger);

      const receipt = await parameterizer.proposeReparameterization("voteQuorum", "69", { from: proposer });

      const { propID } = receipt.logs[0].args;

      const challengeReceipt =
        await parameterizer.challengeReparameterization(propID, { from: challenger });

      const { pollID } = challengeReceipt.logs[0].args;
      await commitVote(voting, pollID, "0", "10", "420", voter);
      await advanceEvmTime(paramConfig.pCommitStageLength + 1, accounts[0]);

      await voting.revealVote(pollID, "0", "420", { from: voter });

      const paramProp = await parameterizer.proposals(propID);
      const processBy = paramProp[5];
      await advanceEvmTime(processBy.toNumber() + 1, accounts[0]);

      await parameterizer.processProposal(propID);

      const voteQuorum = await parameterizer.get("voteQuorum");
      expect(voteQuorum).to.be.bignumber.equal(
        "51",
        "A proposal whose processBy date passed was able to update the parameterizer",
      );

      const proposerFinalBalance = await token.balanceOf(proposer);
      const proposerExpected = proposerStartingBalance.sub(new BN(paramConfig.pMinDeposit, 10));
      expect(proposerFinalBalance).to.be.bignumber.equal(
        proposerExpected,
        "The challenge loser\'s token balance is not as expected",
      );

      const challengerFinalBalance = await token.balanceOf.call(challenger);
      const winnings =
        multiplyByPercentage(paramConfig.pMinDeposit, paramConfig.pDispensationPct);
      const challengerExpected = challengerStartingBalance.add(winnings);
      expect(challengerFinalBalance).to.be.bignumber.equal(
        challengerExpected,
        "The challenge winner\'s token balance is not as expected",
      );
    });
  });
});
