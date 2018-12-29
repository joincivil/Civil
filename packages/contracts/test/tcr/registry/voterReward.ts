import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const Token = artifacts.require("EIP20");
const PLCRVoting = artifacts.require("PLCRVoting");
utils.configureProviders(PLCRVoting);

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("voter reward", () => {
    const [applicant, challenger, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const listing8 = "0x0000000000000000000000000000000000000008";
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const tokenAddress = await registry.token();
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should transfer the correct number of tokens once a challenge has been resolved", async () => {
      // Apply
      await registry.apply(listing8, minDeposit, "", { from: applicant });

      // Challenge
      const pollID = await utils.challengeAndGetPollID(listing8, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.commitVote(voting, pollID, "1", "50", "420", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await voting.revealVote(pollID, "1", "420", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      // Update status
      await registry.updateStatus(listing8, { from: applicant });

      // Alice claims reward
      const aliceVoterReward = await registry.voterReward(voterAlice, pollID);
      const bobVoterReward = await registry.voterReward(voterBob, pollID);

      expect(bobVoterReward).to.be.bignumber.equal(0, "loser should not have been rewarded at all");
      expect(aliceVoterReward).to.be.bignumber.equal(minDeposit.div(2), "winner should have been rewarded");
    });
  });
});
