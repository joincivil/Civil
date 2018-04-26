import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

contract("Registry With Appeals", accounts => {
  describe("Function: setAppealFee", () => {
    const [JAB, applicant] = accounts;

    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
    });

    it("should fail if the fee is == 0", async () => {
      await expect(registry.setAppealFee(0, { from: JAB })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed a fee that is 0",
      );
    });

    it("should succeed in setting the fee if > 0", async () => {
      const dummyFee = 1000;
      await registry.setAppealFee(dummyFee, { from: JAB });
      const newAppealFee = await registry.appealFee();
      await expect(newAppealFee).to.be.bignumber.equal(
        dummyFee,
        "Current appeal fee should be equal to appeal fee set",
      );
    });

    it("should fail in setting the fee if not JAB", async () => {
      const dummyFee = 1000;
      await expect(registry.setAppealFee(dummyFee, { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not be allowed to set appeal fee as non-JAB",
      );
    });
  });
});
