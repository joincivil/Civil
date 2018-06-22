import * as React from "react";
import { Set } from "immutable";
import { Tabs } from "../tabs/Tabs";
import { Tab } from "../tabs/Tab";

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
      <Tabs>
        <Tab tabText={"WHITELISTED NEWSROOMS"}>
          <ListingList listings={this.props.whitelistedListings} />
        </Tab>
        <Tab tabText={"NEWSROOMS UNDER CONSIDERATION"}>
          <ListingsInProgress />
        </Tab>
        <Tab tabText={"REJECTED NEWSROOMS"}>
          <ListingList listings={this.props.rejectedListings} />
        </Tab>
        <Tab tabText={"MY ACTIVITY"}>
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
