import * as React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import {
  Hero,
  HomepageHero,
  Tabs,
  Tab,
  StyledTabNav,
  StyledTabLarge,
  ApprovedNewsroomsTabText,
  ApplicationsInProgressTabText,
  RejectedNewsroomsTabText,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { getCivil } from "../../helpers/civilInstance";
import * as heroImgUrl from "../images/img-hero-listings.png";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { State } from "../../redux/reducers";
import { StyledPageContent, StyledListingCopy } from "../utility/styledComponents";

import WhitelistedListingListContainer from "./WhitelistedListingListContainer";
import RejectedListingListContainer from "./RejectedListingListContainer";
import ListingsInProgressContainer from "./ListingsInProgressContainer";

const TABS: string[] = ["whitelisted", "in-progress", "rejected"];

export interface ListingProps {
  match?: any;
  history: any;
}

export interface ListingReduxProps {
  parameters: any;
  error: undefined | string;
  loadingFinished: boolean;
  useGraphQL: boolean;
}

class Listings extends React.Component<ListingProps & ListingReduxProps> {
  public render(): JSX.Element {
    const { listingType } = this.props.match.params;
    let activeIndex = 0;
    let hero;
    const civil = getCivil();
    const minDeposit =
      (this.props.parameters &&
        this.props.parameters.minDeposit &&
        getFormattedTokenBalance(civil.toBigNumber(this.props.parameters.minDeposit), true)) ||
      "";
    if (listingType) {
      activeIndex = TABS.indexOf(listingType) || 0;
    }
    if (activeIndex === 0) {
      hero = (
        <Hero backgroundImage={heroImgUrl}>
          <HomepageHero textUrl="https://civil.co" buttonUrl="/createNewsroom" minDeposit={minDeposit} />
        </Hero>
      );
    }
    return (
      <>
        <ScrollToTopOnMount />
        {hero}
        {!this.props.loadingFinished && "loading..."}
        {this.props.loadingFinished && (
          <Tabs
            activeIndex={activeIndex}
            TabsNavComponent={StyledTabNav}
            TabComponent={StyledTabLarge}
            onActiveTabChange={this.onTabChange}
          >
            <Tab title={<ApprovedNewsroomsTabText />}>
              <StyledPageContent>
                <Helmet>
                  <title>The Civil Registry - Participate in credible, trustworthy journalism</title>
                </Helmet>
                <StyledListingCopy>
                  All approved Newsrooms should align with the Civil Constitution, and are subject to Civil community
                  review. By participating in our governance, you can help curate high-quality, trustworthy journalism.
                </StyledListingCopy>
                <WhitelistedListingListContainer />
              </StyledPageContent>
            </Tab>
            <Tab title={<ApplicationsInProgressTabText />}>
              <StyledPageContent>
                <ListingsInProgressContainer match={this.props.match} history={this.props.history} />
              </StyledPageContent>
            </Tab>
            <Tab title={<RejectedNewsroomsTabText />}>
              <StyledPageContent>
                <Helmet>
                  <title>Rejected Newsrooms - The Civil Registry</title>
                </Helmet>
                <StyledListingCopy>
                  Rejected Newsrooms have been removed from the Civil Registry due to a breach of the Civil
                  Constitution. Rejected Newsrooms can reapply to the Registry at any time. Learn how to reapply.
                </StyledListingCopy>
                <RejectedListingListContainer />
              </StyledPageContent>
            </Tab>
          </Tabs>
        )}
      </>
    );
  }

  private onTabChange = (activeIndex: number = 0): void => {
    const tabName = TABS[activeIndex];
    this.props.history.push(`/registry/${tabName}`);
  };
}

const mapStateToProps = (state: State, ownProps: ListingProps): ListingProps & ListingReduxProps => {
  const { parameters } = state.networkDependent;
  const useGraphQL = state.useGraphQL;
  return {
    ...ownProps,
    parameters,
    error: undefined,
    loadingFinished: true,
    useGraphQL,
  };
};

export default connect(mapStateToProps)(Listings);
