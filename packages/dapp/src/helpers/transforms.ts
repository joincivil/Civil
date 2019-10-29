import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  AppealChallengeData,
  ChallengeData,
  didChallengeSucceed as getDidChallengeSucceed,
  didAppealChallengeSucceed as getDidAppealChallengeSucceed,
  didChallengeOriginallySucceed as getDidChallengeOriginallySucceed,
  doesChallengeHaveAppeal as getDoesChallengeHaveAppeal,
  isAppealAwaitingJudgment,
} from "@joincivil/core";
import { ChallengeResultsProps } from "@joincivil/components";

import { BigNumber } from "@joincivil/typescript-types";

const getBaseChallengeResults = (
  challengeData: ChallengeData | AppealChallengeData,
): Partial<ChallengeResultsProps> => {
  let totalVotes = "";
  let votesFor = "";
  let votesAgainst = "";
  let percentFor = "";
  let percentAgainst = "";
  const hundred = new BigNumber(100);

  const totalVotesBN = challengeData.poll.votesAgainst.add(challengeData.poll.votesFor);
  totalVotes = getFormattedTokenBalance(totalVotesBN);
  votesFor = getFormattedTokenBalance(challengeData.poll.votesFor);
  votesAgainst = getFormattedTokenBalance(challengeData.poll.votesAgainst);
  if (challengeData.poll.votesFor.isZero()) {
    percentFor = "0";
    percentAgainst = "100";
  } else {
    percentFor = challengeData.poll.votesFor
      .mul(hundred)
      .div(totalVotesBN)
      .toString();
    percentAgainst = challengeData.poll.votesAgainst
      .mul(hundred)
      .div(totalVotesBN)
      .toString();
  }

  return {
    totalVotes,
    votesFor,
    votesAgainst,
    percentFor,
    percentAgainst,
  };
};

export const getChallengeResultsProps = (challengeData: ChallengeData): ChallengeResultsProps | {} => {
  if (!challengeData) {
    return {};
  }
  const baseChallengeResults = getBaseChallengeResults(challengeData);
  const didChallengeSucceed = getDidChallengeSucceed(challengeData);
  const didChallengeOriginallySucceed = getDidChallengeOriginallySucceed(challengeData);
  const doesChallengeHaveAppeal = getDoesChallengeHaveAppeal(challengeData);
  const isAwaitingAppealJudgement = challengeData.appeal && isAppealAwaitingJudgment(challengeData.appeal);

  return {
    ...(baseChallengeResults as ChallengeResultsProps),
    didChallengeSucceed,
    didChallengeOriginallySucceed,
    doesChallengeHaveAppeal,
    isAwaitingAppealJudgement,
  };
};

export const getAppealChallengeResultsProps = (appealChallengeData: AppealChallengeData) => {
  if (!appealChallengeData) {
    return {};
  }
  const {
    totalVotes: appealChallengeTotalVotes,
    votesFor: appealChallengeVotesFor,
    votesAgainst: appealChallengeVotesAgainst,
    percentFor: appealChallengePercentFor,
    percentAgainst: appealChallengePercentAgainst,
  } = getBaseChallengeResults(appealChallengeData);
  const didAppealChallengeSucceed = getDidAppealChallengeSucceed(appealChallengeData);

  return {
    appealChallengeTotalVotes,
    appealChallengeVotesFor,
    appealChallengeVotesAgainst,
    appealChallengePercentFor,
    appealChallengePercentAgainst,
    didAppealChallengeSucceed,
  };
};
