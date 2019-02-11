export interface DashboardActivityItemLogo {
  logoUrl?: string;
}

export interface DashboardActivityItemTitleProps {
  title: string;
}

export interface DashboardActivityItemCTAButtonProps {
  listingDetailURL?: string;
  inChallengeCommitVotePhase: boolean;
  inChallengeRevealPhase: boolean;
  isAwaitingAppealRequest: boolean;
  canResolveChallenge: boolean;
  isAwaitingAppealChallenge: boolean;
  canListingAppealBeResolved: boolean;
  isInAppealChallengeCommitPhase: boolean;
  isInAppealChallengeRevealPhase: boolean;
  canListingAppealChallengeBeResolved: boolean;
  didUserCommit?: boolean;
  canUserCollect?: boolean;
  canUserRescue?: boolean;
  onClick?(): void;
}

export type DashboardActivityItemProps = DashboardActivityItemLogo &
  DashboardActivityItemTitleProps &
  DashboardActivityItemCTAButtonProps;
