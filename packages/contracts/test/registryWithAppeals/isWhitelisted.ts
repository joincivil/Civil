import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

contract("Registry With Appeals", (accounts) => {
  describe("Function: isWhitelisted", () => {
    const [JAB, applicant, challenger, voter] = accounts;
    let registry: any;
    let voting: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should succeed if no application has already been made", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.whitelistAddress(address, minDeposit, { from: JAB });
      const result = await registry.getListingIsWhitelisted(address);
      expect(result).to.be.true("Listing should have been whitelisted");
    });
  });
});
