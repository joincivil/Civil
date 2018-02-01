import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts: string[]) => {
  describe("Function: canBeSet", () => {
    const proposer = accounts[0];
    let parameterizer: any;

    beforeEach(async () => {
      parameterizer = await utils.createAllTestParameterizerInstance(accounts);
    });

    it("should return true if a proposal passed its application stage with no challenge", async () => {
      const propID = await utils.proposeReparamAndGetPropID("voteQuorum", "51", parameterizer, proposer);
      await utils.advanceEvmTime(utils.paramConfig.pApplyStageLength + 1);
      const result = await parameterizer.canBeSet(propID);
      expect(result).to.be.true();
    });
    it("should return false if a proposal is still in its application stage with no challenge", async () => {
      const propID = await utils.proposeReparamAndGetPropID("pRevealStageLength", "500", parameterizer, proposer);
      const result = await parameterizer.canBeSet(propID);
      expect(result).to.be.false();
    });
    it("should expect false immediately after proposal, and true once enough time has passed", async () => {
      const propID = await utils.proposeReparamAndGetPropID("dispensationPct", "58", parameterizer, proposer);

      const betterBeFalse = await parameterizer.canBeSet(propID);
      expect(betterBeFalse).to.be.false();

      await utils.advanceEvmTime(utils.paramConfig.pApplyStageLength + 1);

      const result = await parameterizer.canBeSet(propID);
      expect(result).to.be.true();
    });
  });
});
