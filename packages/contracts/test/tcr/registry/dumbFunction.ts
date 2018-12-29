import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("PLCRVoting");
utils.configureProviders(PLCRVoting);

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("voter reward", () => {
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("dumb funciton should be dumb", async () => {
      const result = await voting.dumbFunction();
      console.log("result: ", result);
      expect(result).to.be.bignumber.equal(0, "dumbFunction should be 0")
    });
  });
});
