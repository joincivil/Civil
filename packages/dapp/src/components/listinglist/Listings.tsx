import * as React from "react";
import { Set } from "immutable";
import { Link } from "react-router-dom";
import { Tabs, Tab, StyledTabNav, StyledTabLarge } from "@joincivil/components";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";
import ListingsInProgress from "./ListingsInProgress";

export interface ListingProps {
  whitelistedListings: Set<string>;
  rejectedListings: Set<string>;
  error: undefined | string;
}

class Listings extends React.Component<ListingProps> {
  public render(): JSX.Element {
    const myActivity = <Link to="/dashboard">My Activity</Link>;
    return (
      <Tabs TabsNavComponent={StyledTabNav} TabComponent={StyledTabLarge}>
        <Tab title={"Whitelisted Newsrooms"}>
          <ListingList listings={this.props.whitelistedListings} />
        </Tab>
        <Tab title={"Newsrooms Under Consideration"}>
          <ListingsInProgress />
        </Tab>
        <Tab title={"Rejected Newsrooms"}>
          <ListingList listings={this.props.rejectedListings} />
        </Tab>
        <Tab title={myActivity}>
          <></>
        </Tab>
      </Tabs>
    );
  }
}

const mapStateToProps = (state: State): ListingProps => {
  const { whitelistedListings, rejectedListings } = state.networkDependent;

  return {
    whitelistedListings,
    rejectedListings,
    error: undefined,
  };
};

export default connect(mapStateToProps)(Listings);
