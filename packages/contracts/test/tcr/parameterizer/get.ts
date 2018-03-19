import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

configureChai(chai);
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
