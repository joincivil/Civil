import * as chai from "chai";
import { REVERTED } from "../../utils/constants";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

const Parameterizer = artifacts.require("Parameterizer");
const Token = artifacts.require("EIP20.sol");

ChaiConfig();
const expect = chai.expect;

contract("Parameterizer", (accounts) => {
  describe("Function: proposeReparameterization", () => {
    const [proposer, secondProposer] = accounts;
    const pMinDeposit = utils.toBaseTenBigNumber(utils.paramConfig.pMinDeposit);
    let parameterizer: any;
    let token: any;

    before(async () => {
      // await createTestParameterizerInstance(accounts);
      parameterizer = await Parameterizer.deployed();
      const tokenAddress = await parameterizer.token();
      token = await Token.at(tokenAddress);
    });

    it("should add a new reparameterization proposal", async () => {
      const applicantStartingBalance = await token.balanceOf.call(proposer);

      const receipt = await parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer });

      const propID = utils.getReceiptValue(receipt, "propID");
      const paramProposal = await parameterizer.proposals(propID);

      expect(paramProposal[6]).to.be.bignumber.equal(
        "51",
        "The reparameterization proposal was not created, or not created correctly.",
      );

      const applicantFinalBalance = await token.balanceOf.call(proposer);
      const expected = applicantStartingBalance.sub(pMinDeposit);
      expect(applicantFinalBalance).to.be.bignumber.equal(
        expected,
        "tokens were not properly transferred from proposer",
      );
    });

    it("should not allow a NOOP reparameterization", async () => {
        await expect(parameterizer.proposeReparameterization("voteQuorum", "51", { from: proposer }))
        .to.eventually.be.rejectedWith(REVERTED, "Performed NOOP reparameterization");
    });

    it("should not allow a reparameterization for a proposal that already exists", async () => {
      const applicantStartingBalance = await token.balanceOf.call(secondProposer);

      await expect(parameterizer.proposeReparameterization("voteQuorum", "51", { from: secondProposer }))
      .to.eventually.be.rejectedWith(REVERTED, "should not have been able to make duplicate proposal");

      const applicantEndingBalance = await token.balanceOf.call(secondProposer);

      expect(applicantEndingBalance).to.be.bignumber.equal(
        applicantStartingBalance,
        "starting balance and ending balance should have been equal");
    });
  });
});
