import BigNumber from "bignumber.js";
import { getCivil, getTCR } from "../helpers/civilInstance";
import { TwoStepEthTransaction, EthAddress, CivilErrors } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";

export function ensureWeb3BigNumber(num: number | BigNumber): any {
  const tNum = typeof num === "number" ? num : num.toNumber();
  const civil = getCivil();
  return civil.toBigNumber(tNum);
}

export async function approveForChallenge(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const minDeposit = await parameterizer.getParameterValue("minDeposit");
  return approve(minDeposit);
}

export async function approveForApply(multisigAddress?: EthAddress): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const minDeposit = await parameterizer.getParameterValue("minDeposit");
  return approve(minDeposit, multisigAddress);
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

export async function approve(
  amount: number | BigNumber,
  multisigAddress?: EthAddress,
): Promise<TwoStepEthTransaction | void> {
  console.log("approve");
  const civil = getCivil();
  console.log("civil gotten.", civil);
  const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
  console.log("tcr gotten.");
  const token = await tcr.getToken();
  const amountBN = ensureWeb3BigNumber(amount);
  console.log("token address: " + token.address);
  if ((await token.getBalance()) < amountBN) {
    throw new Error(CivilErrors.InsufficientToken);
  }
  const approvedTokens = await token.getApprovedTokensForSpender(tcr.address, multisigAddress || undefined);
  console.log("approved tokens: " + approvedTokens + " - amount: " + amount);
  if (approvedTokens < amountBN) {
    return token.approveSpender(tcr.address, amountBN);
  }
}

export async function approveForProposeReparameterization(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const eip = await tcr.getToken();
  const deposit = await parameterizer.getParameterValue("pMinDeposit");
  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(parameterizer.address);
  if (approvedTokensForSpender.lessThan(deposit)) {
    return eip.approveSpender(parameterizer.address, deposit);
  }
}
export const approveForProposalChallenge = approveForProposeReparameterization;

export async function applyToTCR(address: EthAddress, multisigAddress?: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
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
  _pollID: BigNumber,
  _voteOption: BigNumber,
  _salt: BigNumber,
  _numTokens: BigNumber,
): Promise<TwoStepEthTransaction> {
  const pollID = ensureWeb3BigNumber(_pollID);
  const voteOption = ensureWeb3BigNumber(_voteOption);
  const salt = ensureWeb3BigNumber(_salt);
  const numTokens = ensureWeb3BigNumber(_numTokens);
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const secretHash = getVoteSaltHash(voteOption.toString(), salt.toString());
  const voting = tcr.getVoting();
  const prevPollID = await voting.getPrevPollID(numTokens, pollID);

  return voting.commitVote(pollID, secretHash, numTokens, prevPollID);
}

export async function depositTokens(
  address: EthAddress,
  numTokens: number | BigNumber,
): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.deposit(address, ensureWeb3BigNumber(numTokens));
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

export async function getParameterValues(params: string[]): Promise<BigNumber[]> {
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
  const params = await getParameterValues([
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

  const numTokensBN = ensureWeb3BigNumber(numTokens);

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);
  if (approvedTokensForSpender < numTokensBN) {
    const approveSpenderReceipt = await eip.approveSpender(voting.address, numTokensBN);
    await approveSpenderReceipt.awaitReceipt();
  }

  return voting.requestVotingRights(numTokensBN);
}

export async function revealVote(
  _pollID: BigNumber,
  _voteOption: BigNumber,
  _salt: BigNumber,
): Promise<TwoStepEthTransaction> {
  const pollID = ensureWeb3BigNumber(_pollID);
  const voteOption = ensureWeb3BigNumber(_voteOption);
  const salt = ensureWeb3BigNumber(_salt);
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const voting = tcr.getVoting();

  return voting.revealVote(pollID, voteOption, salt);
}

export async function withdrawTokens(
  address: EthAddress,
  numTokens: number | BigNumber,
): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  return tcr.withdraw(address, ensureWeb3BigNumber(numTokens));
}

export async function proposeReparameterization(
  paramName: string,
  newValue: BigNumber,
): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  return parameterizer.proposeReparameterization(paramName, newValue);
}

export async function challengeReparameterization(propID: string): Promise<TwoStepEthTransaction | void> {
  const tcr = getTCR();
  const parameterizer = await tcr.getParameterizer();
  return parameterizer.challengeReparameterization(propID);
}

export async function updateReparameterizationProp(propID: string): Promise<TwoStepEthTransaction | void> {
  const tcr = getTCR();
  const parameterizer = await tcr.getParameterizer();
  return parameterizer.processProposal(propID);
}

export const resolveReparameterizationChallenge = updateReparameterizationProp;

export async function updateGovernmentParameter(
  paramName: string,
  newValue: BigNumber,
): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = civil.tcrSingletonTrusted();
  const govt = await tcr.getGovernment();
  return govt.set(paramName, newValue);
}

export async function claimRewards(challengeID: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction | void> {
  const tcr = getTCR();
  return tcr.claimReward(challengeID, salt);
}

export async function rescueTokens(challengeID: BigNumber): Promise<TwoStepEthTransaction | void> {
  const tcr = getTCR();
  const voting = tcr.getVoting();
  return voting.rescueTokens(challengeID);
}
