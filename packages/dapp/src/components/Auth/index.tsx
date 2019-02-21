import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import { AuthenticatedRoute } from "@joincivil/components";
import { AuthHome } from "./Home";
import { AuthEth } from "./Eth";
import { AuthLogin } from "./Login";
import { AuthSignup } from "./Signup";
import { AuthCheckEmail } from "./CheckEmail";
import { AuthVerifyToken } from "./VerifyToken";

const TOKEN_HOME = "/tokens";
export const WALLET_HOME = "/auth/wallet";

interface AuthVerifyTokenRouteParams {
  token: string;
}

export class AuthRouter extends React.Component<RouteComponentProps> {
  public render(): JSX.Element {
    const { match } = this.props;

    const routeProps = {
      redirectTo: TOKEN_HOME,
      ethSignupPath: WALLET_HOME,
    };

    return (
      <>
        <Switch>
          {/* TODO(jorgelo): Add a 404 */}
          {/* Login Routes */}
          <AuthenticatedRoute
            {...routeProps}
            onlyAllowUnauthenticated
            redirectTo={TOKEN_HOME}
            path={`${match.path}/`}
            render={() => (
              <>
                <Route
                  path={`${match.path}/login`}
                  exact
                  render={() => <AuthLogin onEmailSend={this.handleAuthEmail} />}
                />
                <Route
                  path={`${match.path}/login/check-email`}
                  render={(props: RouteComponentProps) => (
                    <AuthCheckEmail
                      isNewUser={false}
                      emailAddress={props.location!.state.emailAddress}
                      onSendAgain={() => this.handleOnSendAgain(false)}
                    />
                  )}
                />
                <Route
                  path={`${match.path}/login/verify-token/:token`}
                  exact
                  render={(props: RouteComponentProps) => (
                    <AuthVerifyToken
                      token={(props.match!.params as AuthVerifyTokenRouteParams).token}
                      isNewUser={false}
                      onAuthenticationContinue={this.handleOnAuthenticationContinue}
                    />
                  )}
                />
                {/* SignUp Routes */}
                <Route
                  path={`${match.path}/signup`}
                  exact
                  render={() => <AuthSignup onEmailSend={this.handleAuthEmail} />}
                />
                <Route
                  path={`${match.path}/signup/check-email`}
                  exact
                  render={(props: RouteComponentProps) => (
                    <AuthCheckEmail
                      isNewUser={true}
                      emailAddress={props.location!.state.emailAddress}
                      onSendAgain={() => this.handleOnSendAgain(true)}
                    />
                  )}
                />
                <Route
                  path={`${match.path}/signup/verify-token/:token`}
                  exact
                  render={(props: RouteComponentProps) => {
                    const token = (props.match!.params as AuthVerifyTokenRouteParams).token;

                    return (
                      <AuthVerifyToken
                        token={token}
                        isNewUser={true}
                        onAuthenticationContinue={this.handleOnAuthenticationContinue}
                      />
                    );
                  }}
                />
                {/* Add Wallet */}
                <Route path={WALLET_HOME} render={() => <AuthEth onAuthentication={this.handleOnAddWallet} />} />
              </>
            )}
          />

          {/* Account Home */}
          {/* TODO(jorgelo): This is just as a helper, not needed in production. */}
          {/* <AuthenticatedRoute {...routeProps} path={`${match.path}`} exact={true} component={AuthHome} /> */}
        </Switch>
      </>
    );
  }

  public handleOnSendAgain = (isNewUser: boolean): void => {
    const {
      match: { path: basePath },
      history,
    } = this.props;

    const newPath = basePath + `/${isNewUser ? "signup" : "login"}`;

    history.push({
      pathname: newPath,
      state: {},
    });
  };

  public handleOnAuthenticationContinue = (isNewUser: boolean): void => {
    const { history } = this.props;

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
