import * as React from "react";
import { Set } from "immutable";
import {
  Hero,
  HeroLabel,
  HeroHeading,
  HeroBlockTextLink,
  HeroSmallText,
  Button,
  buttonSizes,
  Tabs,
  Tab,
  ListingsTabNav,
  ListingsTab,
} from "@joincivil/components";

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
      <div>
        <Hero>
          <HeroLabel>Civil Registry</HeroLabel>
          <HeroHeading>
            The Civil Registry is a whitelist of community-approved newsrooms that have publishing rights on Civil.
          </HeroHeading>
          <HeroBlockTextLink href="/">Learn how to participate in our governance</HeroBlockTextLink>
          <Button size={buttonSizes.MEDIUM} to="/">
            APPLY TO JOIN REGISTRY
          </Button>
          <HeroSmallText>1,000 CVL required to apply</HeroSmallText>
        </Hero>

        <Tabs TabsNavComponent={ListingsTabNav} TabComponent={ListingsTab}>
          <Tab title={"Whitelisted Newsrooms"}>
            <ListingList listings={this.props.whitelistedListings} />
          </Tab>
          <Tab title={"Newsrooms Under Consideration"}>
            <ListingsInProgress />
          </Tab>
          <Tab title={"Rejected Newsrooms"}>
            <ListingList listings={this.props.rejectedListings} />
          </Tab>
          <Tab title={"My Activity"}>
            <MyActivity />
          </Tab>
        </Tabs>
      </div>
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
