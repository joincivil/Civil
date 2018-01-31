import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const Parameterizer = artifacts.require("Parameterizer");

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts) => {
  describe("Function: challengeCanBeResolved", () => {
    const [proposer, challenger] = accounts;
    let parameterizer: any;

    before(async () => {
      // await createTestParameterizerInstance(accounts);
      parameterizer = await Parameterizer.deployed();
    });

    it("should be true if a challenge is ready to be resolved", async () => {
      const propID = await utils.proposeReparamAndGetPropID("voteQuorum", "51", parameterizer, proposer);

      await parameterizer.challengeReparameterization(propID, { from: challenger});
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.pRevealStageLength + 1);

      const result = await parameterizer.challengeCanBeResolved(propID);
      expect(result).to.be.true();
    });

    it("should be false if a challenge is not ready to be resolved", async () => {
      const propID = await utils.proposeReparamAndGetPropID("voteQuorum", "59", parameterizer, proposer);

      await parameterizer.challengeReparameterization(propID, { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.pCommitStageLength);

      const result = await parameterizer.challengeCanBeResolved(propID);
      expect(result).to.be.false();
    });
  });
});
