import * as React from "react";
import { Set } from "immutable";
import { Tabs } from "../tabs/Tabs";
import { BorderBottomTab } from "../tabs/Tab";
// import { BorderBottomTab } from "@joincivil/components";

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
      <Tabs className={"listings-nav"}>
        <BorderBottomTab tabText={"Whitelisted Newsrooms"}>
          <ListingList listings={this.props.whitelistedListings} />
        </BorderBottomTab>
        <BorderBottomTab tabText={"Newsrooms Under Consideration"}>
          <ListingsInProgress />
        </BorderBottomTab>
        <BorderBottomTab tabText={"Rejected Newsrooms"}>
          <ListingList listings={this.props.rejectedListings} />
        </BorderBottomTab>
        <BorderBottomTab tabText={"My Activity"}>
          <MyActivity />
        </BorderBottomTab>
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
