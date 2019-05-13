import { PollData } from "../../types";

/**
 * Checks if a Poll is in the Commit stage
 * @param pollData the PollData to check
 */
export function isInCommitStage(pollData: PollData): boolean {
  return pollData.commitEndDate.toNumber() > Date.now() / 1000;
}

/**
 * Checks if a Poll is in the Reveal stage
 * @param pollData the PollData to check
 */
export function isInRevealStage(pollData: PollData): boolean {
  return !isInCommitStage(pollData) && pollData.revealEndDate.toNumber() > Date.now() / 1000;
}

/**
 * Checks if a Poll is passed
 * @param pollData the PollData to check
 */
export function isVotePassed(pollData: PollData): boolean {
  if (isInCommitStage(pollData) || isInRevealStage(pollData)) {
    return false;
  }
  const votesFor = pollData.votesFor.toNumber();
  const votesAgainst = pollData.votesAgainst.toNumber();
  const votesForTimes100 = votesFor * 100;
  const quorum = pollData.voteQuorum.toNumber();
  return votesForTimes100 > quorum * (votesFor + votesAgainst);
}
