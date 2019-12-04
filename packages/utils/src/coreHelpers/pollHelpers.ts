import { BigNumber, PollData } from "@joincivil/typescript-types";

export const pollHelpers = { isInCommitStage, isInRevealStage, isVotePassed };

/**
 * Checks if a Poll is in the Commit stage
 * @param pollData the PollData to check
 */
function isInCommitStage(pollData: PollData): boolean {
  return parseInt(pollData.commitEndDate.toString(), 10) > Date.now() / 1000;
}

/**
 * Checks if a Poll is in the Reveal stage
 * @param pollData the PollData to check
 */
function isInRevealStage(pollData: PollData): boolean {
  return !isInCommitStage(pollData) && parseInt(pollData.revealEndDate.toString(), 10) > Date.now() / 1000;
}

/**
 * Checks if a Poll is passed
 * @param pollData the PollData to check
 */
function isVotePassed(pollData: PollData): boolean {
  if (isInCommitStage(pollData) || isInRevealStage(pollData)) {
    return false;
  }
  const votesFor = new BigNumber(pollData.votesFor);
  const votesAgainst = new BigNumber(pollData.votesAgainst);
  // @ts-ignore
  // 100 should be `new BN` but  ethers ethers/web3 bn.js are not compatible
  const votesForTimes100 = votesFor.mul(new BigNumber(100));
  const quorum = new BigNumber(pollData.voteQuorum);
  return votesForTimes100.gt(quorum.mul(votesFor.add(votesAgainst)));
}
