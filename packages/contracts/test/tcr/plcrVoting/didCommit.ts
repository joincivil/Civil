import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
utils.configureProviders(PLCRVoting);

configureChai(chai);
const expect = chai.expect;

contract("PLCRVoting", accounts => {
  describe("Function: didCommit", () => {
    const [proposer, challenger, voterAlice] = accounts;
    let parameterizer: any;
    let voting: any;

    beforeEach(async () => {
      parameterizer = await utils.createAllTestParameterizerInstance(accounts);
      const votingAddress = await parameterizer.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should return false if poll does not exists.", async () => {
      await expect(voting.didCommit(voterAlice, 123)).to.eventually.be.false();
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
