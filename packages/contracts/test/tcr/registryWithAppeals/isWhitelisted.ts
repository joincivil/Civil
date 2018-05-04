import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");

const NEWSROOM_NAME = "unused newsroom name";

contract("Registry With Appeals", accounts => {
  describe("Function: isWhitelisted", () => {
    const [JAB, applicant, challenger, voter] = accounts;
    let registry: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);

      testNewsroom = await Newsroom.new(NEWSROOM_NAME, { from: applicant });
      newsroomAddress = testNewsroom.address;
    });

    it("should whitelist if challenge unsuccessful, appeal not requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with unsuccessful challenge if appeal requested but not granted",
      );
    });

    it("should delist if challenge successful, appeal not requested", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with successful challenge if appeal requested but not granted",
      );
    });

    it("should whitelist if challenge unsuccessful, appeal requested, no granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with unsuccessful challenge if appeal requested but not granted",
      );
    });

    it("should delist if challenge successful, appeal requested, no granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with successful challenge if appeal requested but not granted",
      );
    });

    it("should whitelist if challenge successful, granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with successful challenge if appeal granted and appeal not challenged",
      );
    });

    it("should delist if challenge unsuccessful, granted appeal", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 1);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with unsuccessful challenge if appeal granted and appeal not challenged",
      );
    });
    it("should delist if challenge success, granted appeal, appeal challenge success", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      await utils.simpleSuccessfulAppealChallenge(registry, newsroomAddress, challenger, voter);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with successful challenge, granted appeal, successful appeal challenge",
      );
    });
    it("should whitelist if challenge success, granted appeal, appeal challenge failure", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleSuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      await utils.simpleUnsuccessfulAppealChallenge(registry, newsroomAddress, challenger, voter);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with successful challenge, granted appeal, unsuccessful appeal challenge",
      );
    });
    it("should whitelist if challenge failure, granted appeal, appeal challenge success", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      await utils.simpleSuccessfulAppealChallenge(registry, newsroomAddress, challenger, voter);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.true(
        "Should have whitelisted newsroom with unsuccessful challenge, granted appeal, successful appeal challenge",
      );
    });
    it("should delist if challenge failure, granted appeal, appeal challenge failure", async () => {
      await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
      await utils.simpleUnsuccessfulChallenge(registry, newsroomAddress, challenger, voter);
      await registry.requestAppeal(newsroomAddress, { from: applicant });
      await registry.grantAppeal(newsroomAddress, { from: JAB });
      await utils.simpleUnsuccessfulAppealChallenge(registry, newsroomAddress, challenger, voter);
      await registry.updateStatus(newsroomAddress);
      const [, isWhitelisted] = await registry.listings(newsroomAddress);
      expect(isWhitelisted).to.be.false(
        "Should not have whitelisted newsroom with unsuccessful challenge, granted appeal, unsuccessful appeal challenge",
      );
    });
  });
});
