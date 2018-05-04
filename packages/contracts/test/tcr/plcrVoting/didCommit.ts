import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");
const Token = artifacts.require("EIP20.sol");

configureChai(chai);
const expect = chai.expect;

contract("PLCRVoting", accounts => {
  describe("Function: didCommit", () => {
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

    it("should revert if poll does not exists.", async () => {
      await expect(voting.didCommit(voterAlice, 123)).to.eventually.be.rejectedWith(
        REVERTED,
        "should have reverted if poll did not exist",
      );
    });

    it("should return false before vote committed", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      const didCommit = await voting.didCommit(voterAlice, challengeID);
      expect(didCommit).to.be.false("didCommit should have returned false before vote committed");
    });

    it("should return true after vote committed", async () => {
      const proposalReceipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const { propID } = proposalReceipt.logs[0].args;

      const challengeReceipt = await parameterizer.challengeReparameterization(propID, { from: challenger });

      const challengeID = challengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, challengeID, "1", "10", "420", voterAlice);

      const didCommit = await voting.didCommit(voterAlice, challengeID);
      expect(didCommit).to.be.true("didCommit should have returned true after vote committed");
    });
  });
});
