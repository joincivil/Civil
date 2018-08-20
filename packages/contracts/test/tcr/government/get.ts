import { configureChai } from "@joincivil/dev-utils";
import { BigNumber } from "bignumber.js";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const Government = artifacts.require("Government");
utils.configureProviders(Government);

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

    it("judgeAppealLen value should be same as in config after deployment", async () => {
      const judgeAppealLength = await government.get("judgeAppealLen");
      expect(judgeAppealLength).to.be.bignumber.equal(
        new BigNumber(utils.paramConfig.judgeAppealPhaseLength),
        "judgeAppealLen was not equal to value in config immediately after deployment",
      );
    });

    it("should not be possible for troll to set judgeAppealLen value", async () => {
      await government.set("judgeAppealLen", 100, { from: JAB });
      const judgeAppealLength = await government.get("judgeAppealLen");
      expect(judgeAppealLength).to.be.bignumber.equal(
        new BigNumber(100),
        "judgeAppealLen was not equal to value it was set to",
      );
    });
  });
});
