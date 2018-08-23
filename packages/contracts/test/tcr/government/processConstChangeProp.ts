import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import * as utils from "../../utils/contractutils";
import { REVERTED } from "../../utils/constants";
const Government = artifacts.require("Government");
const PLCRVoting = artifacts.require("PLCRVoting");
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: processConstChangeProp", () => {
    const [JAB, nobody, voter] = accounts;
    let registry: any;
    let government: any;
    let voting: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
      voting = await PLCRVoting.at(await registry.voting());
    });

    it("processConstProposal should fail if proposal not active", async () => {
      await expect(government.processConstChangeProp({ from: nobody })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to process nonexistent constitution proposal",
      );
    });

    it("processProposal should fail if proposal just begun", async () => {
      await government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB });
      await expect(government.processConstChangeProp({ from: nobody })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to process nonexistent proposal",
      );
    });

    it("processProposal should fail if proposal vote not over", async () => {
      await government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await expect(government.processConstChangeProp({ from: nobody })).to.eventually.be.rejectedWith(
        REVERTED,
        "should not have been able to process proposal before vote is over",
      );
    });

    it("processProposal should succeed if proposal vote over", async () => {
      await government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB });
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);
      await expect(government.processConstChangeProp({ from: nobody })).to.eventually.be.fulfilled(
        "should have been able to process proposal after vote is over",
      );
    });

    it("constitution should be new value after processing successful proposal", async () => {
      const receipt = await government.proposeNewConstitution(web3.sha3("something.com"), "something.com", {
        from: JAB,
      });

      const { pollID } = receipt.logs[0].args;
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await voting.revealVote(pollID, "1", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);
      await government.processConstChangeProp({ from: nobody });
      const constitution = await government.constitutionURI();
      expect(constitution).to.be.equal("something.com", "constitutionURI was not equal to value it was set to");
    });

    it("constitution should be old value after processing unsuccessful proposal", async () => {
      const receipt = await government.proposeNewConstitution(web3.sha3("something.com"), "something.com", {
        from: JAB,
      });

      const { pollID } = receipt.logs[0].args;
      await utils.commitVote(voting, pollID, "0", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await voting.revealVote(pollID, "0", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);
      await government.processConstChangeProp({ from: nobody });
      const constitution = await government.constitutionURI();
      expect(constitution).to.be.equal(
        utils.paramConfig.constitutionURI,
        "constitutionURI was not equal to original value",
      );
    });

    it("constitution should be old value if wait too long to update after successful proposal", async () => {
      const receipt = await government.proposeNewConstitution(web3.sha3("something.com"), "something.com", {
        from: JAB,
      });

      const { pollID } = receipt.logs[0].args;
      await utils.commitVote(voting, pollID, "1", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await voting.revealVote(pollID, "1", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);

      // hack below: trying to use the real PROCESSBY value (7 days) was causing ganache to crash, so splitting it up into several calls
      await utils.advanceEvmTime(100000 + 1);
      await utils.advanceEvmTime(100000 + 1);
      await utils.advanceEvmTime(100000 + 1);
      await utils.advanceEvmTime(100000 + 1);
      await utils.advanceEvmTime(100000 + 1);
      await utils.advanceEvmTime(100000 + 1);
      await utils.advanceEvmTime(100000 + 1);
      await government.processConstChangeProp({ from: nobody });
      const constitution = await government.constitutionURI();
      expect(constitution).to.be.equal(
        utils.paramConfig.constitutionURI,
        "constitutionURI was not equal to original value",
      );
    });
  });
});
