import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";

const Government = artifacts.require("Government");
const PLCRVoting = artifacts.require("PLCRVoting");

utils.configureProviders(Government);
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: proposeReparameterization", () => {
    const [JAB, troll, nobody, voter] = accounts;
    let registry: any;
    let government: any;
    let voting: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      government = await Government.at(await registry.government());
      voting = await PLCRVoting.at(await registry.voting());
    });

    it("should be possible for JAB to propose new constitution value", async () => {
      await expect(
        government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new constitution");
    });

    it("should not be possible for troll to propose new judgeAppealLen value", async () => {
      await expect(
        government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: troll }),
      ).to.eventually.be.rejectedWith(REVERTED, "Should not have allowed troll to propose new constitution");
    });

    it("should be possible for JAB to propose new constitution value again after processing first proposal", async () => {
      const receipt = await government.proposeNewConstitution(web3.sha3("something.com"), "something.com", {
        from: JAB,
      });

      const { pollID } = receipt.logs[0].args;
      await utils.commitVote(voting, pollID, "0", "10", "420", voter);
      await utils.advanceEvmTime(utils.paramConfig.govtPCommitStageLength + 1);
      await voting.revealVote(pollID, "0", "420", { from: voter });
      await utils.advanceEvmTime(utils.paramConfig.govtPRevealStageLength + 1);
      await government.processConstChangeProp({ from: nobody });
      const constitutionURI = await government.constitutionURI();
      expect(constitutionURI).to.be.equal(
        utils.paramConfig.constitutionURI,
        "constitutionURI was not equal to value it was set to",
      );

      await expect(
        government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB }),
      ).to.eventually.be.fulfilled(
        "Should have allowed JAB to propose new constitution after processing previous proposal",
      );
    });

    it("should not be possible for JAB to propose two identical new constitutions simultaneously", async () => {
      await expect(
        government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new constitution");
      await expect(
        government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB }),
      ).to.eventually.be.rejectedWith(
        REVERTED,
        "Should have allowed JAB to propose new constitution while one already in progress",
      );
    });

    it("should not be possible for JAB to propose two different new constitutions simultaneously", async () => {
      await expect(
        government.proposeNewConstitution(web3.sha3("something.com"), "something.com", { from: JAB }),
      ).to.eventually.be.fulfilled("Should have allowed JAB to propose new constitution");
      await expect(
        government.proposeNewConstitution(web3.sha3("something2.com"), "something2.com", { from: JAB }),
      ).to.eventually.be.rejectedWith(
        REVERTED,
        "Should have allowed JAB to propose new constitution while one already in progress",
      );
    });
  });
});
