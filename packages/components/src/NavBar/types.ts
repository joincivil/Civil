export interface NavProps {
  balance: string;
  votingBalance: string;
  userAccount: string;
  userRevealVotesCount?: number;
  userClaimRewardsCount?: number;
  userChallengesStartedCount?: number;
  userChallengesVotedOnCount?: number;
  buyCvlUrl?: string;
  useGraphQL: boolean;
  onLogin?(): void;
  onLoadingPrefToggled(): void;
}

export interface NavState {
  isOpen: boolean;
}

export interface NavArrowProps {
  isOpen?: boolean;
}

export interface NavMenuState {
  isResponsiveDrawerOpen: boolean;
}
