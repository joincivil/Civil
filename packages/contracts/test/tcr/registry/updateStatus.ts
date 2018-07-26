import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;
const PLCRVoting = artifacts.require("CivilPLCRVoting");

contract("Registry", accounts => {
  describe("Function: updateStatus", () => {
    const [applicant, challenger, voter] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const listing21 = "0x0000000000000000000000000000000000000021";
    const listing22 = "0x0000000000000000000000000000000000000022";
    const listing23 = "0x0000000000000000000000000000000000000023";
    const listing24 = "0x0000000000000000000000000000000000000024";
    const listing25 = "0x0000000000000000000000000000000000000025";
    const listing26 = "0x0000000000000000000000000000000000000026";
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should whitelist listing if apply stage ended without a challenge", async () => {
      // note: this function calls registry.updateStatus at the end
      await utils.addToWhitelist(listing21, minDeposit, applicant, registry);

      const [, isWhitelisted] = await registry.listings(listing21);
      expect(isWhitelisted).to.be.true("Listing should have been whitelisted");
    });

    it("should not whitelist a listing that is still pending an application", async () => {
      await registry.apply(listing22, minDeposit, "", { from: applicant });

      await expect(registry.updateStatus(listing22, { from: applicant })).to.be.rejectedWith(
        REVERTED,
        "Listing should not have been whitelisted",
      );
    });

    it("should not whitelist a listing that is currently being challenged", async () => {
      await registry.apply(listing23, minDeposit, "", { from: applicant });
      await registry.challenge(listing23, "", { from: challenger });

      await expect(registry.updateStatus(listing23)).to.eventually.be.rejectedWith(
        REVERTED,
        "Listing should not have been whitelisted",
      );
    });

    it("should not whitelist a listing that failed a challenge", async () => {
      await registry.apply(listing24, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(listing24, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "100", "123", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, "1", "123", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(listing24);
      const [, isWhitelisted] = await registry.listings(listing24);
      expect(isWhitelisted).to.be.false("Listing should not have been whitelisted");

      const [, , , , challengeID] = await registry.listings(listing24);
      await expect(challengeID.isZero()).to.be.true("challengeID should be 0 after successfully updating status");
    });

    it("should not be possible to add a listing to the whitelist just by calling updateStatus", async () => {
      await expect(registry.updateStatus(listing25, { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
        "Listing should not have been whitelisted",
      );
    });

    it(
      "should not be possible to add a listing to the whitelist just " +
        "by calling updateStatus after it has been previously removed",
      async () => {
        await utils.addToWhitelist(listing26, minDeposit, applicant, registry);
        const [, resultOne] = await registry.listings(listing26);
        expect(resultOne).to.be.true("Listing should have been whitelisted");

        await registry.exitListing(listing26, { from: applicant });
        const [, resultTwo] = await registry.listings(listing26);
        expect(resultTwo).to.be.false("Listing should not be in the whitelist");

        await expect(registry.updateStatus(listing26, { from: applicant })).to.eventually.be.rejectedWith(
          REVERTED,
          "Listing should not have been whitelisted",
        );
      },
    );
  });
});
