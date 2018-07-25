import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");

configureChai(chai);
const expect = chai.expect;

contract("Registry", accounts => {
  describe("User stories", () => {
    const [applicant, challenger, voter] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    const listing27 = "0x0000000000000000000000000000000000000027";
    const listing28 = "0x0000000000000000000000000000000000000028";
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should apply, get challenged, have challenge be successful, and reject listing", async () => {
      await registry.apply(listing27, utils.paramConfig.minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, listing27, challenger, voter);
      await registry.updateStatus(listing27);

      // should not have been added to whitelist
      const [, isWhitelisted] = await registry.listings(listing27);
      expect(isWhitelisted).to.be.false("listing should not be whitelisted");
    });

    it("should apply, pass challenge (challenge vote fails), and whitelist listing", async () => {
      await registry.apply(listing28, minDeposit, "", { from: applicant });

      // Challenge and get back the pollID
      const pollID = await utils.challengeAndGetPollID(listing28, challenger, registry);

      // Make sure it"s cool to commit
      const cpa = await voting.commitPeriodActive(pollID);
      expect(cpa).to.be.true("Commit period should be active");

      // Virgin commit
      const tokensArg = "10";
      const salt = "420";
      const voteOption = "0";
      await utils.commitVote(voting, pollID, voteOption, tokensArg, salt, voter);

      const numTokens = await voting.getNumTokens(voter, pollID);
      expect(numTokens).to.be.bignumber.equal(tokensArg, "Should have committed the correct number of tokens");

      // Reveal
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      // Make sure commit period is inactive
      const commitPeriodActive = await voting.commitPeriodActive.call(pollID);
      expect(commitPeriodActive).to.be.false("Commit period should be inactive");
      // Make sure reveal period is active
      let rpa = await voting.revealPeriodActive.call(pollID);
      expect(rpa).to.be.true("Reveal period should be active");

      await voting.revealVote(pollID, voteOption, salt, { from: voter });

      // End reveal period
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      rpa = await voting.revealPeriodActive.call(pollID);
      expect(rpa).to.be.false("Reveal period should not be active");

      // updateStatus
      const pollResult = await voting.isPassed.call(pollID);
      expect(pollResult).to.be.false("Poll should have failed");

      // Add to whitelist
      await registry.updateStatus(listing28);
      const [, isWhitelisted] = await registry.listings(listing28);
      expect(isWhitelisted).to.be.true("Listing should be whitelisted");
    });

    it("should allow someone to update their committed vote", async () => {
      await registry.apply(listing28, minDeposit, "", { from: applicant });

      // Challenge and get back the pollID
      const pollID = await utils.challengeAndGetPollID(listing28, challenger, registry);

      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.commitVote(voting, pollID, "0", "15", "123", voter);

      const numTokens = await voting.getNumTokens(voter, pollID);
      expect(numTokens).to.be.bignumber.equal("15", "Should have committed the correct number of tokens");

      // Reveal
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      // Make sure commit period is inactive
      const commitPeriodActive = await voting.commitPeriodActive.call(pollID);
      expect(commitPeriodActive).to.be.false("Commit period should be inactive");
      // Make sure reveal period is active
      let rpa = await voting.revealPeriodActive.call(pollID);
      expect(rpa).to.be.true("Reveal period should be active");

      await voting.revealVote(pollID, "0", "123", { from: voter });

      // End reveal period
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      rpa = await voting.revealPeriodActive.call(pollID);
      expect(rpa).to.be.false("Reveal period should not be active");

      // updateStatus
      const pollResult = await voting.isPassed.call(pollID);
      expect(pollResult).to.be.false("Poll should have failed");

      // Add to whitelist
      await registry.updateStatus(listing28);
      const [, isWhitelisted] = await registry.listings(listing28);
      expect(isWhitelisted).to.be.true("Listing should be whitelisted");
    });
  });
});
