import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const Government = artifacts.require("Government");
utils.configureProviders(Government);
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: getAppellate", () => {
    const [JAB, newAppellate] = accounts;
    let registry: any;
    let government: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
    });

    it("should return JAB immediately after deploy", async () => {
      const appellate = await government.getAppellate();
      expect(appellate).to.be.equal(JAB, "Should have equaled JAB immediately after deploy");
    });

    it("should return newAppellate after it has been set", async () => {
      await expect(government.setAppellate(newAppellate, { from: JAB })).to.eventually.be.fulfilled(
        "Should have allowed JAB to update appellate",
      );
      const appellate = await government.getAppellate();
      expect(appellate).to.be.equal(newAppellate, "Should have equaled newAppellate immediately after deploy");
    });
  });
});
