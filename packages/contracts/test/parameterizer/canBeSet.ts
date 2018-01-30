import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import {  advanceEvmTime,
          // createTestParameterizerInstance,
          paramConfig,
          proposeReparamAndGetPropID,
        } from "../utils/contractutils";

const Parameterizer = artifacts.require("Parameterizer");

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts: string[]) => {
  describe("canBeSet", () => {
    const proposer = accounts[0];
    let parameterizer: any;

    before(async () => {
      // await createTestParameterizerInstance(accounts);
      parameterizer = await Parameterizer.deployed();
    });

    it("should return true if a proposal passed its application stage with no challenge", async () => {
      const propID = await proposeReparamAndGetPropID("voteQuorum", "51", parameterizer, proposer);
      await advanceEvmTime(paramConfig.pApplyStageLength + 1, accounts[0]);
      const result = await parameterizer.canBeSet(propID);
      expect(result).to.be.true();
    });
    it("should return false if a proposal is still in its application stage with no challenge", async () => {
      const propID = await proposeReparamAndGetPropID("pRevealStageLength", "500", parameterizer, proposer);
      const result = await parameterizer.canBeSet(propID);
      expect(result).to.be.false();
    });
    it("should expect false immediately after proposal, and true once enough time has passed", async () => {
      const propID = await proposeReparamAndGetPropID("dispensationPct", "58", parameterizer, proposer);

      const betterBeFalse = await parameterizer.canBeSet(propID);
      expect(betterBeFalse).to.be.false();

      await advanceEvmTime(paramConfig.pApplyStageLength + 1, accounts[0]);

      const result = await parameterizer.canBeSet(propID);
      expect(result).to.be.true();
    });
  });
});
