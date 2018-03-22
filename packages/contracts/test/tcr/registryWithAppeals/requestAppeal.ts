import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", (accounts) => {
  describe("Function: requestAppeal", () => {
    const [JAB, applicant, challenger, voter] = accounts;
    let registry: any;
    let voting: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);

      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should fail if no application has been made", async () => {

      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on non-existent application");
    });

    it("should fail if application is in progress", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });

      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application in progress");
    });

    it("should fail if challenge is in progress", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application with challenge in progress");

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application with challenge in progress");

      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application with challenge not yet resolved");
    });

    it("should succeed if challenge is lost and status is updated", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(newsroomAddress);
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.fulfilled(
        "Should have allowed appeal on application with failed challenge that has been processed");
    });

    it("should fail if challenge is lost, status is updated, but request phase has ended", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(newsroomAddress);
      await utils.advanceEvmTime(259250); // hack. can't read directly from contract for some reason, was causing crash
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should have allowed appeal on application with failed challenge that has been processed");
    });

    it("should fail if challenge is won by applicant", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      await voting.revealVote(pollID, 1, 420, { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(newsroomAddress);
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not allow appeal if challenge is won by applicant");
    });

    it("should allow a listing to request appeal after going through process before and being denied", async () => {
      // 1st time
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(newsroomAddress);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await utils.advanceEvmTime(1209620); // hack. should be getting value from registry contract
      await registry.updateStatus(newsroomAddress);

      // 2nd time around
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant});
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(newsroomAddress);
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.fulfilled(
        "should have allowed appeal 2nd time around");
    });

    it("should allow a listing to request appeal the 2nd time around but not requesting one the 1st time", async () => {
      // 1st time
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(newsroomAddress);
      await utils.advanceEvmTime(259250); // hack. should be getting value from registry contract
      await registry.updateStatus(newsroomAddress);

      // 2nd time around
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant});
      await registry.challenge(newsroomAddress, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(newsroomAddress);
      await expect(registry.requestAppeal(newsroomAddress, { from: applicant })).to.eventually.be.fulfilled(
        "should have allowed appeal 2nd time around");
    });
  });
});
