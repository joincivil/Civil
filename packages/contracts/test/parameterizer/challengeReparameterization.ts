import BN from "bignumber.js";
import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const Parameterizer = artifacts.require("Parameterizer");
const PLCRVoting = artifacts.require("PLCRVoting");
const Token = artifacts.require("EIP20.sol");

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts) => {
  describe("Function: challengeReparameterization", () => {
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

    it("should leave parameters unchanged if a proposal loses a challenge", async () => {
      const proposerStartingBalance = await token.balanceOf(proposer);
      const challengerStartingBalance = await token.balanceOf(challenger);

      const receipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = receipt.logs[0].args;

      await parameterizer.challengeReparameterization(propID, { from: challenger });

      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + utils.paramConfig.pRevealStageLength + 1);

      await parameterizer.processProposal(propID);

      const voteQuorum = await parameterizer.get("voteQuorum");
      expect(voteQuorum).to.be.bignumber.equal("50");

      const proposerFinalBalance = await token.balanceOf(proposer);
      const proposerExpected = proposerStartingBalance.sub(new BN(utils.paramConfig.pMinDeposit, 10));
      expect(proposerFinalBalance).to.be.bignumber.equal(proposerExpected);

      // Edge case, challenger gets both deposits back because there were no voters
      const challengerFinalBalance = await token.balanceOf(challenger);
      const challengerExpected = challengerStartingBalance.add(new BN(utils.paramConfig.pMinDeposit, 10));
      expect(challengerFinalBalance).to.be.bignumber.equal(challengerExpected);
    });

    it("should set new parameters if a proposal wins a challenge", async () => {
      const proposerStartingBalance = await token.balanceOf(proposer);
      const challengerStartingBalance = await token.balanceOf(challenger);

      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });
      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt =
        await parameterizer.challengeReparameterization(propID, { from: challenger });
      const challengeID = challengeReceipt.logs[0].args.pollID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength + 1);

      await voting.revealVote(challengeID, "1", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      await parameterizer.processProposal(propID);

      const voteQuorum = await parameterizer.get("voteQuorum");
      expect(voteQuorum).to.be.bignumber.equal("51");

      const proposerFinalBalance = await token.balanceOf(proposer);
      const winnings = utils.multiplyByPercentage(utils.paramConfig.pMinDeposit, utils.paramConfig.pDispensationPct);
      const proposerExpected = proposerStartingBalance.add(winnings);
      expect(proposerFinalBalance).to.be.bignumber.equal(proposerExpected);

      const challengerFinalBalance = await token.balanceOf(challenger);
      const challengerExpected = challengerStartingBalance.sub(new BN(utils.paramConfig.pMinDeposit, 10));
      expect(challengerFinalBalance).to.be.bignumber.equal(challengerExpected);
    });
  });
});
