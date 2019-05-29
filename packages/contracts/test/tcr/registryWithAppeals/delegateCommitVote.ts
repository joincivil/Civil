import { configureChai } from "@joincivil/dev-utils";
import { DecodedLogEntry } from "@joincivil/typescript-types";
import * as chai from "chai";
import * as utils from "../../utils/contractutils";
import { getVoteSaltHash } from "@joincivil/utils";

const PLCRVoting = artifacts.require("CivilPLCRVoting");
const DelegateFactory = artifacts.require("DelegateFactory");
const Delegate = artifacts.require("Delegate");
const CivilToken = artifacts.require("CVLToken");
utils.configureProviders(PLCRVoting);

configureChai(chai);
const expect = chai.expect;

const CONTRACT_EVENT = "_DelegateCreated";
function createdContract(factory: any, txReceipt: any): string {
  const myLog = txReceipt.logs.find((log: any) => log.event === CONTRACT_EVENT && log.address === factory.address) as
    | DecodedLogEntry
    | undefined;

  if (!myLog) {
    throw new Error("ContractInstantation log not found");
  }
  return myLog.args.delegateAddress;
}

contract("Registry", accounts => {
  describe("Function: delegateCommitVote", async () => {
    const [JAB, applicant, challenger, voterAlice, voterBob] = accounts;
    const minDeposit = utils.toBaseTenBigNumber(utils.paramConfig.minDeposit);
    let registry: any;
    let voting: any;
    let token: any;
    let testNewsroom: any;
    let newsroomAddress: string;
    let delegateFactory: any;
    let delegate: any;
    let delegateAddress: any;

    before(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
      const votingAddress = await registry.voting();
      const tokenAddress = await registry.token();
      voting = await PLCRVoting.at(votingAddress);
      token = await CivilToken.at(tokenAddress);

      delegateFactory = await DelegateFactory.new(tokenAddress, votingAddress, registry.address);
    });

    beforeEach(async () => {
      testNewsroom = await utils.createDummyNewsrom(applicant);
      newsroomAddress = testNewsroom.address;

      const delegateReceipt = await delegateFactory.createDelegate("asdf", { from: applicant });
      delegate = Delegate.at(createdContract(delegateFactory, delegateReceipt));
      delegateAddress = await delegate.address;
    });

    it("can deposit to delegate and delegate can commit vote", async () => {
      await utils.addToWhitelist(newsroomAddress, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(newsroomAddress, challenger, registry);
      await token.approve(delegateAddress, 100, { from: voterAlice });
      await delegate.deposit(100, { from: voterAlice });
      const hash = getVoteSaltHash("1", "123");
      const prevPollID = await voting.getInsertPointForNumTokens.call(delegateAddress, 100, pollID);

      await delegate.commitVote(pollID, hash, 100, prevPollID, { from: applicant });
    });

    it("should be able to withdraw tokens immediately after depositing", async () => {
      await token.approve(delegateAddress, 100, { from: voterAlice });
      await delegate.deposit(100, { from: voterAlice });
      await delegate.beginWithdrawal(100, { from: voterAlice });
      await delegate.finishWithdrawal({ from: voterAlice });
    });
  });
});
