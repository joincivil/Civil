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
  const tcr = await civil.tcrSingletonTrusted();
  const secretHash = getVoteSaltHash(voteOption.toString(), salt.toString());
  console.log("Commiting Vote. secretHash: " + secretHash);
  const voting = tcr.getVoting();
  const prevPollID = await voting.getPrevPollID(numTokens, pollID);

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
  const tcr = await civil.tcrSingletonTrusted();

  console.log("Revealing Vote.");
  const voting = tcr.getVoting();

  const revealTransaction = await voting.revealVote(pollID, voteOption, salt);
  await revealTransaction.awaitReceipt();
  console.log("Vote Revealed.");
}

export async function requestVotingRights(numTokens: BigNumber, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();
  const tcr = await civil.tcrSingletonTrusted();

  const voting = tcr.getVoting();
  const eip = await tcr.getToken();

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(voting.address);
  if (approvedTokensForSpender < numTokens) {
    console.log("approving voting contract as token spender");
    const approveSpender = await eip.approveSpender(voting.address, numTokens);
    await approveSpender.awaitReceipt();
    console.log("voting contract approved");
  }

  console.log("Requesting Voting Rights");
  const requestRights = await voting.requestVotingRights(numTokens);
  if (requestRights) {
    await requestRights.awaitReceipt();
    console.log("Voting Rights Requested");
  }
}

export async function withdrawVotingRights(numTokens: BigNumber, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();
  const tcr = await civil.tcrSingletonTrusted();

  const voting = tcr.getVoting();
  const eip = await tcr.getToken();

  console.log("Withdrawing Voting Rights");
  await voting.withdrawVotingRights(numTokens);
  console.log("Voting Rights Withdrawn");
}
