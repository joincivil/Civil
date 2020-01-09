import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../redux/reducers";
import { routes } from "../constants";
import { getFormattedEthAddress } from "@joincivil/utils";

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

  // redux
  const dispatch = useDispatch();
  const account: any | undefined = useSelector(maybeAccount);
  const userAccount = account ? account.account : undefined;

  const navBarViewProps: NavProps = {
    userEthAddress: userAccount && getFormattedEthAddress(userAccount),
    buyCvlUrl: "/tokens",
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

  return (
    <>
      <NavBar {...navBarViewProps} />
    </>
  );
};

export const GlobalNav = withRouter(GlobalNavComponent);
