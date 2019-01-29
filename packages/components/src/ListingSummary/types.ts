import { EthAddress, AppealData, CharterData } from "@joincivil/core";

export interface ListingSummaryComponentViewProps {
  listingSummaryActionDetails?: JSX.Element;
}

export interface ListingSummaryComponentProps {
  listingAddress?: EthAddress;
  name?: string;
  charter?: CharterData;
  listingDetailURL?: string;
  challengeID?: string;
  challengeStatementSummary?: string;
  appeal?: AppealData;
  appealStatementSummary?: string;
  isInApplication?: boolean;
  canBeChallenged?: boolean;
  canBeWhitelisted?: boolean;
  inChallengeCommitVotePhase?: boolean;
  inChallengeRevealPhase?: boolean;
  isAwaitingAppealRequest?: boolean;
  didListingChallengeSucceed?: boolean;
  canResolveChallenge?: boolean;
  isAwaitingAppealJudgement?: boolean;
  isAwaitingAppealChallenge?: boolean;
  canListingAppealBeResolved?: boolean;
  isInAppealChallengeCommitPhase?: boolean;
  isInAppealChallengeRevealPhase?: boolean;
  isWhitelisted?: boolean;
  isUnderChallenge?: boolean;
  canListingAppealChallengeBeResolved?: boolean;
  whitelistedTimestamp?: number;
  appExpiry?: number;
  commitEndDate?: number;
  revealEndDate?: number;
  requestAppealExpiry?: number;
  appealPhaseExpiry?: number;
  appealOpenToChallengeExpiry?: number;
  unstakedDeposit?: string;
  challengeStake?: string;
  appealChallengeCommitEndDate?: number;
  appealChallengeRevealEndDate?: number;
  appealChallengeID?: string;
  appealChallengeStatementSummary?: string;
}

export interface WhitelistedSummaryComponentProps {
  whitelistedTimestamp?: number;
}

export interface ChallengeOrAppealStatementSummaryProps {
  challengeID?: string;
  challengeStatementSummary?: string;
  appealStatementSummary?: string;
  appealChallengeID?: string;
  appealChallengeStatementSummary?: string;
}

export interface NewsroomTaglineProps {
  description?: string;
}
