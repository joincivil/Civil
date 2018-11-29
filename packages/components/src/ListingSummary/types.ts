import { EthAddress, AppealData } from "@joincivil/core";

export interface ListingSummaryComponentProps {
  listingAddress?: EthAddress;
  name?: string;
  description?: string;
  logoURL?: string;
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
  canResolveAppealChallenge?: boolean;
  isAwaitingAppealJudgement?: boolean;
  isAwaitingAppealChallenge?: boolean;
  canListingAppealBeResolved?: boolean;
  isInAppealChallengeCommitPhase?: boolean;
  isInAppealChallengeRevealPhase?: boolean;
  isAwaitingAppealJudgment?: boolean;
  isWhitelisted?: boolean;
  isUnderChallenge?: boolean;
  canListingAppealChallengeBeResolved?: boolean;
  appExpiry?: number;
  commitEndDate?: number;
  revealEndDate?: number;
  requestAppealExpiry?: number;
  appealPhaseExpiry?: number;
  appealOpenToChallengeExpiry?: number;
  whitelistedTimestamp?: number;
  unstakedDeposit?: string;
  challengeStake?: string;
  appealChallengeCommitEndDate?: number;
  appealChallengeRevealEndDate?: number;
}

export interface ChallengeOrAppealStatementSummaryProps {
  challengeID?: string;
  challengeStatementSummary?: string;
  appealStatementSummary?: string;
}

export interface NewsroomTaglineProps {
  description?: string;
}
