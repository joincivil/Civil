import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../redux/reducers";
import {
  getFormattedTokenBalance,
  getFormattedEthAddress,
  urlConstants as links,
  getCurrentUserQuery,
} from "@joincivil/utils";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../selectors";
import { CivilContext, ICivilContext, NavBar, NavProps, LoadUser } from "@joincivil/components";
import {
  toggleUseGraphQL,
  showWeb3LoginModal,
  showWeb3SignupModal,
  hideWeb3AuthModal,
} from "../redux/actionCreators/ui";
// import AuthWeb3 from "./Auth/AuthWeb3";
import AuthWeb3Signup from "./Auth/AuthWeb3Signup";
import AuthWeb3Login from "./Auth/AuthWeb3Login";
import { Query } from "react-apollo";
import SetUsername from "./Auth/SetUsername";

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
  showWeb3AuthModal: boolean;
  web3AuthType: string;
}

class GlobalNavComponent extends React.Component<NavBarProps & DispatchProp<any>> {
  public static contextType: React.Context<ICivilContext> = CivilContext;

  public render(): JSX.Element {
    const civil = this.context.civil;
    return (
      <LoadUser>
        {({ user: civilUser }) => {
          console.log("load user 7");
          const {
            balance,
            votingBalance,
            userAccount,
            userChallengesWithUnrevealedVotes,
            userChallengesWithUnclaimedRewards,
            currentUserChallengesStarted,
            currentUserChallengesVotedOn,
            useGraphQL,
            showWeb3AuthModal,
            web3AuthType,
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
            onLoadingPrefToggled: async (): Promise<any> => {
              this.props.dispatch!(await toggleUseGraphQL());
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

          const showWeb3Signup = showWeb3AuthModal && web3AuthType === "signup";
          const showWeb3Login = showWeb3AuthModal && web3AuthType === "login";
          const showSetHandle = civilUser && civilUser.uid && civilUser.userChannel && !civilUser.userChannel.handle;
          return (
            <>
              <NavBar {...navBarViewProps} civilUser={civilUser} />
              {showWeb3Signup && <AuthWeb3Signup onSignupContinue={this.handleOnSignupContinue} />}
              {showWeb3Login && <AuthWeb3Login onSignupContinue={this.handleOnLoginContinue} />}
              {showSetHandle && <SetUsername channelID={civilUser.userChannel.id} />}
            </>
          );
        }}
      </LoadUser>
    );
  }

  public handleOnSignupContinue = async () => {
    this.props.dispatch!(await hideWeb3AuthModal());
  };

  public handleOnLoginContinue = async () => {
    this.props.dispatch!(await hideWeb3AuthModal());
  };
}

const mapStateToProps = (state: State): NavBarProps => {
  const { network, useGraphQL, showWeb3AuthModal, web3AuthType } = state;
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
    showWeb3AuthModal,
    web3AuthType,
  };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
