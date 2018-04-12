import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: isWhitelisted", () => {
    const [JAB, applicant] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);

      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should succeed if no application has already been made", async () => {
      await registry.whitelistAddress(newsroomAddress, minDeposit, { from: JAB });
      const listing = await registry.listings(newsroomAddress);
      const result = listing[1];
      expect(result).to.be.true("Listing should have been whitelisted");
    });
  });
});
