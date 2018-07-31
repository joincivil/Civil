import * as React from "react";
import { Set } from "immutable";
import { Tabs, Tab, ListingsTabNav, ListingsTab } from "@joincivil/components";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";
import ListingsInProgress from "./ListingsInProgress";
import MyActivity from "./MyActivity";

export interface ListingProps {
  whitelistedListings: Set<string>;
  rejectedListings: Set<string>;
  currentUserNewsrooms: Set<string>;
  error: undefined | string;
}

class Listings extends React.Component<ListingProps> {
  public render(): JSX.Element {
    return (
      <Tabs TabsNavComponent={ListingsTabNav} TabComponent={ListingsTab}>
        <Tab title={"Whitelisted Newsrooms"}>
          <ListingList listings={this.props.whitelistedListings} />
        </Tab>
        <Tab title={"Newsrooms Under Consideration"}>
          <ListingsInProgress />
        </Tab>
        <Tab title={"Rejected Newsrooms"}>
          <ListingList rejectedListings={this.props.rejectedListings} />
        </Tab>
        <Tab title={"My Activity"}>
          <MyActivity />
        </Tab>
      </Tabs>
    );
  }
}

const mapStateToProps = (state: State): ListingProps => {
  const { whitelistedListings, rejectedListings, currentUserNewsrooms } = state.networkDependent;

  return {
    whitelistedListings,
    rejectedListings,
    currentUserNewsrooms,
    error: undefined,
  };
};

export default connect(mapStateToProps)(Listings);
