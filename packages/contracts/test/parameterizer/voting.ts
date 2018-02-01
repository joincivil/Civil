import BN from "bignumber.js";
import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");

ChaiConfig();
const expect = chai.expect;

contract("PLCRVoting", (accounts) => {
  describe("Function: commitVote", () => {
    const [applicant, challenger, voter, applicant2] = accounts;
    const listingAddress1 = "0x1a5cdcFBA600e0c669795e0B65c344D5A37a4d5A";
    const listingAddress2 = "0x2a5cdcFBA600e0c669795e0B65c344D5A37a4d5A";
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should correctly update DLL state", async () => {
      const minDeposit = new BN(utils.paramConfig.minDeposit, 10);

      await registry.apply(listingAddress1, minDeposit, "", { from: applicant });
      await registry.apply(listingAddress2, minDeposit, "", { from: applicant2 });

      const firstChallengeReceipt = await registry.challenge(listingAddress1, "", { from: challenger });
      const firstPollID = firstChallengeReceipt.logs[0].args.pollID;
      const secondChallengeReceipt = await registry.challenge(listingAddress2, "", { from: challenger });
      const secondPollID = secondChallengeReceipt.logs[0].args.pollID;

      await utils.commitVote(voting, firstPollID, "1", "7", "420", voter);
      await utils.commitVote(voting, secondPollID, "1", "8", "420", voter);
      await utils.commitVote(voting, firstPollID, "1", "9", "420", voter);

      const insertPoint = await voting.getInsertPointForNumTokens(voter, 6);
      const expectedInsertPoint = 0;

      expect(insertPoint).to.be.bignumber.equal(
        expectedInsertPoint,
        "The insert point was not correct",
      );
    });
  });
});
