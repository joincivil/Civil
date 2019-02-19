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

import { State } from "../../redux/reducers";
import * as heroImgUrl from "../images/img-hero-listings.png";
import LoadingMsg from "../utility/LoadingMsg";
import ScrollToTopOnMount from "../utility/ScrollToTop";
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
  govtParameters: any;
  error: undefined | string;
  loadingFinished: boolean;
  useGraphQL: boolean;
}

class Listings extends React.Component<ListingProps & ListingReduxProps> {
  public render(): JSX.Element {
    const { listingType } = this.props.match.params;
    let activeIndex = 0;
    if (listingType) {
      activeIndex = TABS.indexOf(listingType) || 0;
    }
    return (
      <>
        <ScrollToTopOnMount />
        <Hero backgroundImage={heroImgUrl}>
          <HomepageHero ctaButtonURL="/tokens" learnMoreURL="#zendesk" />
        </Hero>
        {!this.props.loadingFinished && <LoadingMsg />}
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
                  <title>The Civil Registry - A community-driven space for curating quality journalism</title>
                </Helmet>
                <StyledListingCopy>
                  All approved Newsrooms agreed to uphold the journalistic principles in the{" "}
                  <a href="https://civil.co/constitution/">Civil Constitution</a>, and Newsrooms are subject to Civil's{" "}
                  <a href="#zendesk">community vetting process</a>.
                </StyledListingCopy>
                <WhitelistedListingListContainer />
              </StyledPageContent>
            </Tab>
            <Tab title={<ApplicationsInProgressTabText />}>
              <StyledPageContent>
                <ListingsInProgressContainer
                  match={this.props.match}
                  history={this.props.history}
                  govtParameters={this.props.govtParameters}
                />
              </StyledPageContent>
            </Tab>
            <Tab title={<RejectedNewsroomsTabText />}>
              <StyledPageContent>
                <Helmet>
                  <title>Rejected Newsrooms - The Civil Registry</title>
                </Helmet>
                <StyledListingCopy>
                  Rejected Newsrooms have been removed from the Civil Registry following a vote that they had violated
                  the <a href="https://civil.co/constitution/">Civil Constitution</a> in some way. Rejected Newsrooms
                  can reapply to the Registry at any time. <a href="#zendesk">Learn how</a>.
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
  const { parameters, govtParameters } = state.networkDependent;
  const useGraphQL = state.useGraphQL;
  return {
    ...ownProps,
    parameters,
    govtParameters,
    error: undefined,
    loadingFinished: true,
    useGraphQL,
  };
};

export default connect(mapStateToProps)(Listings);
