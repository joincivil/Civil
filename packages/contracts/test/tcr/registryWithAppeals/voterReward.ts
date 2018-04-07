import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");
const Newsroom = artifacts.require("Newsroom");

configureChai(chai);
const expect = chai.expect;

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry", (accounts) => {
  describe("Function: voterReward", () => {
    const [JAB, applicant, challenger, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);

      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("cannot call for majority voter if challenge is overturned", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.updateStatus(newsroomAddress, { from: applicant });

      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      const waitTime = Number(await registry.judgeAppealPhaseLength());
      await utils.advanceEvmTime(waitTime + 1);

      await registry.updateStatus(newsroomAddress);

      await expect(registry.voterReward(voterAlice, pollID, "42")).to.be.rejectedWith(REVERTED,
        "should have reverted since voter commit hash does not match winning hash for salt");
    });

    it("should return all tokens not reserved for applicant to the only " +
      "minority voter if there is only 1 and challenge is overturned on appeal", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
      await utils.commitVote(voting, pollID, "1", "30", "32", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
      await voting.revealVote(pollID, "1", "32  ", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.updateStatus(newsroomAddress, { from: applicant });

      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      const waitTime = Number(await registry.judgeAppealPhaseLength());
      await utils.advanceEvmTime(waitTime + 1);

      await registry.updateStatus(newsroomAddress);

      // Claim reward
      const bobReward = await registry.voterReward(voterBob, pollID, "32");
      const expectedBobReward = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit).mul(
          utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(100));

      expect(bobReward).to.be.bignumber.equal(expectedBobReward, "voterReward did not match expected reward");
    });
  });
});
