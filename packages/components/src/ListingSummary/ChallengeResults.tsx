import * as React from "react";
import {
  ListingSummaryComponentProps,
  ListingSummaryAppealChallengeResultsProps as AppealChallengeResultsProps,
} from "./types";
import { ChallengeResults as ChallengeResultsComponent, ChallengeResultsProps } from "../ChallengeResultsChart";

export interface ListingSummaryChallengeResultsProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export interface ListingSummaryAppealChallengeResultsProps
  extends ListingSummaryComponentProps,
    Partial<AppealChallengeResultsProps> {}

import { StyledChallengeResultsHeader, ChallengeResultsContain } from "./styledComponents";

const ChallengeResults: React.SFC<ListingSummaryChallengeResultsProps> = props => {
  const {
    canBeWhitelisted,
    canResolveChallenge,
    isAwaitingAppealRequest,
    isAwaitingAppealJudgement,
    canListingAppealBeResolved,
    isAwaitingAppealChallenge,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
    isUnderChallenge,
    isRejected,
    canListingAppealChallengeBeResolved,
    challengeID,
    totalVotes,
    votesFor,
    votesAgainst,
    percentFor,
    percentAgainst,
    didChallengeSucceed,
  } = props;

  if (
    !(
      canBeWhitelisted ||
      canResolveChallenge ||
      isAwaitingAppealRequest ||
      isAwaitingAppealJudgement ||
      canListingAppealBeResolved ||
      isAwaitingAppealChallenge ||
      isInAppealChallengeCommitPhase ||
      isInAppealChallengeRevealPhase ||
      canListingAppealChallengeBeResolved ||
      (isRejected && !isUnderChallenge)
    )
  ) {
    return null;
  }

  const challengeIDDisplay = !!challengeID ? `#${challengeID}` : "";
  return (
    <ChallengeResultsContain>
      <ChallengeResultsComponent
        headerText={`Challenge ${challengeIDDisplay} Results`}
        styledHeaderComponent={StyledChallengeResultsHeader}
        totalVotes={totalVotes!}
        votesFor={votesFor!}
        votesAgainst={votesAgainst!}
        percentFor={percentFor!}
        percentAgainst={percentAgainst!}
        didChallengeSucceed={didChallengeSucceed!}
      />
    </ChallengeResultsContain>
  );
};

export const AppealChallengeResults: React.SFC<ListingSummaryAppealChallengeResultsProps> = props => {
  const {
    canListingAppealChallengeBeResolved,
    appealChallengeID,
    appealChallengeTotalVotes,
    appealChallengeVotesFor,
    appealChallengeVotesAgainst,
    appealChallengePercentFor,
    appealChallengePercentAgainst,
    didAppealChallengeSucceed,
    isRejected,
    isUnderChallenge,
  } = props;

  if ((!canListingAppealChallengeBeResolved && !(isRejected && !isUnderChallenge)) || !appealChallengeID) {
    return null;
  }

  const challengeIDDisplay = !!appealChallengeID ? `#${appealChallengeID}` : "";
  return (
    <ChallengeResultsContain>
      <ChallengeResultsComponent
        headerText={`Appeal Challenge ${challengeIDDisplay} Results`}
        styledHeaderComponent={StyledChallengeResultsHeader}
        totalVotes={appealChallengeTotalVotes!}
        votesFor={appealChallengeVotesFor!}
        votesAgainst={appealChallengeVotesAgainst!}
        percentFor={appealChallengePercentFor!}
        percentAgainst={appealChallengePercentAgainst!}
        didChallengeSucceed={didAppealChallengeSucceed!}
        isAppealChallenge={true}
      />
    </ChallengeResultsContain>
  );
};

export default ChallengeResults;
