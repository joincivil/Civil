import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import {
  AccountEmailAuth,
  AccountEmailSent,
  AccountVerifyToken,
  AccountVerifyTokenProps,
  AuthenticatedRoute,
} from "@joincivil/components";
import { AccountHome } from "./Home";
import { AccountEth } from "./Eth";

export default class AccountRouter extends React.Component<RouteComponentProps> {
  public render(): JSX.Element {
    const { match } = this.props;
    return (
      <>
        <Switch>
          {/* Login Routes */}
          <AuthenticatedRoute
            onlyAllowUnauthenticated
            redirectTo="/tokens"
            path={`${match.path}/auth`}
            component={() => (
              <>
                <Route
                  redirectTo="/account"
                  path={`${match.path}/auth/login`}
                  exact={true}
                  component={(props: any) => (
                    <AccountEmailAuth isNewUser={false} {...props} onEmailSend={this.handleAuthEmail} />
                  )}
                />
                <Route
                  path={`${match.path}/auth/login/check-email`}
                  component={(props: any) => <AccountEmailSent {...props} isNewUser={false} />}
                />
                <Route
                  path={`${match.path}/auth/login/verify-token/:token`}
                  exact
                  component={(props: AccountVerifyTokenProps) => (
                    <AccountVerifyToken
                      isNewUser={false}
                      onAuthenticationContinue={this.handleOnAuthenticationContinue}
                      {...props}
                    />
                  )}
                />

                {/* SignUp Routes */}
                <Route
                  path={`${match.path}/auth/signup`}
                  exact={true}
                  component={(props: any) => (
                    <AccountEmailAuth isNewUser={true} {...props} onEmailSend={this.handleAuthEmail} />
                  )}
                />
                <Route
                  path={`${match.path}/auth/signup/check-email`}
                  exact
                  component={(props: any) => <AccountEmailSent {...props} isNewUser={true} />}
                />
                <Route
                  path={`${match.path}/auth/signup/verify-token/:token`}
                  exact
                  component={(props: AccountVerifyTokenProps) => (
                    <AccountVerifyToken
                      isNewUser={true}
                      onAuthenticationContinue={this.handleOnAuthenticationContinue}
                      {...props}
                    />
                  )}
                />
              </>
            )}
          />

          {/* Add Wallet */}
          <AuthenticatedRoute
            onlyAllowWithoutEth
            redirectTo={`/tokens`}
            path={`${match.path}/eth`}
            exact={true}
            component={() => <AccountEth onAuthentication={this.handleOnAddWallet} />}
          />

          {/* Account Home */}
          <AuthenticatedRoute
            redirectTo={`${match.path}/auth/login`}
            path={`${match.path}`}
            exact={true}
            component={AccountHome}
          />
        </Switch>
      </>
    );
  }

  public handleOnAuthenticationContinue = (isNewUser: boolean): void => {
    const {
      match: { path: basePath },
      history,
    } = this.props;

    history.push({
      pathname: `${basePath}/account`,
      state: {},
    });

    // TODO(tobek) or TODO(jorgelo) Do we need to flush cache to handle updated login state? Confirm. For now, refreshing will ensure we end up in the right place:
    window.location.reload();
  };

  public handleOnAddWallet = (): void => {
    const { history } = this.props;

    history.push({
      pathname: `/tokens`,
      state: {},
    });
    // TODO(jorgelo): Same as above, there should be a better way to force a refetch.
    window.location.reload();
  };

  public handleAuthEmail = (isNewUser: boolean, emailAddress: string): void => {
    const {
      match: { path: basePath },
      history,
    } = this.props;

    const newPath = basePath + `/auth/${isNewUser ? "signup" : "login"}/check-email`;

    history.push({
      pathname: newPath,
      state: { emailAddress },
    });
  };
}
