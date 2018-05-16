import BigNumber from "bignumber.js";
import { getCivil, getTCR } from "../helpers/civilInstance";
import { TwoStepEthTransaction, EthAddress } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";

export async function approveForChallenge(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const minDeposit = await parameterizer.getParameterValue("minDeposit");
  return approve(minDeposit);
}

export async function approveForApply(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const minDeposit = await parameterizer.getParameterValue("minDeposit");
  return approve(minDeposit);
}

export async function approveForAppeal(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const government = await tcr.getGovernment();
  const appealFee = await government.getAppealFee();
  return approve(appealFee);
}

export async function approveForChallengeGrantedAppeal(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const government = await tcr.getGovernment();
  const appealFee = await government.getAppealFee();
  return approve(appealFee);
}

export async function approve(amount: BigNumber): Promise<TwoStepEthTransaction | void> {
  console.log("approve");
  const civil = getCivil();
  console.log("civil gotten.");
  const tcr = civil.tcrSingletonTrusted();
  console.log("tcr gotten.");
  const token = await tcr.getToken();
  console.log("token address: " + token.address);
  const approvedTokens = await token.getApprovedTokensForSpender(tcr.address);
  console.log("approved tokens: " + approvedTokens + " - amount: " + amount);
  if (approvedTokens < amount) {
    return token.approveSpender(tcr.address, amount);
  }
}

export async function applyToTCR(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const deposit = await parameterizer.getParameterValue("minDeposit");
  return tcr.apply(address, deposit, "");
}

export async function challengeGrantedAppeal(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.challengeGrantedAppeal(address);
}

export async function challengeListing(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.challenge(address, "");
}

export async function commitVote(
  pollID: BigNumber,
  voteOption: BigNumber,
  salt: BigNumber,
  numTokens: BigNumber,
): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const secretHash = getVoteSaltHash(voteOption.toString(), salt.toString());
  const voting = tcr.getVoting();
  const prevPollID = await voting.getPrevPollID(numTokens, pollID);

  return voting.commitVote(pollID, secretHash, numTokens, prevPollID);
}

export async function depositTokens(address: EthAddress, numTokens: BigNumber): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.deposit(address, numTokens);
}

export async function appealChallenge(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.requestAppeal(address);
}

export async function exitListing(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.exitListing(address);
}

export async function updateStatus(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.updateStatus(address);
}

export async function getNewsroom(address: EthAddress): Promise<any> {
  const civil = getCivil();
  let newsroom;
  newsroom = await civil.newsroomAtUntrusted(address);
  return newsroom;
}

export async function getParameterValue(params: string[]): Promise<BigNumber[]> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  return Promise.all(params.map(async item => parameterizer.getParameterValue(item)));
}

export async function getGovernmentParameters(params: string[]): Promise<BigNumber[]> {
  const tcr = getTCR();
  const government = await tcr.getGovernment();
  return Promise.all(params.map(async item => government.getParameterValue(item)));
}

export async function getApplicationMaximumLengthInBlocks(): Promise<BigNumber> {
  const params = await getParameterValue([
    "applyStageLen",
    "commitStageLen",
    "revealStageLen",
    "challengeAppealLen",
    "challengeAppealCommitLen",
    "challengeAppealRevealLen",
  ]);
  const gov = await getGovernmentParameters(["judgeAppealPhaseLength", "requestAppealPhaseLength"]);
  // TODO: don't rely on constants
  return params
    .concat(gov)
    .reduce((acc, item) => {
      return acc.plus(item);
    }, new BigNumber(0))
    .dividedBy(25); // divided by a pessimistic guess about blocktime
}

export async function grantAppeal(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.grantAppeal(address);
}

export async function requestVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();

  const voting = tcr.getVoting();
  const eip = await tcr.getToken();

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);
  if (approvedTokensForSpender < numTokens) {
    const approveSpenderReceipt = await eip.approveSpender(voting.address, numTokens);
    await approveSpenderReceipt.awaitReceipt();
  }

  return voting.requestVotingRights(numTokens);
}

export async function revealVote(
  pollID: BigNumber,
  voteOption: BigNumber,
  salt: BigNumber,
): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const voting = tcr.getVoting();

  return voting.revealVote(pollID, voteOption, salt);
}

export async function withdrawTokens(address: EthAddress, numTokens: BigNumber): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.withdraw(address, numTokens);
}
