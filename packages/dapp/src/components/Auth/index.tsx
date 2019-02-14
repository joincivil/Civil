import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import {
  // AccountEmailAuth,
  // AccountEmailSent,
  // AccountVerifyToken,
  // AccountVerifyTokenProps,
  AuthenticatedRoute,
} from "@joincivil/components";
import { AuthHome } from "./Home";
import { AuthEth } from "./Eth";
import { AuthLogin } from "./Login";
import { AuthSignup } from "./Signup";
import { AuthCheckEmail } from "./CheckEmail";

const TOKEN_HOME = "/tokens";

export class AuthRouter extends React.Component<RouteComponentProps> {
  public render(): JSX.Element {
    const { match } = this.props;
    return (
      <>
        <Switch>
          {/* Login Routes */}
          <AuthenticatedRoute
            onlyAllowUnauthenticated
            redirectTo={TOKEN_HOME}
            path={`${match.path}/auth`}
            component={() => (
              <>
                <Route
                  redirectTo={TOKEN_HOME}
                  path={`${match.path}/login`}
                  exact={true}
                  component={(props: any) => <AuthLogin onEmailSend={this.handleAuthEmail} />}
                />
                <Route
                  path={`${match.path}/login/check-email`}
                  component={(props: any) => <AccountEmailSent {...props} isNewUser={false} />}
                />
                <Route
                  path={`${match.path}/login/verify-token/:token`}
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
                  path={`${match.path}/signup`}
                  exact={true}
                  component={(props: any) => (
                    <AccountEmailAuth isNewUser={true} {...props} onEmailSend={this.handleAuthEmail} />
                  )}
                />
                <Route
                  path={`${match.path}/signup/check-email`}
                  exact
                  component={(props: any) => <AccountEmailSent {...props} isNewUser={true} />}
                />
                <Route
                  path={`${match.path}/signup/verify-token/:token`}
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
            redirectTo={TOKEN_HOME}
            path={`${match.path}/eth`}
            exact={true}
            component={() => <AuthEth onAuthentication={this.handleOnAddWallet} />}
          />

          {/* Account Home */}
          {/* TODO(jorgelo): This is just as a helper, not needed in production. */}
          <AuthenticatedRoute
            redirectTo={`${match.path}/login`}
            path={`${match.path}`}
            exact={true}
            component={AuthHome}
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
      pathname: TOKEN_HOME,
      state: {},
    });
  };

  public handleOnAddWallet = (): void => {
    const { history } = this.props;

    history.push({
      pathname: TOKEN_HOME,
      state: {},
    });
  };

  public handleAuthEmail = (isNewUser: boolean, emailAddress: string): void => {
    const {
      match: { path: basePath },
      history,
    } = this.props;

    const newPath = basePath + `/${isNewUser ? "signup" : "login"}/check-email`;

    history.push({
      pathname: newPath,
      state: { emailAddress },
    });
  };
}
