export interface NavUserAccountProps {
  balance: string;
  userEthAddress?: string;
  votingBalance: string;
}

export interface NavAuthenticationProps {
  authenticationURL: string;
  buyCvlUrl: string;
  applyURL: string;
  enableEthereum?(): void;
}

export interface NavDrawerProps {
  userRevealVotesCount?: number;
  userClaimRewardsCount?: number;
  userChallengesStartedCount?: number;
  userChallengesVotedOnCount?: number;
  buyCvlUrl: string;
  useGraphQL: boolean;
  onLoadingPrefToggled(): void;
}

export type NavProps = NavUserAccountProps & NavAuthenticationProps & NavDrawerProps;

export interface NavState {
  isUserDrawerOpen: boolean;
}

export interface NavArrowProps {
  isOpen?: boolean;
}

export interface NavMenuState {
  isResponsiveDrawerOpen: boolean;
}
