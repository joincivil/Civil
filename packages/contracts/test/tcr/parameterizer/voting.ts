import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";
import { BN } from "bn.js";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
utils.configureProviders(PLCRVoting);
const ZERO_DATA = "0x";

configureChai(chai);
const expect = chai.expect;

contract("PLCRVoting", accounts => {
  describe("Function: commitVote", () => {
    const [applicant, challenger, voter, applicant2] = accounts;
    const listingAddress1 = "0x1a5cdcFBA600e0c669795e0B65c344D5A37a4d5A";
    const listingAddress2 = "0x2a5cDcfBa600e0c669795e0B65C344d5a37A4D5A";
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should correctly update DLL state", async () => {
      const minDeposit = new BN(utils.paramConfig.minDeposit);

      await registry.apply(listingAddress1, minDeposit, ZERO_DATA, { from: applicant });
      await registry.apply(listingAddress2, minDeposit, ZERO_DATA, { from: applicant2 });

      const firstChallengeReceipt = await registry.challenge(listingAddress1, ZERO_DATA, { from: challenger });
      const firstPollID = firstChallengeReceipt.logs[0].args.challengeID;
      const secondChallengeReceipt = await registry.challenge(listingAddress2, ZERO_DATA, { from: challenger });
      const secondPollID = secondChallengeReceipt.logs[0].args.challengeID;

      await utils.commitVote(voting, firstPollID, "1", "7", "420", voter);
      await utils.commitVote(voting, secondPollID, "1", "8", "420", voter);
      await utils.commitVote(voting, firstPollID, "1", "9", "420", voter);

      const insertPoint = await voting.getInsertPointForNumTokens(voter, 6, secondPollID);
      const expectedInsertPoint = 0;

      expect(insertPoint).to.be.bignumber.equal(expectedInsertPoint, "The insert point was not correct");
    });
  });
});
