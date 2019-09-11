import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../redux/reducers";
import {
  getFormattedTokenBalance,
  getFormattedEthAddress,
  urlConstants as links,
  clearApolloSession,
} from "@joincivil/utils";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../selectors";
import { CivilContext, ICivilContext, NavBar, NavProps } from "@joincivil/components";
import { showWeb3LoginModal, showWeb3SignupModal, hideWeb3AuthModal } from "../redux/actionCreators/ui";

export interface NavBarProps {
  balance: string;
  votingBalance: string;
  network: string;
  userAccount: EthAddress;
  currentUserChallengesStarted: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  userChallengesWithUnrevealedVotes?: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
  useGraphQL: boolean;
}

export interface NavBarOwnProps {
  civilUser: any;
}

class GlobalNavComponent extends React.Component<NavBarProps & NavBarOwnProps & DispatchProp<any>> {
  public static contextType: React.Context<ICivilContext> = CivilContext;

  public render(): JSX.Element {
    const civil = this.context.civil;

    const {
      balance,
      votingBalance,
      userAccount,
      userChallengesWithUnrevealedVotes,
      userChallengesWithUnclaimedRewards,
      currentUserChallengesStarted,
      currentUserChallengesVotedOn,
      useGraphQL,
      civilUser,
    } = this.props;

    const navBarViewProps: NavProps = {
      balance,
      votingBalance,
      userEthAddress: userAccount && getFormattedEthAddress(userAccount),
      userRevealVotesCount: userChallengesWithUnrevealedVotes!.count(),
      userClaimRewardsCount: userChallengesWithUnclaimedRewards!.count(),
      userChallengesStartedCount: currentUserChallengesStarted.count(),
      userChallengesVotedOnCount: currentUserChallengesVotedOn.count(),
      useGraphQL,
      authenticationURL: "/auth/login",
      buyCvlUrl: "/tokens",
      joinAsMemberUrl: "https://civil.co/become-a-member",
      applyURL: links.APPLY,
      onLogoutPressed: async (): Promise<any> => {
        this.handleLogoutPressed();
      },
      onLoginPressed: async (): Promise<any> => {
        this.props.dispatch!(await showWeb3LoginModal());
      },
      onSignupPressed: async (): Promise<any> => {
        this.props.dispatch!(await showWeb3SignupModal());
      },
      onModalDefocussed: async (): Promise<any> => {
        this.props.dispatch!(await hideWeb3AuthModal());
      },
    };

    if (civil && civil.currentProvider) {
      navBarViewProps.enableEthereum = async () => {
        await civil.currentProviderEnable();
      };
    }

    return (
      <>
        <NavBar {...navBarViewProps} civilUser={civilUser} />
      </>
    );
  }

  public handleLogoutPressed(): any {
    clearApolloSession();
  }
}

const mapStateToProps = (state: State, ownProps: NavBarOwnProps): NavBarProps & NavBarOwnProps => {
  const { network, useGraphQL } = state;
  const { user } = state.networkDependent;
  const currentUserChallengesStarted = getChallengesStartedByUser(state);
  const currentUserChallengesVotedOn = getChallengesVotedOnByUser(state);
  const userChallengesWithUnrevealedVotes = getUserChallengesWithUnrevealedVotes(state);
  const userChallengesWithUnclaimedRewards = getUserChallengesWithUnclaimedRewards(state);
  let balance = "loading...";
  let votingBalance = "";
  let userAccount;

  if (user.account && user.account.account && user.account.account !== "") {
    if (user.account.balance) {
      balance = getFormattedTokenBalance(user.account.balance, true);
    }

    if (user.account.votingBalance) {
      votingBalance = getFormattedTokenBalance(user.account.votingBalance, true);
    }

    userAccount = user.account.account;
  }

  return {
    network,
    balance,
    votingBalance,
    userAccount,
    currentUserChallengesStarted,
    currentUserChallengesVotedOn,
    userChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
    useGraphQL,
    ...ownProps,
  };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
