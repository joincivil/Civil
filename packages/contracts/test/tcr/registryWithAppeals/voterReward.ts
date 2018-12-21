import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
utils.configureProviders(PLCRVoting);

configureChai(chai);
const expect = chai.expect;

contract("Registry with appeals", accounts => {
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

      await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, "", { from: applicant });
      await registry.grantAppeal(newsroomAddress, "", { from: JAB });
      const waitTime = utils.paramConfig.judgeAppealPhaseLength + 1;
      await utils.advanceEvmTime(waitTime);

      await registry.updateStatus(newsroomAddress);

      expect(await registry.voterReward(voterAlice, pollID)).to.be.bignumber.equal(
        0,
        "should have returned false since voter commit hash does not match winning hash for salt",
      );
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

        await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
        await voting.revealVote(pollID, "1", "32  ", { from: voterBob });
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

        await registry.requestAppeal(newsroomAddress, "", { from: applicant });
        await registry.grantAppeal(newsroomAddress, "", { from: JAB });
        const waitTime = utils.paramConfig.judgeAppealPhaseLength + 1;
        await utils.advanceEvmTime(waitTime);

        await registry.updateStatus(newsroomAddress);

        // Claim reward
        const bobReward = await registry.voterReward(voterBob, pollID);
        const expectedBobReward = utils
          .toBaseTenBigNumber(utils.paramConfig.minDeposit)
          .mul(utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(100));

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

      await voting.revealVote(pollID, "0", "42  ", { from: voterAlice });
      await voting.revealVote(pollID, "1", "32  ", { from: voterBob });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.requestAppeal(newsroomAddress, "", { from: applicant });
      const waitTime = utils.paramConfig.judgeAppealPhaseLength + 1;
      await utils.advanceEvmTime(waitTime);

      await registry.updateStatus(newsroomAddress);

      // Claim reward
      expect(registry.voterReward(voterBob, pollID)).to.eventually.be.bignumber.equal(
        0,
        "minority voter should not have any reward since appeal not granted",
      );

      const aliceReward = await registry.voterReward(voterAlice, pollID);
      const expectedAliceReward = utils
        .toBaseTenBigNumber(utils.paramConfig.minDeposit)
        .mul(utils.toBaseTenBigNumber(utils.paramConfig.dispensationPct).div(100))
        .add(utils.toBaseTenBigNumber(utils.paramConfig.appealFeeAmount).div(2));

      expect(aliceReward).to.be.bignumber.equal(expectedAliceReward, "voterReward did not match expected reward");
    });
  });
});
