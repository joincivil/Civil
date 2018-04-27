import BigNumber from "bignumber.js";
import { getCivil } from "../helpers/civilInstance";
import { TwoStepEthTransaction, EthAddress } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";

export async function approveForChallenge(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const minDeposit = await parameterizer.getParameterValue("minDeposit");
  return approve(minDeposit);
}

export async function approveForAppeal(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const appealFee = await tcr.getAppealFee();
  return approve(appealFee);
}

export async function approve(amount: BigNumber): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const token = await tcr.getToken();

  const approvedTokens = await token.getApprovedTokensForSpender(tcr.address);
  if (approvedTokens < amount) {
    return token.approveSpender(tcr.address, amount);
  }
}

export async function applyToTCR(address: EthAddress, deposit: BigNumber): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.apply(address, deposit, "");
}

export async function challengeListing(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.challenge(address, "");
}

export async function appealChallenge(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.requestAppeal(address);
}

export async function updateListing(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.updateListing(address);
}

export async function getNewsroom(address: EthAddress): Promise<any> {
  const civil = getCivil();
  let newsroom;
  newsroom = await civil.newsroomAtUntrusted(address);
  return newsroom;
}

export async function requestVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();

  const voting = tcr.getVoting();
  const eip = await tcr.getToken();

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);
  if (approvedTokensForSpender < numTokens) {
    const approveSpender = await eip.approveSpender(voting.address, numTokens);
    await approveSpender.awaitReceipt();
  }

  return voting.requestVotingRights(numTokens);
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
  const prevPollID = await voting.getPrevPollID(numTokens);

  return voting.commitVote(pollID, secretHash, numTokens, prevPollID);
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
