import { Bytes32, Civil, EthAddress } from "@joincivil/core";
import { getVoteSaltHash } from "@joincivil/utils";
import BigNumber from "bignumber.js";

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
