import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../redux/reducers";
import { getFormattedTokenBalance, getFormattedEthAddress, urlConstants as links, CivilErrors } from "@joincivil/utils";
import { Set } from "immutable";
import { EthAddress, Civil } from "@joincivil/core";
import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../selectors";
import { NavBar, NavProps } from "@joincivil/components";
import { toggleUseGraphQL } from "../redux/actionCreators/ui";
import { setReadWriteProvider, getCivil } from "../helpers/civilInstance";
import { addUser } from "../redux/actionCreators/userAccount";
import { initializeTokenSubscriptions } from "../helpers/tokenEvents";
import BigNumber from "bignumber.js";

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

class GlobalNavComponent extends React.Component<NavBarProps & DispatchProp<any>, {}> {
  public render(): JSX.Element {
    const {
      balance,
      votingBalance,
      userAccount,
      userChallengesWithUnrevealedVotes,
      userChallengesWithUnclaimedRewards,
      currentUserChallengesStarted,
      currentUserChallengesVotedOn,
      useGraphQL,
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
    };

    // if ((window as any).ethereum) {
    //   navBarViewProps.enableEthereum = () => {
    //     (window as any).ethereum.enable();
    //   };
    // } else {
    //   navBarViewProps.createEthereum = () => {

    //   }
    // }
    navBarViewProps.enableEthereum = () => {
      setReadWriteProvider();
      console.log("ethereum?: ", (window as any).ethereum);
      const civil = getCivil();
      civil.accountStream.first().forEach(this.onAccountUpdated.bind(this, civil));
    };

    return (
      <>
        <NavBar {...navBarViewProps} />
      </>
    );
  }

  public onAccountUpdated = async (civil: Civil, account?: EthAddress): Promise<void> => {
    console.log("on account updated.");
    if (account /* && account !== this.state.prevAccount*/) {
      try {
        this.setState({ prevAccount: account });
        const tcr = await civil.tcrSingletonTrusted();
        const token = await tcr.getToken();
        const voting = await tcr.getVoting();
        const balance = await token.getBalance(account);
        const votingBalance = await voting.getNumVotingRights(account);
        this.props.dispatch!(addUser(account, balance, votingBalance));
        await initializeTokenSubscriptions(this.props.dispatch!, account);
      } catch (err) {
        if (err.message === CivilErrors.UnsupportedNetwork) {
          this.props.dispatch!(addUser(account, new BigNumber(0), new BigNumber(0)));
          console.error("Unsupported network when trying to set-up user");
        } else {
          throw err;
        }
      }
    } else {
      this.props.dispatch!(addUser("", new BigNumber(0), new BigNumber(0)));
    }
  };
}

const mapStateToProps = (state: State): NavBarProps => {
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
  };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
