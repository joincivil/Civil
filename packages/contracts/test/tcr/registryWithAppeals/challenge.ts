import { configureChai } from "@joincivil/dev-utils";
import BN from "bignumber.js";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const Parameterizer = artifacts.require("Parameterizer");
const Token = artifacts.require("EIP20");

contract("Registry With Appeals", accounts => {
  describe("Function: apply", () => {
    const [JAB, applicant, challenger, proposer] = accounts;
    const minDeposit = new BN(utils.paramConfig.minDeposit);
    let registry: any;
    let parameterizer: any;
    let token: any;

    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const parameterizerAddress = await registry.parameterizer();
      parameterizer = await Parameterizer.at(parameterizerAddress);
      const tokenAddress = await registry.token();
      token = await Token.at(tokenAddress);
    });

    describe("with real newsroom", () => {
      let testNewsroom: any;
      let newsroomAddress: string;

      beforeEach(async () => {
        testNewsroom = await utils.createDummyNewsrom(applicant);
        newsroomAddress = testNewsroom.address;
      });

      it("should touch-and-remove a listing with a depost below the current minimum", async () => {
        const newMinDeposit = minDeposit.add(1);

        const applicantStartingBal = await token.balanceOf(applicant);

        await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

        const receipt = await parameterizer.proposeReparameterization("minDeposit", newMinDeposit, { from: proposer });
        const propID = utils.getReceiptValue(receipt, "propID");

        await utils.advanceEvmTime(utils.paramConfig.pApplyStageLength + 1);

        await parameterizer.processProposal(propID);

        const challengerStartingBal = await token.balanceOf(challenger);
        await registry.challenge(newsroomAddress, "", { from: challenger });

        const [, isWhitelisted] = await registry.listings(newsroomAddress);
        expect(isWhitelisted).to.be.false("Listing was not removed");

        const challengerFinalBal = await token.balanceOf(challenger);
        expect(challengerStartingBal).to.be.bignumber.equal(
          challengerFinalBal,
          "Tokens were not returned to challenger",
        );

        const applicantFinalBal = await token.balanceOf(applicant);
        expect(applicantStartingBal).to.be.bignumber.equal(applicantFinalBal, "Tokens were not returned to applicant");
      });
    });
  });
});
