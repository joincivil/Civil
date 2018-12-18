import { getFormattedTokenBalance } from "@joincivil/utils";
import { WrappedChallengeData } from "@joincivil/core";
import { ChallengeResultsProps } from "@joincivil/components";

export const getChallengeResultsProps = (challengeData: WrappedChallengeData): ChallengeResultsProps => {
  let totalVotes = "";
  let votesFor = "";
  let votesAgainst = "";
  let percentFor = "";
  let percentAgainst = "";

  if (challengeData) {
    const challenge = challengeData.challenge;
    const totalVotesBN = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    totalVotes = getFormattedTokenBalance(totalVotesBN);
    votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    percentFor = challenge.poll.votesFor
      .div(totalVotesBN)
      .mul(100)
      .toFixed(0);
    percentAgainst = challenge.poll.votesAgainst
      .div(totalVotesBN)
      .mul(100)
      .toFixed(0);
  }

  return {
    totalVotes,
    votesFor,
    votesAgainst,
    percentFor,
    percentAgainst,
  };
};
