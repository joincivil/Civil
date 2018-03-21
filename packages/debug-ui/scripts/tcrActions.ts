import { Civil } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/dev-utils";
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
    const twoStep = await eip.approveSpender(tcr.address, new BigNumber(tokensToApprove));
    twoStep.awaitReceipt();
  }
  // TODO: await receipt properly
  const { awaitReceipt } = await tcr.apply(address, new BigNumber(1000), "test");
  const applyReceipt = await awaitReceipt;
  console.log("Applied to TCR");
}

export async function challenge(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Challenging TCR Listing");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const eip = await civil.getEIP20ForDeployedTCR();

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  if (approvedTokensForSpender.toNumber() < 1000) {
    await eip.approveSpender(tcr.address, new BigNumber(1000));
  }

  // TODO: await receipt properly
  const { awaitReceipt } = await tcr.challenge(address, "test");
  const applyReceipt = await awaitReceipt;
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

  const awaitCommit = await voting.commitVote(pollID, secretHash, numTokens, prevPollID);
  const await2 = await awaitCommit.awaitReceipt;
  console.log("Vote Committed.");
}

export async function revealVote(
  pollID: BigNumber,
  voteOption: BigNumber,
  salt: BigNumber,
  optionalCivil?: Civil,
): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Commiting Vote.");
  const voting = await civil.getVotingForDeployedTCR();

  const awaitCommit = await voting.revealVote(pollID, voteOption, salt);
  const await2 = await awaitCommit.awaitReceipt;
  console.log("Vote Committed.");
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
    await eip.approveSpender(voting.address, numTokens);
    console.log("voting contract approved");
  }

  console.log("Requesting Voting Rights");
  await voting.requestVotingRights(numTokens);
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

  // TODO: await receipt properly
  const { awaitReceipt } = await tcr.updateListing(address);
  const applyReceipt = await awaitReceipt;
  console.log("Listing Status Updated");
}

export async function resolvePostAppeal(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Resolve Post Appeal Phase");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  // TODO: await receipt properly
  const { awaitReceipt } = await tcr.resolvePostAppealPhase(address);
  const applyReceipt = await awaitReceipt;
  console.log("Post Appeal Phase Resolved");
}
