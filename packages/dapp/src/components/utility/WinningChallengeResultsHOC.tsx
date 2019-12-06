import { challengeHelpers, appealChallengeHelpers, getFormattedTokenBalance } from "@joincivil/utils";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "@joincivil/components";

import { BigNumber, ChallengeData, AppealChallengeData } from "@joincivil/typescript-types";

export interface WinningChallengeResultsProps {
  displayExplanation?: boolean;
}

export const getChallengeViewProps = (challenge: ChallengeData) => {
  const totalVotes = challenge && challenge.poll.votesAgainst.add(challenge.poll.votesFor);

  let voteType;
  let votesCount;
  let votesPercent;

  if (challengeHelpers.didChallengeOriginallySucceed(challenge)) {
    voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
    votesCount = getFormattedTokenBalance(challenge.poll.votesAgainst);

    votesPercent = totalVotes.isZero()
      ? "0"
      : challenge.poll.votesAgainst
          .div(totalVotes)
          .mul(new BigNumber(100))
          .toString();
  } else {
    voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMAIN;
    votesCount = getFormattedTokenBalance(challenge.poll.votesFor);
    votesPercent = totalVotes.isZero()
      ? "0"
      : challenge.poll.votesFor
          .div(totalVotes)
          .mul(new BigNumber(100))
          .toString();
  }
  return { voteType, votesCount, votesPercent };
};

export const getAppealChallengeViewProps = (appealChallenge: AppealChallengeData) => {
  const totalVotes = appealChallenge && appealChallenge.poll.votesAgainst.add(appealChallenge.poll.votesFor);

  let voteType;
  let votesCount;
  let votesPercent;

  if (appealChallengeHelpers.didAppealChallengeSucceed(appealChallenge)) {
    voteType = CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN;
    votesCount = getFormattedTokenBalance(appealChallenge.poll.votesFor);
    votesPercent = totalVotes.isZero()
      ? "0"
      : appealChallenge.poll.votesFor
          .div(totalVotes)
          .mul(new BigNumber(100))
          .toString();
  } else {
    voteType = CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD;
    votesCount = getFormattedTokenBalance(appealChallenge.poll.votesAgainst);
    votesPercent = totalVotes.isZero()
      ? "0"
      : appealChallenge.poll.votesAgainst
          .div(totalVotes)
          .mul(new BigNumber(100))
          .toString();
  }
  return { voteType, votesCount, votesPercent };
};
