import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import { AuthenticatedRoute } from "@joincivil/civil-session";
import AsyncComponent from "../utility/AsyncComponent";
import * as qs from "querystring";
import { routes } from "../../constants";

const AuthLogin = React.lazy(async () => import("./Login"));
const AuthWeb3Login = React.lazy(async () => import("./AuthWeb3Login"));
const AuthWeb3Signup = React.lazy(async () => import("./AuthWeb3Signup"));
const AuthEthConnected = React.lazy(async () => import("./Eth"));
const AuthSignup = React.lazy(async () => import("./Signup"));
const AuthCheckEmail = React.lazy(async () => import("./CheckEmail"));
const AuthVerifyToken = React.lazy(async () => import("./VerifyToken"));
const AuthLogout = React.lazy(async () => import("./AuthLogout"));

interface AuthVerifyTokenRouteParams {
  token: string;
}

interface AuthenticatedRedirectRouteParams {
  next?: string;
}

const TOKEN_PARAM = "jwt";
const REDIRECT_PARAM = "next";

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

function getRedirectFromString(search: string): string | undefined {
  try {
    // Needs substr since search includes the ?
    const parsed = qs.parse(search.substr(1));

    return parsed[REDIRECT_PARAM] as string;
  } catch (err) {
    console.error("Error parsing query:", err);
    return undefined;
  }
}

export class AuthRouter extends React.Component<RouteComponentProps> {
  public render(): JSX.Element {
    const { match } = this.props;

    const routeProps = {
      redirectTo: routes.TOKEN_STOREFRONT,
      authUrl: routes.AUTH_SIGNUP,
    };

    return (
      <>
        <Switch>
          {/* TODO(jorgelo): Add a 404 */}
          {/* Login Routes */}
          <Route path={routes.AUTH_LOGOUT} exact component={AsyncComponent(AuthLogout)} />

          {/* Add Wallet */}
          <AuthenticatedRoute
            path={routes.WALLET_HOME}
            {...routeProps}
            render={AsyncComponent(AuthEthConnected, { onAuthentication: this.handleOnAddWallet })}
          />
          <AuthenticatedRoute
            {...routeProps}
            onlyAllowUnauthenticated
            path={`${match.path}/`}
            render={() => (
              <>
                <Route
                  path={`${match.path}/login/web3`}
                  exact
                  render={(props: RouteComponentProps<AuthenticatedRedirectRouteParams>) => {
                    let onAuthenticationContinue = this.handleOnAuthenticationContinue;
                    const redirect = getRedirectFromString(props.location.search);
                    if (redirect) {
                      onAuthenticationContinue = () => this.handleOnAuthenticationContinue(false, redirect);
                    }
                    return AsyncComponent(AuthWeb3Login)({ onAuthenticationContinue });
                  }}
                />
                <Route
                  path={`${match.path}/login`}
                  exact
                  render={AsyncComponent(AuthLogin, { onEmailSend: this.handleAuthEmail })}
                />
                <Route
                  path={`${match.path}/login/check-email`}
                  render={(props: RouteComponentProps) => {
                    return AsyncComponent(AuthCheckEmail)({
                      isNewUser: false,
                      emailAddress: props.location!.state.emailAddress,
                      onSendAgain: () => this.handleOnSendAgain(false),
                    });
                  }}
                />
                <Route
                  path={`${match.path}/login/verify-token`}
                  exact
                  render={(props: RouteComponentProps<AuthVerifyTokenRouteParams>) => {
                    const token = getTokenFromSearch(props.location.search);
                    return AsyncComponent(AuthVerifyToken)({
                      token,
                      isNewUser: false,
                      onAuthenticationContinue: this.handleOnAuthenticationContinue,
                    });
                  }}
                />
                {/* SignUp Routes */}
                <Route
                  path={`${match.path}/signup/web3`}
                  exact
                  render={(props: RouteComponentProps<AuthenticatedRedirectRouteParams>) => {
                    let onAuthenticationContinue = this.handleOnAuthenticationContinue;
                    const redirect = getRedirectFromString(props.location.search);
                    if (redirect) {
                      onAuthenticationContinue = () => this.handleOnAuthenticationContinue(false, redirect);
                    }
                    return AsyncComponent(AuthWeb3Signup)({ onAuthenticationContinue });
                  }}
                />
                <Route
                  path={`${match.path}/signup`}
                  exact
                  render={AsyncComponent(AuthSignup, { onEmailSend: this.handleAuthEmail })}
                />
                <Route
                  path={`${match.path}/signup/check-email`}
                  exact
                  render={(props: RouteComponentProps<AuthVerifyTokenRouteParams>) => {
                    return AsyncComponent(AuthCheckEmail)({
                      isNewUser: true,
                      emailAddress: props.location!.state.emailAddress,
                      onSendAgain: () => this.handleOnSendAgain(true),
                    });
                  }}
                />
                <Route
                  path={`${match.path}/signup/verify-token`}
                  exact
                  render={(props: RouteComponentProps<AuthVerifyTokenRouteParams>) => {
                    const token = getTokenFromSearch(props.location.search);
                    return AsyncComponent(AuthVerifyToken)({
                      token,
                      isNewUser: true,
                      onAuthenticationContinue: this.handleOnAuthenticationContinue,
                    });
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

  public handleOnAuthenticationContinue = (isNewUser: boolean, redirectUrl?: string): void => {
    const { history } = this.props;

    history.push({
      pathname: redirectUrl || routes.TOKEN_STOREFRONT,
      state: {},
    });
  };

  public handleOnAddWallet = (): void => {
    const { history } = this.props;

    history.push({
      pathname: routes.TOKEN_STOREFRONT,
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
