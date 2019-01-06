import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import * as SignIn from "./SignIn";

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
          <Route path={`${match.path}/register`} component={() => <>cool</>} />
        </Switch>
      </>
    );
  }
}
