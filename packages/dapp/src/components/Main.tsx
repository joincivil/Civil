import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Listings from "./Listings";
import Newsroom from "./Newsroom";
import Contracts from "./Contracts";
import ContractPage from "./ContractPage";
import Listing from "./Listing";

class Main extends React.Component {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route exact={true} path="/" component={Listings} />
        <Route path="/newsroom/:newsroomAddress" component={Newsroom} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/contract/:contract" component={ContractPage} />
        <Route path="/listing/:listing" component={Listing} />
      </Switch>
    );
  }
}

export default Main;
