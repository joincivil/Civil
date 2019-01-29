import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import { ChallengeResults as ChallengeResultsComponent, ChallengeResultsProps } from "../ChallengeResultsChart";

export interface ListingSummaryChallengeResultsProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

import { StyledChallengeResultsHeader, ChallengeResultsContain } from "./styledComponents";

const ChallengeResults: React.SFC<ListingSummaryChallengeResultsProps> = props => {
  const {
    canBeWhitelisted,
    canResolveChallenge,
    isAwaitingAppealRequest,
    isAwaitingAppealJudgement,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
    isAwaitingAppealChallenge,
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
      isAwaitingAppealRequest ||
      isAwaitingAppealJudgement ||
      isInAppealChallengeCommitPhase ||
      isInAppealChallengeRevealPhase ||
      isAwaitingAppealChallenge ||
      canBeWhitelisted ||
      canResolveChallenge
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

export default ChallengeResults;
