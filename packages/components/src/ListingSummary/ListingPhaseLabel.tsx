import * as React from "react";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  AwaitingAppealRequestLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "../ApplicationPhaseStatusLabels";
import { ListingSummaryComponentProps } from "./types";

const ListingPhaseLabel: React.SFC<ListingSummaryComponentProps> = props => {
  const {
    isInApplication,
    inChallengeCommitVotePhase,
    isInAppealChallengeCommitPhase,
    inChallengeRevealPhase,
    isInAppealChallengeRevealPhase,
    isAwaitingAppealRequest,
    canBeWhitelisted,
    canResolveChallenge,
    canListingAppealBeResolved,
    canListingAppealChallengeBeResolved,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
  } = props;

  if (isInApplication) {
    return <AwaitingApprovalStatusLabel />;
  } else if (inChallengeCommitVotePhase || isInAppealChallengeCommitPhase) {
    return <CommitVoteStatusLabel />;
  } else if (inChallengeRevealPhase || isInAppealChallengeRevealPhase) {
    return <RevealVoteStatusLabel />;
  } else if (isAwaitingAppealRequest) {
    return <AwaitingAppealRequestLabel />;
  } else if (
    canBeWhitelisted ||
    canResolveChallenge ||
    canListingAppealChallengeBeResolved ||
    canListingAppealBeResolved
  ) {
    return <ReadyToCompleteStatusLabel />;
  } else if (isAwaitingAppealJudgement) {
    return <AwaitingDecisionStatusLabel />;
  } else if (isAwaitingAppealChallenge) {
    return <AwaitingAppealChallengeStatusLabel />;
  }

  return null;
};

export default ListingPhaseLabel;
