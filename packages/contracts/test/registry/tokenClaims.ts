import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: tokenClaims", () => {
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const [applicant, challenger, voter] = accounts;
    const listing20 = "0x0000000000000000000000000000000000000020";
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should report properly whether a voter has claimed tokens", async () => {
      await utils.addToWhitelist(listing20, minDeposit, applicant, registry);

      const pollID = await utils.challengeAndGetPollID(listing20, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.updateStatus(listing20, { from: challenger });

      const initialHasClaimed = await registry.tokenClaims(pollID, voter);
      expect(initialHasClaimed).to.be.false("The voter is purported to have claimed " +
        "their reward, when in fact they have not");

      await registry.claimReward(pollID, "420", { from: voter });

      const finalHasClaimed = await registry.tokenClaims.call(pollID, voter);
      expect(finalHasClaimed).to.be.true("The voter is purported to not have claimed " +
        "their reward, when in fact they have");
    });
  });
});
