import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { Hero, HomepageHero, Tabs, Tab, StyledTabNav, StyledTabLarge } from "@joincivil/components";
import * as heroImgUrl from "../images/img-hero-listings.png";

import ListingList from "./ListingList";
import { State } from "../../reducers";
import ListingsInProgress from "./ListingsInProgress";
import { StyledPageContent, StyledListingCopy } from "../utility/styledComponents";

const TABS: string[] = ["whitelisted", "under-challenge", "rejected"];

export interface ListingProps {
  match?: any;
  history: any;
}

export interface ListingReduxProps {
  whitelistedListings: Set<string>;
  rejectedListings: Set<string>;
  error: undefined | string;
}

class Listings extends React.Component<ListingProps & ListingReduxProps> {
  public render(): JSX.Element {
    const { listingType } = this.props.match.params;
    let activeIndex = 0;
    let hero;
    if (listingType) {
      activeIndex = TABS.indexOf(listingType) || 0;
    }
    if (activeIndex === 0) {
      hero = (
        <Hero backgroundImage={heroImgUrl}>
          <HomepageHero />
        </Hero>
      );
    }
    return (
      <>
        {hero}
        <Tabs
          activeIndex={activeIndex}
          TabsNavComponent={StyledTabNav}
          TabComponent={StyledTabLarge}
          onActiveTabChange={this.onTabChange}
        >
          <Tab title={"Whitelisted Newsrooms"}>
            <StyledPageContent>
              <StyledListingCopy>
                All approved Newsrooms should align with the Civil Constitution, and are subject to Civil community
                review. By participating in our governance, you can help curate high-quality, trustworthy journalism.
              </StyledListingCopy>
              <ListingList listings={this.props.whitelistedListings} />
            </StyledPageContent>
          </Tab>
          <Tab title={"Newsrooms Under Consideration"}>
            <StyledPageContent>
              <ListingsInProgress />
            </StyledPageContent>
          </Tab>
          <Tab title={"Rejected Newsrooms"}>
            <StyledPageContent>
              <StyledListingCopy>
                Rejected Newsrooms have been removed from the Civil Registry due to a breach of the Civil Constitution.
                Rejected Newsrooms can reapply to the Registry at any time. Learn how to reapply.
              </StyledListingCopy>
              <ListingList listings={this.props.rejectedListings} />
            </StyledPageContent>
          </Tab>
        </Tabs>
      </>
    );
  }

  private onTabChange = (activeIndex: number = 0): void => {
    const tabName = TABS[activeIndex];
    this.props.history.push(`/registry/${tabName}`);
  };
}

const mapStateToProps = (state: State, ownProps: ListingProps): ListingProps & ListingReduxProps => {
  const { whitelistedListings, rejectedListings } = state.networkDependent;

  return {
    ...ownProps,
    whitelistedListings,
    rejectedListings,
    error: undefined,
  };
};

export default connect(mapStateToProps)(Listings);
