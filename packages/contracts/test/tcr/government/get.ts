import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";
import { BigNumber } from "bignumber.js";
const Government = artifacts.require("Government");
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: get", () => {
    const [JAB] = accounts;
    let registry: any;
    let government: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
    });

    it("judgeAppealPhaseLength value should be same as in config after deployment", async () => {
      const judgeAppealLength = await government.get("judgeAppealPhaseLength");
      expect(judgeAppealLength).to.be.bignumber.equal(
        new BigNumber(utils.paramConfig.judgeAppealPhaseLength),
        "judgeAppealPhaseLength was not equal to value in config immediately after deployment",
      );
    });

    it("should not be possible for troll to set judgeAppealPhaseLength value", async () => {
      await government.set("judgeAppealPhaseLength", 100, { from: JAB });
      const judgeAppealLength = await government.get("judgeAppealPhaseLength");
      expect(judgeAppealLength).to.be.bignumber.equal(
        new BigNumber(100),
        "judgeAppealPhaseLength was not equal to value it was set to",
      );
    });
  });
});
