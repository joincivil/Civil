import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

contract("Registry With Appeals", accounts => {
  describe("Function: setMakeAppealLength", () => {
    const [JAB, applicant] = accounts;

    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
    });

    it("should fail if the appeal phase length is == 0", async () => {
      await expect(registry.setMakeAppealLength(0, { from: JAB })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed an appeal phase length that is 0",
      );
    });

    it("should succeed in setting the appeal phase length if > 0", async () => {
      const dummyLength = 1000;
      await registry.setMakeAppealLength(dummyLength, { from: JAB });
      const newMakeAppealLength = await registry.requestAppealPhaseLength();
      await expect(newMakeAppealLength).to.be.bignumber.equal(
        dummyLength,
        "Current request appeal phase len should be equal to appeal phase len set",
      );
    });

    it("should fail in setting the fee if not JAB", async () => {
      const dummyLength = 1000;
      await expect(registry.setAppealLength(dummyLength, { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not be allowed to set appeal phase len as non-JAB",
      );
    });
  });
});
