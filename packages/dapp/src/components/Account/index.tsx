import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import SignIn from "./SignIn";
import Register from "./Register";
import Home from "./Home";
import { AccountVerifyToken, AccountVerifyTokenProps, AuthLoginResponse } from "./VerifyToken";

export default class AccountRouter extends React.Component<RouteComponentProps> {
  // constructor(props: any) {
  //   super(props);
  //   // this.state = {};
  // }

  public render(): JSX.Element {
    const { match } = this.props;
    return (
      <>
        <Switch>
          <Route path={`${match.path}/signin`} component={SignIn} />
          <Route path={`${match.path}/register`} component={Register} />
          <Route
            path={`${match.path}/verify-token/:token`}
            component={(props: AccountVerifyTokenProps) => (
              <AccountVerifyToken {...props} onAuthentication={this.handleOnAuthentication} />
            )}
          />
          <Route path={`${match.path}`} exact={true} component={Home} />
        </Switch>
      </>
    );
  }
  public handleOnAuthentication(res: AuthLoginResponse): void {
    console.log("Got me:", { res });
  }
}
