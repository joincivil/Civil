import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";
const Government = artifacts.require("Government");
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: set", () => {
    const [JAB, troll] = accounts;
    let registry: any;
    let government: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
    });

    it("should be possible for JAB to set judgeAppealLength value", async () => {
      await expect(government.set("judgeAppealPhaseLength", 100, { from: JAB })).to.eventually.be.fulfilled(
        "Should have allowed JAB to update judgeAppealLength",
      );
    });

    it("should not be possible for troll to set judgeAppealLength value", async () => {
      await expect(government.set("judgeAppealPhaseLength", 100, { from: troll })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed troll to update judgeAppealLength",
      );
    });
  });
});
