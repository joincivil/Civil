import { Bytes32, Civil, EthAddress } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";
import BigNumber from "bignumber.js";

export async function apply(address: EthAddress, deposit?: BigNumber, optionalCivil?: Civil): Promise<void> {
  let applicationDeposit = deposit;
  const civil = optionalCivil || new Civil();

  console.log("Apply to TCR");
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const eip = await civil.getEIP20ForDeployedTCR();
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
  const eip = await civil.getEIP20ForDeployedTCR();
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

export async function updateStatus(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Update Listing Status");
  const tcr = await civil.tcrSingletonTrusted();

  const updateTransaction = await tcr.updateListing(address);
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
