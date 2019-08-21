export interface NavUserAccountProps {
  balance: string;
  userEthAddress?: string;
  votingBalance: string;
  civilUser: any;
}

export interface NavAuthenticationProps {
  authenticationURL: string;
  joinAsMemberUrl: string;
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
  onLoginPressed(): void;
  onSignupPressed(): void;
  onModalDefocussed(): void;
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
