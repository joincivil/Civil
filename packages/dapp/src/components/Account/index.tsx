import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import {
  AccountEmailAuth,
  AccountEmailSent,
  AccountVerifyToken,
  AccountVerifyTokenProps,
  AuthenticatedRoute,
} from "@joincivil/components";
import { setApolloSession } from "@joincivil/utils";
import { AccountHome } from "./Home";

export default class AccountRouter extends React.Component<RouteComponentProps> {
  public render(): JSX.Element {
    const { match } = this.props;
    return (
      <>
        <Switch>
          {/* Login Routes */}
          <AuthenticatedRoute onlyAllowUnauthenticated redirectTo="/account" path={`${match.path}/auth`}>
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
                <AccountVerifyToken isNewUser={false} {...props} onAuthentication={this.handleOnAuthentication} />
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
                <AccountVerifyToken isNewUser={true} {...props} onAuthentication={this.handleOnAuthentication} />
              )}
            />
          </AuthenticatedRoute>
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
  public handleOnAuthentication = (authResult: any, isNewUser: boolean): void => {
    // Set the session.
    setApolloSession(authResult);
    // TODO(jorgelo): Flush the local apollo cache here.
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
