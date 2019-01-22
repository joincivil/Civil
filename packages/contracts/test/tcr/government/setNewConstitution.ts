import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const Government = artifacts.require("Government");
const PLCRVoting = artifacts.require("PLCRVoting");

utils.configureProviders(Government);
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: proposeReparameterization", () => {
    const [JAB, troll, nobody, voter] = accounts;
    let registry: any;
    let government: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
    });

    it("should be possible for JAB to set new constitution value", async () => {
      await expect(
        government.setNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new constitution");
    });

    it("should not be possible for troll to set new constitution value", async () => {
      await expect(
        government.setNewConstitution(web3.sha3("something.com"), "something.com", { from: troll }),
      ).to.eventually.be.rejectedWith(REVERTED, "Should not have allowed troll to propose new constitution");
    });

    it("should be possible for JAB to set new constitution value again after setting it once", async () => {
      await government.setNewConstitution(web3.sha3("something.com"), "something.com", {
        from: JAB,
      });

      const constitutionURI = await government.constitutionURI();
      expect(constitutionURI).to.be.equal("something.com", "constitutionURI was not equal to value it was set to");

      await expect(
        government.setNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to set new constitution after setting previous");
    });
  });
});
