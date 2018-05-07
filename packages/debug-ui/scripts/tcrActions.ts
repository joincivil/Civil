import { Bytes32, Civil, EthAddress } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";
import BigNumber from "bignumber.js";

export async function apply(address: EthAddress, deposit?: BigNumber, optionalCivil?: Civil): Promise<void> {
  let applicationDeposit = deposit;
  const civil = optionalCivil || new Civil();

  console.log("Apply to TCR");
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const eip = await tcr.getToken();
  if (!applicationDeposit) {
    applicationDeposit = await parameterizer.getParameterValue("minDeposit");
  }

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  console.log("approvedTokensForSpender: " + approvedTokensForSpender);
  if (approvedTokensForSpender.lessThan(applicationDeposit)) {
    console.log("approve this many tokens: " + applicationDeposit);
    const approveTransaction = await eip.approveSpender(tcr.address, applicationDeposit);
    await approveTransaction.awaitReceipt();
  }

  const applyTransaction = await tcr.apply(address, applicationDeposit, "test");
  await applyTransaction.awaitReceipt();
  console.log("Applied to TCR");
}

export async function challenge(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Challenging TCR Listing");
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const eip = await tcr.getToken();
  const deposit = await parameterizer.getParameterValue("minDeposit");
  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  if (approvedTokensForSpender.lessThan(deposit)) {
    const approveTransaction = await eip.approveSpender(tcr.address, deposit);
    await approveTransaction.awaitReceipt();
  }

  const challengeTransaction = await tcr.challenge(address, "test");
  await challengeTransaction.awaitReceipt();
  console.log("Challenged TCR Listing");
}

export async function requestAppeal(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Request Appeal on TCR Listing");
  const tcr = await civil.tcrSingletonTrusted();
  const government = await tcr.getGovernment();
  const fee = await government.getAppealFee();
  const eip = await tcr.getToken();
  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  if (approvedTokensForSpender.lessThan(fee)) {
    const approveTransaction = await eip.approveSpender(tcr.address, fee);
    await approveTransaction.awaitReceipt();
  }

  const requestAppealTransaction = await tcr.requestAppeal(address);
  await requestAppealTransaction.awaitReceipt();
  console.log("Appeal Requested for TCR Listing");
}

export async function grantAppeal(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Granting Appeal for TCR Listing");
  const tcr = await civil.tcrSingletonTrusted();
  const grantAppealTransaction = await tcr.grantAppeal(address);
  await grantAppealTransaction.awaitReceipt();
  console.log("Granted Appeal for TCR Listing");
}

export async function challengeGrantedAppeal(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Challenging Granted Appeal on TCR Listing");
  const tcr = await civil.tcrSingletonTrusted();
  const government = await tcr.getGovernment();
  const fee = await government.getAppealFee();
  const eip = await tcr.getToken();
  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  if (approvedTokensForSpender.lessThan(fee)) {
    const approveTransaction = await eip.approveSpender(tcr.address, fee);
    await approveTransaction.awaitReceipt();
  }

  const requestAppealTransaction = await tcr.challengeGrantedAppeal(address);
  await requestAppealTransaction.awaitReceipt();
  console.log("Challenged Granted Requested for TCR Listing");
}

export async function updateStatus(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Update Listing Status");
  const tcr = await civil.tcrSingletonTrusted();

  const updateTransaction = await tcr.updateStatus(address);
  await updateTransaction.awaitReceipt();
  console.log("Listing Status Updated");
}

export async function claimReward(pollID: BigNumber, salt: BigNumber, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Claim Reward");
  const tcr = await civil.tcrSingletonTrusted();

  const claimRewardTransaction = await tcr.claimReward(pollID, salt);
  await claimRewardTransaction.awaitReceipt();
  console.log("Reward Claimed.");
}
