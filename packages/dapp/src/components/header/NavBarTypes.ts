export interface NavUserAccountProps {
  balance: string;
  userEthAddress?: string;
  votingBalance: string;
  civilUser?: any;
}

export interface NavAuthenticationProps {
  authenticationURL: string;
  joinAsMemberUrl: string;
  applyURL: string;
  enableEthereum?(): void;
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
