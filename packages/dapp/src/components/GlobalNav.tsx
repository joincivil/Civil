import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../redux/reducers";
import { getFormattedTokenBalance, getFormattedEthAddress, urlConstants as links } from "@joincivil/utils";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../selectors";
import { CivilContext, NavBar, NavUserDrawer, NavProps } from "@joincivil/components";
import { toggleUseGraphQL } from "../redux/actionCreators/ui";
import UserAccount from "./navbar/UserAccount";

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

const GlobalNavComponent: React.FunctionComponent<NavBarProps & DispatchProp<any>> = props => {
  const { civil } = React.useContext(CivilContext);

  const [isUserDrawerOpen, setIsUserDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setIsUserDrawerOpen(!isUserDrawerOpen);
  };

  const hideDrawer = () => {
    setIsUserDrawerOpen(false);
  };

  const {
    balance,
    votingBalance,
    userAccount,
    userChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
    currentUserChallengesStarted,
    currentUserChallengesVotedOn,
    useGraphQL,
  } = props;

  const userEthAddress = userAccount && getFormattedEthAddress(userAccount);
  const onLoadingPrefToggled = async (): Promise<any> => {
    props.dispatch!(await toggleUseGraphQL());
  };
  let enableEthereum;
  if (civil && civil.currentProvider) {
    enableEthereum = async () => {
      await civil.currentProviderEnable();
    };
  }

  const userAccountEl = (
    <UserAccount
      balance={balance}
      votingBalance={votingBalance}
      userEthAddress={userEthAddress}
      authenticationURL={"/auth/login"}
      joinAsMemberUrl={"https://civil.co/become-a-member"}
      applyURL={links.APPLY}
      enableEthereum={enableEthereum}
      isUserDrawerOpen={isUserDrawerOpen}
      toggleDrawer={toggleDrawer}
    >
      <NavUserDrawer
        balance={balance}
        votingBalance={votingBalance}
        userEthAddress={userEthAddress}
        userRevealVotesCount={userChallengesWithUnrevealedVotes!.count()}
        userClaimRewardsCount={userChallengesWithUnclaimedRewards!.count()}
        userChallengesStartedCount={currentUserChallengesStarted.count()}
        userChallengesVotedOnCount={currentUserChallengesVotedOn.count()}
        useGraphQL={useGraphQL}
        buyCvlUrl={"/tokens"}
        onLoadingPrefToggled={onLoadingPrefToggled}
        handleOutsideClick={hideDrawer}
      />
    </UserAccount>
  );

  return (
    <>
      <NavBar userAccountEl={userAccountEl} />
    </>
  );
};

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
