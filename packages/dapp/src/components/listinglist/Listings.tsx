import * as React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/typescript-types";
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
  LoadingMessage,
} from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";

import { State } from "../../redux/reducers";
import * as heroImgUrl from "../images/img-hero-listings.png";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { StyledPageContent } from "../utility/styledComponents";

import WhitelistedListingListContainer from "./WhitelistedListingListContainer";
import RejectedListingListContainer from "./RejectedListingListContainer";
import ListingsInProgressContainer from "./ListingsInProgressContainer";

const TABS: string[] = ["approved", "in-progress", "rejected"];

export interface ListingProps {
  match?: any;
  history: any;
}

export interface ListingReduxProps {
  govtParameters: any;
  error: undefined | string;
  loadingFinished: boolean;
  userAcct: EthAddress;
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
          <HomepageHero
            applyURL={links.APPLY}
            buyCvlUrl={links.BECOME_A_MEMBER}
            learnMoreURL={links.FAQ_COMMUNITY_VETTING_PROCESS}
          />
        </Hero>
        {!this.props.loadingFinished && <LoadingMessage />}
        {this.props.loadingFinished && (
          <Tabs
            activeIndex={activeIndex}
            TabsNavComponent={StyledTabNav}
            TabComponent={StyledTabLarge}
            onActiveTabChange={this.onTabChange}
          >
            <Tab title={<ApprovedNewsroomsTabText />}>
              <StyledPageContent>
                <Helmet title="The Civil Registry - A community-driven space for curating quality journalism" />
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
                <Helmet title="Rejected Newsrooms - The Civil Registry" />
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
  const { govtParameters, user } = state.networkDependent;
  const userAcct = user && user.account && user.account.account;
  return {
    ...ownProps,
    govtParameters,
    error: undefined,
    loadingFinished: true,
    userAcct,
  };
};

export default connect(mapStateToProps)(Listings);
