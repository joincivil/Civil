import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");
const Newsroom = artifacts.require("Newsroom");

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: voterReward", () => {
    const [JAB, applicant, challenger, voterAlice] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let voting: any;
    let testNewsroom: any;
    let address: string;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);

      testNewsroom = await Newsroom.new({ from: applicant });
      address = testNewsroom.address;
    });

    it("cannot call for majority voter if challenge is overturned", async () => {
      await utils.addToWhitelist(address, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(address, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.updateStatus(address, { from: applicant });

      await registry.requestAppeal(address, { from: applicant });
      await registry.grantAppeal(address, { from: JAB });
      await utils.advanceEvmTime(1209620);

      await registry.resolvePostAppealPhase(address);

      await expect(registry.voterReward(voterAlice, pollID, "42")).to.be.rejectedWith(REVERTED,
        "should have reverted since voter commit hash does not match winning hash for salt");
    });
  });
});
