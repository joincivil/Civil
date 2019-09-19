import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../redux/reducers";
import { routes } from "../constants";
import { getFormattedTokenBalance, getFormattedEthAddress, urlConstants as links } from "@joincivil/utils";
import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../selectors";
import { NavBar, NavProps, CivilContext, ICivilContext } from "@joincivil/components";
import { showWeb3LoginModal, showWeb3SignupModal, hideWeb3AuthModal } from "../redux/actionCreators/ui";
import { withRouter } from "react-router";

function maybeAccount(state: State): any {
  const { user } = state.networkDependent;
  if (user.account && user.account.account && user.account.account !== "") {
    return user.account;
  }
}

const GlobalNavComponent: React.FunctionComponent = props => {
  // context
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const civil = civilCtx.civil;

  // redux
  const dispatch = useDispatch();
  const useGraphQL = useSelector((state: State) => state.useGraphQL);
  const currentUserChallengesStarted = useSelector(getChallengesStartedByUser);
  const currentUserChallengesVotedOn = useSelector(getChallengesVotedOnByUser);
  const userChallengesWithUnrevealedVotes = useSelector(getUserChallengesWithUnrevealedVotes);
  const userChallengesWithUnclaimedRewards = useSelector(getUserChallengesWithUnclaimedRewards);
  const account: any | undefined = useSelector(maybeAccount);
  const balance = account ? getFormattedTokenBalance(account.balance) : "loading...";
  const votingBalance = account ? getFormattedTokenBalance(account.votingBalance) : "loading...";
  const userAccount = account ? account.account : undefined;

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
      civilCtx.auth.logout();
    },
    onLoginPressed: async (): Promise<any> => {
      dispatch!(await showWeb3LoginModal());
    },
    onSignupPressed: async (): Promise<any> => {
      dispatch!(await showWeb3SignupModal());
    },
    onModalDefocussed: async (): Promise<any> => {
      dispatch!(await hideWeb3AuthModal());
    },
    onViewDashboardPressed: (): any => {
      props.history.push({
        pathname: routes.DASHBOARD_ROOT,
        state: {},
      });
    },
  };

  if (civil && civil.currentProvider) {
    navBarViewProps.enableEthereum = async () => {
      await civil.currentProviderEnable();
    };

    if (civil && civil.currentProvider) {
      navBarViewProps.enableEthereum = async () => {
        await civil.currentProviderEnable();
      };
    }

    return (
      <>
        <NavBar {...navBarViewProps} />
      </>
    );
  }

  return null;
};

export const GlobalNav = withRouter(GlobalNavComponent);
