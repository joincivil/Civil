import { EthAddress, TwoStepEthTransaction, StorageHeader } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { CivilErrors, getVoteSaltHash } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import { getCivil, getTCR } from "../helpers/civilInstance";

export function ensureWeb3BigNumber(num: number | BigNumber): any {
  const tNum = typeof num === "number" ? num : num.toNumber();
  const civil = getCivil();
  return civil.toBigNumber(tNum);
}

export async function publishContent(content: string): Promise<StorageHeader> {
  const civil = getCivil();
  return civil.publishContent(content);
}

export async function approveForChallenge(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const minDeposit = await parameterizer.getParameterValue("minDeposit");
  return approve(minDeposit);
}

export async function approveForApply(multisigAddress?: EthAddress): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const minDeposit = await parameterizer.getParameterValue("minDeposit");
  return approve(minDeposit, multisigAddress);
}

export async function approveForDeposit(
  amount: number | BigNumber,
  multisigAddress?: EthAddress,
): Promise<TwoStepEthTransaction | void> {
  return approve(amount, multisigAddress);
}

export async function approveForAppeal(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const government = await tcr.getGovernment();
  const appealFee = await government.getAppealFee();
  return approve(appealFee);
}

export async function approveForChallengeGrantedAppeal(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const government = await tcr.getGovernment();
  const appealFee = await government.getAppealFee();
  return approve(appealFee);
}

export async function approve(
  amount: number | BigNumber,
  multisigAddress?: EthAddress,
): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
  const token = await tcr.getToken();
  const amountBN = ensureWeb3BigNumber(amount);
  const balance = ensureWeb3BigNumber(await token.getBalance());
  if (balance.lessThan(amountBN)) {
    throw new Error(CivilErrors.InsufficientToken);
  }
  const approvedTokens = await token.getApprovedTokensForSpender(tcr.address, multisigAddress || undefined);
  console.log("approved tokens: " + approvedTokens + " - amount: " + amount);
  if (approvedTokens.lessThan(amountBN)) {
    return token.approveSpender(tcr.address, amountBN);
  }
}

export async function approveForProposeReparameterization(): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
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

export async function challengeGrantedAppeal(address: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  return tcr.challengeGrantedAppeal(address, data);
}

export async function challengeListing(address: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  return tcr.challenge(address, data);
}

export async function challengeListingWithUri(address: EthAddress, uri: string = ""): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  return tcr.challengeWithURI(address, uri);
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
  const tcr = await civil.tcrSingletonTrusted();
  const secretHash = getVoteSaltHash(voteOption.toString(), salt.toString());
  const voting = tcr.getVoting();
  const prevPollID = await voting.getPrevPollID(numTokens, pollID);

  return voting.commitVote(pollID, secretHash, numTokens, prevPollID);
}

export async function depositTokens(
  address: EthAddress,
  numTokens: BigNumber,
  multisigAddress?: EthAddress,
): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
  return tcr.deposit(address, ensureWeb3BigNumber(numTokens));
}

export async function appealChallenge(address: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  return tcr.requestAppeal(address, data);
}

export async function exitListing(address: EthAddress, multisigAddress?: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
  return tcr.exitListing(address);
}

export async function updateStatus(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
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
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  return Promise.all(params.map(async item => parameterizer.getParameterValue(item)));
}

export async function getGovernmentParameters(params: string[]): Promise<BigNumber[]> {
  const tcr = await getTCR();
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

export async function setAppellate(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const council = await civil.councilSingletonTrusted();
  return council.transferAppellate(address);
}

export async function getRawGrantAppeal(address: EthAddress): Promise<string> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const council = await tcr.getCouncil();
  const tx = await council.getRawGrantAppeal(address);
  return tx.data!;
}

export async function grantAppeal(address: EthAddress): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const council = await tcr.getCouncil();
  return council.grantAppeal(address);
}

export async function confirmAppeal(id: number): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const council = await tcr.getCouncil();
  return council.confirmAppeal(id);
}

export async function approveVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();

  const voting = tcr.getVoting();
  const eip = await tcr.getToken();

  const numTokensBN = ensureWeb3BigNumber(numTokens);
  const currentApprovedTokens = await voting.getNumVotingRights();
  const difference = numTokensBN.sub(currentApprovedTokens);
  if (difference.greaterThan(0)) {
    const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);
    if (approvedTokensForSpender < difference) {
      const approveSpenderReceipt = await eip.approveSpender(voting.address, difference);
      await approveSpenderReceipt.awaitReceipt();
    }
  }
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
  const tcr = await civil.tcrSingletonTrusted();
  const voting = tcr.getVoting();

  return voting.revealVote(pollID, voteOption, salt);
}

export async function withdrawTokens(
  address: EthAddress,
  numTokens: number | BigNumber,
  multisigAddress?: EthAddress,
): Promise<TwoStepEthTransaction> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrustedMultisigSupport(multisigAddress);
  return tcr.withdraw(address, ensureWeb3BigNumber(numTokens));
}

export async function proposeReparameterization(
  paramName: string,
  newValue: BigNumber,
): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const newValueBN = ensureWeb3BigNumber(newValue);
  return parameterizer.proposeReparameterization(paramName, newValueBN);
}

export async function challengeReparameterization(propID: string): Promise<TwoStepEthTransaction | void> {
  const tcr = await getTCR();
  const parameterizer = await tcr.getParameterizer();
  return parameterizer.challengeReparameterization(propID);
}

export async function updateReparameterizationProp(propID: string): Promise<TwoStepEthTransaction | void> {
  const tcr = await getTCR();
  const parameterizer = await tcr.getParameterizer();
  return parameterizer.processProposal(propID);
}

export const resolveReparameterizationChallenge = updateReparameterizationProp;

export async function updateGovernmentParameter(
  paramName: string,
  newValue: BigNumber,
): Promise<TwoStepEthTransaction | void> {
  const civil = getCivil();
  const tcr = await civil.tcrSingletonTrusted();
  const govt = await tcr.getGovernment();
  const newValueBN = ensureWeb3BigNumber(newValue);
  return govt.set(paramName, newValueBN);
}

export async function multiClaimRewards(
  challengeIDs: BigNumber[],
  salts: BigNumber[],
): Promise<TwoStepEthTransaction | void> {
  const ids = challengeIDs.map(ensureWeb3BigNumber);
  const saltz = salts.map(ensureWeb3BigNumber);
  const tcr = await getTCR();
  return tcr.multiClaimReward(ids, saltz);
}

export async function claimRewards(challengeID: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction | void> {
  const tcr = await getTCR();
  const challengeIDBN = ensureWeb3BigNumber(challengeID);
  const saltBN = ensureWeb3BigNumber(salt);
  return tcr.claimReward(challengeIDBN, saltBN);
}

export async function rescueTokens(challengeID: BigNumber): Promise<TwoStepEthTransaction | void> {
  const tcr = await getTCR();
  const civil = getCivil();
  const voting = tcr.getVoting();
  return voting.rescueTokens(civil.toBigNumber(challengeID.toString()));
}

export async function rescueTokensInMultiplePolls(pollIDs: BigNumber[]): Promise<TwoStepEthTransaction | void> {
  const tcr = await getTCR();
  const voting = tcr.getVoting();
  return voting.rescueTokensInMultiplePolls(pollIDs);
}

export async function withdrawVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction | void> {
  const tcr = await getTCR();
  const voting = tcr.getVoting();
  const numTokensBN = ensureWeb3BigNumber(numTokens);
  return voting.withdrawVotingRights(numTokensBN);
}

export async function signMessage(message: string): Promise<EthSignedMessage> {
  const civil = getCivil();
  return civil.signMessage(message);
}

export async function getConstitutionUri(): Promise<string> {
  const tcr = await getTCR();
  const government = await tcr.getGovernment();
  return government.getConstitutionURI();
}

export async function getConstitutionHash(): Promise<string> {
  const tcr = await getTCR();
  const government = await tcr.getGovernment();
  return government.getConstitutionHash();
}
