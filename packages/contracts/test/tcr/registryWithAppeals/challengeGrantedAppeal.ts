import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const PLCRVoting = artifacts.require("CivilPLCRVoting");
utils.configureProviders(PLCRVoting);

contract("Registry With Appeals", accounts => {
  describe("Function: challengeGrantedAppeal", () => {
    const [JAB, applicant, challenger, voter, challenger2] = accounts;
    const unapproved = accounts[9];

    let registry: any;
    let voting: any;

    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    describe("with real newsroom", async () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await utils.createDummyNewsrom(applicant);
        newsroomAddress = testNewsroom.address;
      });

      it("should fail if no application has been made", async () => {
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(REVERTED, "Should not have allowed grant appeal on non-existent application");
      });

      it("should fail if application is in progress", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(REVERTED, "Should not have allowed grant appeal on application in progress");
      });

      it("should fail if challenge is in progress", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with challenge in progress",
        );

        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with challenge in progress",
        );

        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with challenge not yet resolved",
        );
      });

      it("should fail if challenge is lost and status is updated, but appeal not requested", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed appeal on application with failed challenge that has been processed",
        );
      });

      it("should fail if challenge is lost, status is updated, and request phase has ended", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
        await utils.advanceEvmTime(utils.paramConfig.requestAppealPhaseLength + 1);
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed grant appeal on application with failed challenge that has been processed",
        );
      });

      it("should fail if challenge is won by applicant, no appeal requested", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
        await utils.commitVote(voting, pollID, "1", "10", "420", voter);
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
        await voting.revealVote(pollID, 1, 420, { from: voter });
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(REVERTED, "Should not allow grant appeal if challenge is won by applicant");
      });

      it("should fail if challenge is lost and appeal requested, but not granted", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed appeal on application with failed challenge that has been processed",
        );
      });

      it("should succeed if challenge is lost, appeal requested, and granted", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await registry.grantAppeal(newsroomAddress, { from: JAB });

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.fulfilled(
          "Should have allowed appeal on application with challenge that has been appeal and had that appeal granted",
        );
      });

      it("should fail if try to challenge granted appeal while one already active", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await registry.grantAppeal(newsroomAddress, { from: JAB });

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.fulfilled("Should have allowed 1st challenge on granted appeal");

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(REVERTED, "Should have rejected 2nd challenge on granted appeal");
      });

      it("should fail if challenge is lost, appeal requested, and granted, but challenger has not approved registry as token spender", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await registry.grantAppeal(newsroomAddress, { from: JAB });

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: unapproved }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed appeal on application with challenge that has been appeal and had that appeal granted if challenger has not approved registry as token spender",
        );
      });

      it("should succeed if challenge is lost, appeal requested, and granted, when appeal challenged by different challenger", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await registry.grantAppeal(newsroomAddress, { from: JAB });

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger2 }),
        ).to.eventually.be.fulfilled(
          "Should have allowed appeal on application with challenge that has been appeal and had that appeal granted",
        );
      });

      it("should fail if challenge is lost, appeal requested, granted, but challenge appeal phase has ended", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await registry.grantAppeal(newsroomAddress, { from: JAB });
        await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 1);

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed appeal on application with challenge that has been appeal and had that appeal granted",
        );
      });

      it("should fail if challenge is lost, appeal requested, granted, but challenge appeal phase has ended when appeal challenged by different challenger", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await registry.challenge(newsroomAddress, "", { from: challenger });
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await registry.grantAppeal(newsroomAddress, { from: JAB });
        await utils.advanceEvmTime(utils.paramConfig.challengeAppealLength + 1);

        await expect(
          registry.challengeGrantedAppeal(newsroomAddress, "", { from: challenger }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "Should not have allowed appeal on application with challenge that has been appeal and had that appeal granted",
        );
      });
    });
  });
});
