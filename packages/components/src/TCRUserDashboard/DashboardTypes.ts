export interface DashboardActivityItemLogo {
  logoUrl?: string;
}

export interface DashboardActivityItemTitleProps {
  title: string;
}

export interface DashboardActivityItemCTAButtonProps {
  listingDetailURL?: string;
  inCommitPhase: boolean;
  inRevealPhase: boolean;
  canRequestAppeal: boolean;
  canResolveChallenge: boolean;
  isAwaitingAppealChallenge: boolean;
  canListingAppealBeResolved: boolean;
  isAppealChallengeInCommitStage: boolean;
  isAppealChallengeInRevealStage: boolean;
  canListingAppealChallengeBeResolved: boolean;
  didUserCommit?: boolean;
  didUserReveal?: boolean;
  canUserCollect?: boolean;
  canUserRescue?: boolean;
  onClick?(): void;
}

export interface DashboardActivityItemProps
  extends DashboardActivityItemLogo,
    DashboardActivityItemTitleProps,
    DashboardActivityItemCTAButtonProps {
  viewDetailURL?: string;
}
