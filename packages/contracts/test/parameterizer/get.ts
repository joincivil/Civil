import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts: string[]) => {
  describe("Function: get", () => {
    let parameterizer: any;

    beforeEach(async () => {
      parameterizer = await utils.createAllTestParameterizerInstance(accounts);
    });

    it("should get a parameter", async () => {
      const result = await parameterizer.get("minDeposit");
      expect(result).to.be.bignumber.equal(utils.paramConfig.minDeposit, "minDeposit param has wrong value");
    });
  });
});
