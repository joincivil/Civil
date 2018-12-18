import { getFormattedTokenBalance } from "@joincivil/utils";
import { ChallengeData } from "@joincivil/core";
import { ChallengeResultsProps } from "@joincivil/components";

export const getChallengeResultsProps = (challengeData?: ChallengeData): ChallengeResultsProps => {
  let totalVotes = "";
  let votesFor = "";
  let votesAgainst = "";
  let percentFor = "";
  let percentAgainst = "";

  if (challengeData) {
    const totalVotesBN = challengeData.poll.votesAgainst.add(challengeData.poll.votesFor);
    totalVotes = getFormattedTokenBalance(totalVotesBN);
    votesFor = getFormattedTokenBalance(challengeData.poll.votesFor);
    votesAgainst = getFormattedTokenBalance(challengeData.poll.votesAgainst);
    percentFor = challengeData.poll.votesFor
      .div(totalVotesBN)
      .mul(100)
      .toFixed(0);
    percentAgainst = challengeData.poll.votesAgainst
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
