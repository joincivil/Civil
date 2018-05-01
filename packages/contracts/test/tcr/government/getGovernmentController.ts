import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";
const Government = artifacts.require("Government");
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: getAppellate", () => {
    const [JAB] = accounts;
    let registry: any;
    let government: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
    });

    it("should return JAB immediately after deploy", async () => {
      const appellate = await government.getGovernmentController();
      expect(appellate).to.be.equal(JAB, "Should have equaled JAB immediately after deploy");
    });
  });
});
