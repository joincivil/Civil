import { Civil } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import { Bytes32, EthAddress } from "../../core/build/src/types";

export async function apply(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Apply to TCR");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const eip = await civil.getEIP20ForDeployedTCR();

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  console.log("approvedTokensForSpender: " + approvedTokensForSpender);
  if (approvedTokensForSpender.toNumber() < 1000) {
    const tokensToApprove = 1000;
    console.log("approve this many tokens: " + tokensToApprove);
    const approveTransaction = await eip.approveSpender(tcr.address, new BigNumber(tokensToApprove));
    await approveTransaction.awaitReceipt();
  }

  const applyTransaction = await tcr.apply(address, new BigNumber(1000), "test");
  await applyTransaction.awaitReceipt();
  console.log("Applied to TCR");
}

export async function challenge(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Challenging TCR Listing");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const eip = await civil.getEIP20ForDeployedTCR();

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  if (approvedTokensForSpender.toNumber() < 1000) {
    const approveTransaction = await eip.approveSpender(tcr.address, new BigNumber(1000));
    await approveTransaction.awaitReceipt();
  }

  const challengeTransaction = await tcr.challenge(address, "test");
  await challengeTransaction.awaitReceipt();
  console.log("Challenged TCR Listing");
}

export async function commitVote(
  pollID: BigNumber,
  voteOption: BigNumber,
  salt: BigNumber,
  numTokens: BigNumber,
  optionalCivil?: Civil,
): Promise<void> {
  const civil = optionalCivil || new Civil();

  const secretHash = getVoteSaltHash(voteOption.toString(), salt.toString());
  console.log("Commiting Vote. secretHash: " + secretHash);
  const voting = await civil.getVotingForDeployedTCR();
  const prevPollID = await voting.getPrevPollID(numTokens);

  const commitTransaction = await voting.commitVote(pollID, secretHash, numTokens, prevPollID);
  await commitTransaction.awaitReceipt();
  console.log("Vote Committed.");
}

export async function revealVote(
  pollID: BigNumber,
  voteOption: BigNumber,
  salt: BigNumber,
  optionalCivil?: Civil,
): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Revealing Vote.");
  const voting = await civil.getVotingForDeployedTCR();

  const revealTransaction = await voting.revealVote(pollID, voteOption, salt);
  await revealTransaction.awaitReceipt();
  console.log("Vote Revealed.");
}

export async function requestVotingRights(
  numTokens: BigNumber,
  optionalCivil?: Civil,
): Promise<void> {
  const civil = optionalCivil || new Civil();

  const voting = await civil.getVotingForDeployedTCR();
  const eip = await civil.getEIP20ForDeployedTCR();

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);
  if (approvedTokensForSpender < numTokens) {
    console.log("approving voting contract as token spender");
    const approveSpender = await eip.approveSpender(voting.address, numTokens);
    await approveSpender.awaitReceipt();
    console.log("voting contract approved");
  }

  console.log("Requesting Voting Rights");
  const requestRights = await voting.requestVotingRights(numTokens);
  await requestRights.awaitReceipt();
  console.log("Voting Rights Requested");
}

export async function withdrawVotingRights(
  numTokens: BigNumber,
  optionalCivil?: Civil,
): Promise<void> {
  const civil = optionalCivil || new Civil();

  const voting = await civil.getVotingForDeployedTCR();

  console.log("Withdrawing Voting Rights");
  await voting.withdrawVotingRights(numTokens);
  console.log("Voting Rights Withdrawn");
}

export async function updateStatus(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Update Listing Status");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const updateTransaction = await tcr.updateListing(address);
  await updateTransaction.awaitReceipt();
  console.log("Listing Status Updated");
}

export async function claimReward(pollID: BigNumber, salt: BigNumber, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Claim Reward");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const claimRewardTransaction = await tcr.claimReward(pollID, salt);
  await claimRewardTransaction.awaitReceipt();
  console.log("Reward Claimed.");
}
