import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
utils.configureProviders(PLCRVoting);

configureChai(chai);
const expect = chai.expect;
const ZERO_DATA = "0x";

contract("Registry", accounts => {
  describe("Function: claimReward", () => {
    const [applicant, challenger, voterAlice] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const listing8 = "0x0000000000000000000000000000000000000008";
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should transfer the correct number of tokens once a challenge has been resolved", async () => {
      await registry.apply(listing8, minDeposit, ZERO_DATA, { from: applicant });

      const pollID = await utils.challengeAndGetPollID(listing8, challenger, registry);

      await utils.commitVote(voting, pollID, "0", "500", "420", voterAlice);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);

      await voting.revealVote(pollID, "0", "420", { from: voterAlice });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);

      await registry.updateStatus(listing8, { from: applicant });

      const hasClaimedBefore = await registry.tokenClaims(pollID, voterAlice);
      expect(hasClaimedBefore).to.be.false("tokenClaims should have been false before tokens claimed");
      await registry.claimReward(pollID, "420", { from: voterAlice });

      const hasClaimedAfter = await registry.tokenClaims(pollID, voterAlice);
      expect(hasClaimedAfter).to.be.true("tokenClaims should have been true after tokens claimed");
    });
  });
});
