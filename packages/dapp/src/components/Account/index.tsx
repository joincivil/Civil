import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";

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
          <Route path={`${match.path}/signin`} component={() => <>cool</>} />
        </Switch>
      </>
    );
  }
}
