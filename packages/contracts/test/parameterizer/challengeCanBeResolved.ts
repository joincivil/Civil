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

contract("Parameterizer", (accounts) => {
  describe("challengeCanBeResolved", () => {
    const [proposer, challenger] = accounts;
    let parameterizer: any;

    before(async () => {
      // await createTestParameterizerInstance(accounts);
      parameterizer = await Parameterizer.deployed();
    });

    it("should be true if a challenge is ready to be resolved", async () => {
      const propID = await proposeReparamAndGetPropID("voteQuorum", "51", parameterizer, proposer);

      await parameterizer.challengeReparameterization(propID, { from: challenger});
      await advanceEvmTime(paramConfig.pCommitStageLength, accounts[0]);
      await advanceEvmTime(paramConfig.pRevealStageLength + 1, accounts[0]);

      const result = await parameterizer.challengeCanBeResolved(propID);
      expect(result).to.be.true();
    });

    it("should be false if a challenge is not ready to be resolved", async () => {
      const propID = await proposeReparamAndGetPropID("voteQuorum", "59", parameterizer, proposer);

      await parameterizer.challengeReparameterization(propID, { from: challenger });
      await advanceEvmTime(paramConfig.pCommitStageLength, accounts[0]);

      const result = await parameterizer.challengeCanBeResolved(propID);
      expect(result).to.be.false();
    });
  });
});
