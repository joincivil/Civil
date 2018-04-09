import { Bytes32, Civil, EthAddress } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";
import BigNumber from "bignumber.js";

export async function proposeReparameterization(
  propName: string,
  newValue: BigNumber,
  optionalCivil?: Civil,
): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Propose Reparameterization");
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const eip = await civil.getEIP20ForDeployedTCR();
  const deposit = await parameterizer.getParameterValue("pMinDeposit");

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(parameterizer.address);
  console.log("approvedTokensForSpender: " + approvedTokensForSpender);
  if (approvedTokensForSpender.lessThan(deposit)) {
    console.log("approve this many tokens: " + deposit);
    const approveTransaction = await eip.approveSpender(parameterizer.address, deposit);
    await approveTransaction.awaitReceipt();
  }

  const proposeTransaction = await parameterizer.proposeReparameterization(propName, newValue);
  await proposeTransaction.awaitReceipt();
  console.log("Reparameterization Proposed");
}

export async function challengeProp(propID: string, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Challenging Reparameterization");
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const eip = await civil.getEIP20ForDeployedTCR();
  const deposit = await parameterizer.getParameterValue("pMinDeposit");

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(parameterizer.address);
  if (approvedTokensForSpender.lessThan(deposit)) {
    const approveTransaction = await eip.approveSpender(parameterizer.address, deposit);
    await approveTransaction.awaitReceipt();
  }

  const challengeTransaction = await parameterizer.challengeReparameterization(propID);
  await challengeTransaction.awaitReceipt();
  console.log("Reparameterization Challenged");
}

export async function updateProp(propID: Bytes32, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Update Proposal Status");
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const updateTransaction = await parameterizer.processProposal(propID);
  await updateTransaction.awaitReceipt();
  console.log("Proposal Status Updated");
}

export async function claimReward(pollID: BigNumber, salt: BigNumber, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Claim Reward");
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const claimRewardTransaction = await parameterizer.claimReward(pollID, salt);
  await claimRewardTransaction.awaitReceipt();
  console.log("Reward Claimed.");
}
