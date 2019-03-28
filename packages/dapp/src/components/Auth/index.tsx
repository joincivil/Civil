import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import { AuthenticatedRoute } from "@joincivil/components";
import { AuthEthConnected } from "./Eth";
import { AuthLogin } from "./Login";
import { AuthSignup } from "./Signup";
import { AuthCheckEmail } from "./CheckEmail";
import { AuthVerifyToken } from "./VerifyToken";
import { connect, DispatchProp } from "react-redux";
import * as qs from "querystring";
import { analyticsEvent } from "../../redux/actionCreators/analytics";

const TOKEN_HOME = "/tokens";
export const WALLET_HOME = "/auth/wallet";

export interface AuthVerifyTokenRouteParams {
  token: string;
}

const TOKEN_PARAM = "jwt";

function getTokenFromSearch(search: string): string | undefined {
  try {
    // Needs substr since search includes the ?
    const parsed = qs.parse(search.substr(1));

    return parsed[TOKEN_PARAM] as string;
  } catch (err) {
    console.error("Error parsing query:", err);
    return undefined;
  }
}

export class AuthRouter extends React.Component<RouteComponentProps & DispatchProp<any>> {
  public render(): JSX.Element {
    const { match } = this.props;

    const routeProps = {
      redirectTo: TOKEN_HOME,
      signupUrl: "/auth/signup",
    };

    return (
      <>
        <button onClick={() => this.handleOnTokenValidation(true)}>Click</button>
        <Switch>
          {/* TODO(jorgelo): Add a 404 */}
          {/* Login Routes */}

          {/* Add Wallet */}
          <AuthenticatedRoute
            path={WALLET_HOME}
            {...routeProps}
            render={() => <AuthEthConnected onAuthentication={this.handleOnAddWallet} />}
          />
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
                  path={`${match.path}/login/verify-token`}
                  exact
                  render={(props: RouteComponentProps<AuthVerifyTokenRouteParams>) => {
                    const token = getTokenFromSearch(props.location.search);

                    return (
                      <AuthVerifyToken
                        token={token}
                        isNewUser={false}
                        onAuthenticationContinue={this.handleOnAuthenticationContinue}
                        onTokenValidation={this.handleOnTokenValidation}
                      />
                    );
                  }}
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
                  render={(props: RouteComponentProps<AuthVerifyTokenRouteParams>) => (
                    <AuthCheckEmail
                      isNewUser={true}
                      emailAddress={props.location!.state.emailAddress}
                      onSendAgain={() => this.handleOnSendAgain(true)}
                    />
                  )}
                />
                <Route
                  path={`${match.path}/signup/verify-token`}
                  exact
                  render={(props: RouteComponentProps<AuthVerifyTokenRouteParams>) => {
                    const token = getTokenFromSearch(props.location.search);

                    return (
                      <AuthVerifyToken
                        token={token}
                        isNewUser={true}
                        onAuthenticationContinue={this.handleOnAuthenticationContinue}
                        onTokenValidation={this.handleOnTokenValidation}
                      />
                    );
                  }}
                />
              </>
            )}
          />
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

  public handleOnTokenValidation = (isNewUser: boolean): void => {
    const { dispatch } = this.props;

    console.log("DISPATCH?", { dispatch });
    dispatch!(
      analyticsEvent({
        category: "category",
        action: "action",
        label: "label",
        value: "value",
      }),
    );
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

export const AuthRouterConnected = connect()(AuthRouter);
