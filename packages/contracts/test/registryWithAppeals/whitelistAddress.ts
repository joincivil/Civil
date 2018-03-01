import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import { configureChai } from "@joincivil/dev-utils";
import * as utils from "../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

contract("Registry With Appeals", (accounts) => {
  describe("Function: whitelistAddress", () => {
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
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB })).to.eventually.be.fulfilled(
        "Should have allowed JEC to whitelist address for existing application");
    });

    it("should succeed if challenge is lost, request phase has ended and been processed", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(address);
      await utils.advanceEvmTime(259250); // hack. can't read directly from contract for some reason, was causing crash
      await registry.resolvePostAppealPhase(address);

      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB })).to.eventually.be.fulfilled(
        "Should not have allowed JEC to whitelist application with failed challenge that has been processed");
    });

    it("should fail if application has already been made", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed JEC to whitelist address for existing application");
    });

    it("should fail if challenge is in progress", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed JEC to whitelist on application with challenge in progress");

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed JEC to whitelist on application with challenge in progress");

      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed JEC to whitelist on application with challenge not yet resolved");
    });

    it("should fail if challenge is lost and status is updated, but appeal not requested", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(address);
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed JEC to whitelist application with failed challenge that has been processed");
    });

    it("should fail if challenge is lost, status is updated, and request phase has ended", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(address);
      await utils.advanceEvmTime(259250); // hack. can't read directly from contract for some reason, was causing crash
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed JEC to whitelist application with failed challenge that has been processed");
    });

    it("should fail if challenge is won by applicant", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(address, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 420, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(address);
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not allow JEC to whitelist if challenge is won by applicant");
    });

    it("should fail if challenge is lost and status is updated, and appeal requested", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(address);
      await registry.requestAppeal(address, { from: applicant });
      await expect(registry.whitelistAddress(address, minDeposit, { from: JAB }))
        .to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed JEC to whitelist application with failed challenge that has been processed");
    });
  });
});
