import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { Link } from "react-router-dom";
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
  RegistryEmptyIcon,
  StyledRegistryEmpty,
  StyledEmptyHeader,
  StyledEmptyCopy,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import * as heroImgUrl from "../images/img-hero-listings.png";

import ListingList from "./ListingList";
import { State } from "../../reducers";
import ListingsInProgress from "./ListingsInProgress";
import { StyledPageContent, StyledListingCopy } from "../utility/styledComponents";

const TABS: string[] = ["whitelisted", "in-progress", "rejected"];

export interface ListingProps {
  match?: any;
  history: any;
}

export interface ListingReduxProps {
  whitelistedListings: Set<string>;
  rejectedListings: Set<string>;
  parameters: any;
  error: undefined | string;
  loadingFinished: boolean;
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
                <StyledListingCopy>
                  All approved Newsrooms should align with the Civil Constitution, and are subject to Civil community
                  review. By participating in our governance, you can help curate high-quality, trustworthy journalism.
                </StyledListingCopy>
                {this.renderWhitelistedListings()}
              </StyledPageContent>
            </Tab>
            <Tab title={<ApplicationsInProgressTabText />}>
              <StyledPageContent>
                <ListingsInProgress match={this.props.match} history={this.props.history} />
              </StyledPageContent>
            </Tab>
            <Tab title={<RejectedNewsroomsTabText />}>
              <StyledPageContent>
                <StyledListingCopy>
                  Rejected Newsrooms have been removed from the Civil Registry due to a breach of the Civil
                  Constitution. Rejected Newsrooms can reapply to the Registry at any time. Learn how to reapply.
                </StyledListingCopy>
                {this.renderRejectedListings()}
              </StyledPageContent>
            </Tab>
          </Tabs>
        )}
      </>
    );
  }

  private renderWhitelistedListings = (): JSX.Element => {
    if (this.props.whitelistedListings.count()) {
      return <ListingList listings={this.props.whitelistedListings} />;
    }

    return (
      <StyledRegistryEmpty>
        <StyledEmptyHeader>There are no approved newsrooms</StyledEmptyHeader>
        <StyledEmptyCopy>
          You can <Link to="/registry/under-challenge">view new applications</Link> or{" "}
          <Link to="/createNewsroom">apply to join the Civil Registry</Link>
        </StyledEmptyCopy>
        <RegistryEmptyIcon />
      </StyledRegistryEmpty>
    );
  };

  private renderRejectedListings = (): JSX.Element => {
    if (this.props.rejectedListings.count()) {
      return <ListingList listings={this.props.rejectedListings} />;
    }

    return (
      <StyledRegistryEmpty>
        <StyledEmptyHeader>There are no rejected newsrooms</StyledEmptyHeader>
        <StyledEmptyCopy>
          You can <Link to="/registry/under-challenge">view new applications</Link> or{" "}
          <Link to="/createNewsroom">apply to join the Civil Registry</Link>
        </StyledEmptyCopy>
        <RegistryEmptyIcon />
      </StyledRegistryEmpty>
    );
  };

  private onTabChange = (activeIndex: number = 0): void => {
    const tabName = TABS[activeIndex];
    this.props.history.push(`/registry/${tabName}`);
  };
}

const mapStateToProps = (state: State, ownProps: ListingProps): ListingProps & ListingReduxProps => {
  const { whitelistedListings, rejectedListings, parameters, loadingFinished } = state.networkDependent;

  return {
    ...ownProps,
    whitelistedListings,
    rejectedListings,
    parameters,
    error: undefined,
    loadingFinished,
  };
};

export default connect(mapStateToProps)(Listings);
