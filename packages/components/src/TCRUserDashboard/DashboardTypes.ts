export interface DashboardActivityItemBaseProps {
  viewDetailURL?: string;
}

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

export interface DashboardActivityItemProposalCTAButtonProps {
  propDetailURL?: string;
  canUserReveal?: boolean;
  didUserCommit?: boolean;
  didUserReveal?: boolean;
  canUserCollect?: boolean;
  canUserRescue?: boolean;
  onClick?(): void;
}

export interface DashboardActivityItemProps
  extends DashboardActivityItemBaseProps,
    DashboardActivityItemLogo,
    DashboardActivityItemTitleProps {}

export interface DashboardActivityProposalItemProps
  extends DashboardActivityItemBaseProps,
    DashboardActivityItemLogo,
    DashboardActivityItemTitleProps {}

export interface DashboardActivitySelectableItemProps
  extends DashboardActivityItemBaseProps,
    DashboardActivityItemTitleProps {
  numTokens?: string;
  challengeID?: string;
  appealChallengeID?: string;
  salt?: any;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: any): void;
}
