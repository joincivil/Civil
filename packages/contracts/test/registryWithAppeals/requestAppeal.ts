import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

const Newsroom = artifacts.require("Newsroom");
const PLCRVoting = artifacts.require("PLCRVoting");

contract("Registry With Appeals", (accounts) => {
  describe("Function: requestAppeal", () => {
    const [JAB, applicant, challenger, voter] = accounts;
    let registry: any;
    let voting: any;
    const minDeposit = utils.paramConfig.minDeposit;

    beforeEach(async () => {
      registry = await utils.createAllTestRestrictedAddressRegistryWithAppealsInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = await PLCRVoting.at(votingAddress);
    });

    it("should fail if no application has been made", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on non-existent application");
    });

    it("should fail if application is in progress", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });

      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application in progress");
    });

    it("should fail if challenge is in progress", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application with challenge in progress");

      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application with challenge in progress");

      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not have allowed appeal on application with challenge not yet resolved");
    });

    it("should succeed if challenge is lost and status is updated", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength);
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(address);
      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.fulfilled(
        "Should have allowed appeal on application with failed challenge that has been processed");
    });

    it("should fail if challenge is lost, status is updated, but request phase has ended", async () => {
      const testNewsroom = await Newsroom.new({ from: applicant });
      const address = testNewsroom.address;
      await registry.apply(address, minDeposit, "", { from: applicant });
      await registry.challenge(address, "", { from: challenger });
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(address);
      await utils.advanceEvmTime(259250); // hack. can't read directly from contract for some reason, was causing crash
      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should have allowed appeal on application with failed challenge that has been processed");
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
      await expect(registry.requestAppeal(address, { from: applicant })).to.eventually.be.rejectedWith(REVERTED,
        "Should not allow appeal if challenge is won by applicant");
    });

  });
});
