import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const AddressRegistry = artifacts.require("AddressRegistry");
const ContractAddressRegistry = artifacts.require("ContractAddressRegistry");
const PLCRVoting = artifacts.require("CivilPLCRVoting");

contract("Registry With Appeals", accounts => {
  describe("Function: apply", () => {
    const [JAB, applicant, troll, challenger, voter] = accounts;
    const unapproved = accounts[9];
    const listing1 = "0x0000000000000000000000000000000000000001";
    const minDeposit = utils.paramConfig.minDeposit;
    let registry: any;
    let voting: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      voting = PLCRVoting.at(votingAddress);
    });

    describe("with real newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await utils.createDummyNewsrom(applicant);
        newsroomAddress = testNewsroom.address;
      });

      it("should allow contract owner to apply on behalf of contract", async () => {
        await registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant });

        // get struct from mapping
        const [applicationExpiry, whitelisted, owner, unstakedDeposit] = await registry.listings(newsroomAddress);

        // check that Application is initialized correctly
        expect(applicationExpiry).to.be.bignumber.gt(0, "challenge time < now");
        expect(whitelisted).to.be.false("whitelisted != false");
        expect(owner).to.be.equal(applicant, "owner of application != address that applied");
        expect(unstakedDeposit).to.be.bignumber.equal(utils.paramConfig.minDeposit, "incorrect unstakedDeposit");
      });

      it("should fail if applicant has not approved registry as spender of token", async () => {
        await expect(
          registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: unapproved }),
        ).to.eventually.be.rejectedWith(
          REVERTED,
          "should not have allowed applicant to apply if they have not approved registry as spender",
        );
      });

      it("should not allow a listing to apply which has a pending application", async () => {
        await registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant });
        await expect(
          registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("should add a listing to the whitelist which went unchallenged in its application period", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        await utils.advanceEvmTime(utils.paramConfig.applyStageLength + 1);
        await registry.updateStatus(newsroomAddress);
        const [, whitelisted] = await registry.listings(newsroomAddress);

        expect(whitelisted).to.be.true("listing didn't get whitelisted");
      });

      it("should not allow a listing to apply which is already listed", async () => {
        await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);
        await expect(
          registry.apply(newsroomAddress, minDeposit, "", { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it(
        "should not allow a listing to re-apply after losing challenge, " +
          "not being granted appeal, not updating status",
        async () => {
          await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
          await registry.challenge(newsroomAddress, "", { from: challenger });
          await utils.advanceEvmTime(utils.paramConfig.commitStageLength + utils.paramConfig.revealStageLength + 1);
          await registry.requestAppeal(newsroomAddress, { from: applicant });
          await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);

          const applyTx = registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
          await expect(applyTx).to.eventually.be.rejectedWith(
            REVERTED,
            "should not have allowed new application after being denied appeal and not updating status",
          );
        },
      );

      it("should allow a listing to re-apply after losing challenge (challenge vote successful), not being granted appeal, updating status", async () => {
        await registry.apply(newsroomAddress, minDeposit, "", { from: applicant });
        const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
        await utils.commitVote(voting, pollID, "1", "100", "1234", voter);
        await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
        await voting.revealVote(pollID, "1", "1234", { from: voter });
        await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
        await registry.requestAppeal(newsroomAddress, { from: applicant });
        await utils.advanceEvmTime(utils.paramConfig.judgeAppealPhaseLength + 1);
        await registry.updateStatus(newsroomAddress);

        await expect(registry.apply(newsroomAddress, minDeposit, "", { from: applicant })).to.eventually.be.fulfilled(
          "should have allowed new application after being denied appeal",
        );
      });
    });

    describe("with troll newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await utils.createDummyNewsrom(troll);
        newsroomAddress = testNewsroom.address;
      });

      it("should not allow a non-contract owner to apply", async () => {
        await expect(
          registry.apply(newsroomAddress, utils.paramConfig.minDeposit, "", { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("should prevent un-owned address from being listed when registry cast to ContractAddressRegistry", async () => {
        const parentRegistry = await ContractAddressRegistry.at(registry.address);
        await expect(
          parentRegistry.apply(newsroomAddress, minDeposit, "", { from: applicant }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });
    });

    it("should prevent non-contract address from being listed", async () => {
      await expect(
        registry.apply(listing1, utils.paramConfig.minDeposit, "", { from: applicant }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("should prevent non-contract address from being listed when registry cast to AddressRegistry", async () => {
      const parentRegistry = await AddressRegistry.at(registry.address);

      await expect(parentRegistry.apply(listing1, minDeposit, "", { from: applicant })).to.eventually.be.rejectedWith(
        REVERTED,
      );
    });
  });
});
