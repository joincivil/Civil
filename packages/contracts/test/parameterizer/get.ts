import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import { paramConfig } from "../utils/contractutils";
const Parameterizer = artifacts.require("Parameterizer");

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", () => {
  describe("Function: get", () => {
    let parameterizer: any;

    before(async () => {
      // await createTestParameterizerInstance(accounts);
      parameterizer = await Parameterizer.deployed();
    });

    it("should get a parameter", async () => {
      const result = await parameterizer.get("minDeposit");
      expect(result).to.be.bignumber.equal(paramConfig.minDeposit, "minDeposit param has wrong value");
    });
  });
});
