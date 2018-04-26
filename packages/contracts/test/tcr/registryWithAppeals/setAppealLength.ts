import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

contract("Registry With Appeals", accounts => {
  describe("Function: setAppealLength", () => {
    const [JAB, applicant] = accounts;

    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
    });

    it("should fail if the judge appeal phase length is == 0", async () => {
      await expect(registry.setAppealLength(0, { from: JAB })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed a judge appeal length that is 0",
      );
    });

    it("should succeed in setting the judge appeal phase length if > 0", async () => {
      const dummyLength = 1000;
      await registry.setAppealLength(dummyLength, { from: JAB });
      const newJudgeAppealLength = await registry.judgeAppealPhaseLength();
      await expect(newJudgeAppealLength).to.be.bignumber.equal(
        dummyLength,
        "Current request judge appeal len should be equal to judge appeal len set",
      );
    });

    it("should fail in setting the judge appeal length if not JAB", async () => {
      const dummyLength = 1000;
      await expect(registry.setAppealLength(dummyLength, { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not be allowed to set judge appeal length as non-JAB",
      );
    });
  });
});
