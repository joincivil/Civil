import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";
import { BN } from "bn.js";
import { REVERTED_CALL } from "../../utils/constants";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
utils.configureProviders(PLCRVoting);

configureChai(chai);
const expect = chai.expect;

const ZERO_DATA = "0x";

contract("Registry", accounts => {
  describe("Function: voterReward", () => {
    const [JAB, applicant, challenger, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);

      testNewsroom = await utils.createDummyNewsrom(applicant);
      newsroomAddress = testNewsroom.address;
    });

    it("cannot call for majority voter if challenge is overturned", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "42", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
      const waitTime = utils.paramConfig.judgeAppealPhaseLength + 1;
      await utils.advanceEvmTime(waitTime);

      await registry.updateStatus(newsroomAddress);

      expect(registry.voterReward(voterAlice, pollID, "42")).to.eventually.be.rejectedWith(REVERTED_CALL);
    });

    it(
      "should return all tokens not reserved for applicant to the only " +
        "minority voter if there is only 1 and challenge is overturned on appeal",
      async () => {
        await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

        // Challenge
        const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

        await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
        await utils.commitVote(voting, pollID, "1", "30", "32", voterBob);
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

        await voting.revealVote(pollID, "0", "42", { from: voterAlice });
        await voting.revealVote(pollID, "1", "32", { from: voterBob });
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

        await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
        await registry.grantAppeal(newsroomAddress, ZERO_DATA, { from: JAB });
        const waitTime = utils.paramConfig.judgeAppealPhaseLength + 1;
        await utils.advanceEvmTime(waitTime);

        await registry.updateStatus(newsroomAddress);

        // Claim reward
        const bobReward = await registry.voterReward(voterBob, pollID, "32");
        const expectedBobReward = utils
          .toBaseTenBigNumber(utils.paramConfig.minDeposit)
          .mul(new BN(utils.paramConfig.dispensationPct))
          .div(new BN(100));

        expect(bobReward).to.be.bignumber.equal(expectedBobReward, "voterReward did not match expected reward");
      },
    );

    it("should return extra tokens to majority voter if appeal not granted", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "50", "42", voterAlice);
      await utils.commitVote(voting, pollID, "1", "30", "32", voterBob);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "42", { from: voterAlice });
      await voting.revealVote(pollID, "1", "32", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, ZERO_DATA, { from: applicant });
      const waitTime = utils.paramConfig.judgeAppealPhaseLength + 1;
      await utils.advanceEvmTime(waitTime);

      await registry.updateStatus(newsroomAddress);

      const aliceReward = await registry.voterReward(voterAlice, pollID, "42");
      const expectedAliceReward = utils
        .toBaseTenBigNumber(utils.paramConfig.minDeposit)
        .mul(new BN(utils.paramConfig.dispensationPct))
        .div(new BN(100))
        .add(utils.toBaseTenBigNumber(utils.paramConfig.appealFeeAmount).div(new BN(2)));

      expect(aliceReward).to.be.bignumber.equal(expectedAliceReward, "voterReward did not match expected reward");

      // Claim reward
      expect(registry.voterReward(voterBob, pollID, "32")).to.eventually.be.rejectedWith(REVERTED_CALL);
    });
  });
});
