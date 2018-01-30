import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import {
          proposeReparamAndGetPropID,
        } from "../utils/contractutils";

const Parameterizer = artifacts.require("Parameterizer");

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts) => {
  describe("propExists", () => {
    const [proposer] = accounts;
    let parameterizer: any;

    before(async () => {
      // await createTestParameterizerInstance(accounts);
      parameterizer = await Parameterizer.deployed();
    });

    it("should true if a proposal exists for the provided propID", async () => {
      const propID = await proposeReparamAndGetPropID("voteQuorum", "51", parameterizer, proposer);
      const result = await parameterizer.propExists(propID);
      expect(result).to.be.true("should have been true cause I literally just made the proposal");
    });

    it("should false if no proposal exists for the provided propID", async () => {
      const result = await parameterizer.propExists("666");
      expect(result).to.be.false("should have been false cause i just made it up!");
    });
  });
});
