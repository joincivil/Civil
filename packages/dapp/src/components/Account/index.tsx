import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import { AccountEmailAuth } from "./Auth/EmailAuth";
import { AccountHome } from "./Home";
import { AccountEmailSent } from "./Auth/EmailSent";
import { AccountVerifyToken, AccountVerifyTokenProps } from "./VerifyToken";

export enum AuthApplicationEnum {
  DEFAULT = "DEFAULT",
  NEWSROOM = "NEWSROOM",
  STOREFRONT = "STOREFRONT",
}

export interface AuthLoginResponse {
  token: string;
  refreshToken: string;
  uid: string;
}

// export const authRes = {
//   token:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDcyMzkyOTAsImlzcyI6IkNpdmlsIiwic3ViIjoiMTU0NDhlNzAtY2I2OS00OWJlLTg5MTMtNTBjMGQxNzZjYWJmIn0.Oc4gVOhGtGblcjxMfZYYjcvC6gOB-QS4r0y5g6WPX0w",
//   refreshToken:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJyZWZyZXNoIiwiaWF0IjoxNTQ3MTUyODkwLCJpc3MiOiJDaXZpbCIsInN1YiI6IjE1NDQ4ZTcwLWNiNjktNDliZS04OTEzLTUwYzBkMTc2Y2FiZiJ9.Ot1xDIemV1d-m7mnxWRmx_jIwDeG7HxuhKo7YbxCWTw",
//   uid: "15448e70-cb69-49be-8913-50c0d176cabf",
//   __typename: "AuthLoginResponse",
// };

export default class AccountRouter extends React.Component<RouteComponentProps> {
  public render(): JSX.Element {
    const { match } = this.props;
    return (
      <>
        <Switch>
          {/* Login Routes */}
          <Route
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
          <Route path={`${match.path}`} exact={true} component={AccountHome} />
        </Switch>
      </>
    );
  }
  public handleOnAuthentication(authResult: any, isNewUser: boolean): void {
    console.log("handleOnAuthentication", { authResult });
  }

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
