import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { compose } from "redux";

import { EthAddress, ListingWrapper, NewsroomWrapper, CharterData, StorageHeader } from "@joincivil/typescript-types";
import {
  Tabs,
  Tab,
  StyledTab,
  StyledContentRow,
  StyledLeftContentWell,
  StyledRightContentWell,
  CivilContext,
  ICivilContext,
} from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";

import { listingTabs, TListingTab } from "../../constants";
import { State } from "../../redux/reducers";
import { getListingPhaseState, getIsUserNewsroomOwner } from "../../selectors";
import { getContent, getBareContent } from "../../redux/actionCreators/newsrooms";
import EmailSignup from "./EmailSignup";
import ListingOwnerActions from "./ListingOwnerActions";
import ListingDiscourse from "./ListingDiscourse";
import ListingHistory from "./ListingHistory";
import ListingHeader from "./ListingHeader";
import ListingCharter from "./ListingCharter";
import ListingPhaseActions from "./ListingPhaseActions";
import ListingChallengeStatement from "./ListingChallengeStatement";
import { ListingTabContent } from "./styledComponents";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";
import { connectParameters } from "../utility/HigherOrderComponents";
import StoryFeed from "../StoryFeed/StoryFeed";

const TABS: TListingTab[] = [
  listingTabs.STORYFEED,
  listingTabs.CHARTER,
  listingTabs.DISCUSSIONS,
  listingTabs.HISTORY,
  listingTabs.OWNER,
];

export interface ListingPageComponentProps {
  listingAddress: EthAddress;
  listingId: string;
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  charterRevisions?: Map<number, StorageHeader>;
  match?: any;
  location: any;
  history: any;
  payment?: boolean;
  newsroomDetails?: boolean;
  channelID?: string;
}

export interface ListingReduxProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  userAccount?: EthAddress;
  isUserNewsroomOwner?: boolean;
  listingPhaseState?: any;
  charter?: CharterData;
  charterRevisionId?: number;
  charterRevision?: StorageHeader;
  govtParameters: any;
  network: string;
  loadingFinished: boolean;
}

interface ListingPageComponentState {
  activeTabIndex: number;
}

class ListingPageComponent extends React.Component<
  ListingReduxProps & DispatchProp<any> & ListingPageComponentProps,
  ListingPageComponentState
> {
  public static contextType = CivilContext;
  public context: ICivilContext;

  constructor(props: ListingReduxProps & DispatchProp<any> & ListingPageComponentProps) {
    super(props);
    this.state = { activeTabIndex: 0 };
  }

  public async componentDidUpdate(): Promise<void> {
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.context, this.props.newsroom.data.charterHeader!));
    }
    if (this.props.listing && this.props.listing.data.challenge) {
      this.props.dispatch!(
        await getBareContent(this.context, this.props.listing.data.challenge.challengeStatementURI!),
      );
    }
    if (this.props.charterRevision && !this.props.charter) {
      this.props.dispatch!(await getContent(this.context, this.props.charterRevision));
    }
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.context, this.props.newsroom.data.charterHeader!));
    }
  }

  public componentWillMount(): void {
    const { activeTab } = this.props.match.params;
    const listing = this.props.listing;
    let activeTabIndex = 0;

    if (activeTab) {
      activeTabIndex = TABS.indexOf(activeTab) || 0;
    } else if (listing && listing.data.isWhitelisted) {
      activeTabIndex = 0;
    } else if (listing && listing.data.challenge) {
      activeTabIndex = 2;
    } else {
      activeTabIndex = 1;
    }

    this.setState({ activeTabIndex });
  }

  public render(): JSX.Element {
    const { listing, newsroom, listingPhaseState, charterRevisionId, charterRevisions } = this.props;
    const listingExistsAsNewsroom = listing && newsroom;

    if (!listingExistsAsNewsroom) {
      return <>{this.renderLoadingOrListingNotFound()}</>;
    }

    return (
      <>
        <Helmet title={`${newsroom!.data.name} - The Civil Registry`} />

        <ListingHeader
          userAccount={this.props.userAccount}
          network={this.props.network}
          listing={listing!}
          newsroom={newsroom!}
          listingPhaseState={this.props.listingPhaseState}
          charter={this.props.charter}
        />

        <StyledContentRow reverseDirection={true}>
          <StyledRightContentWell offsetTop={-100}>
            <ListingPhaseActions
              listingAddress={this.props.listing!.address}
              listing={this.props.listing!}
              newsroom={this.props.newsroom!}
              listingPhaseState={this.props.listingPhaseState}
              listingLastGovState={this.props.listing!.data.lastGovState}
              parameters={this.props.parameters}
              govtParameters={this.props.govtParameters}
              constitutionURI={links.CONSTITUTION}
            />
            <EmailSignup />
          </StyledRightContentWell>

          <StyledLeftContentWell>
            <Tabs TabComponent={StyledTab} activeIndex={this.state.activeTabIndex} onActiveTabChange={this.onTabChange}>
              <Tab title="Storyfeed">
                <ListingTabContent>
                  <StoryFeed
                    queryFilterAlg="vw_post_fair_with_interleaved_boosts_2"
                    queryFilterChannelID={this.props.channelID}
                    match={this.props.match}
                    payment={this.props.payment}
                    newsroom={this.props.newsroomDetails}
                    onCloseStoryBoost={this.closeStoryBoost}
                    onOpenStoryDetails={this.openStoryDetails}
                    onOpenPayments={this.openPayments}
                    isListingPageFeed={true}
                  />
                </ListingTabContent>
              </Tab>
              <Tab title="Charter">
                <ListingTabContent>
                  <ListingCharter
                    listing={listing!}
                    newsroom={newsroom!}
                    charterRevisionId={charterRevisionId}
                    charterRevisions={charterRevisions}
                    isListingUnderChallenge={listingPhaseState.isUnderChallenge}
                  />
                </ListingTabContent>
              </Tab>

              <Tab title="Discussions">
                <ListingTabContent>
                  <ListingChallengeStatement
                    listingAddress={this.props.listingAddress}
                    listing={this.props.listing}
                    showCharterTab={this.showCharterTab}
                  />

                  <p>
                    Use this space to discuss or ask questions of the Civil community. When using this forum, you agree
                    to adhere to our <a href={links.CODE_OF_CONDUCT}>code of conduct</a>. If you have questions, please{" "}
                    <a href={links.CONTACT}>contact us</a>.
                  </p>
                  <ListingDiscourse listingAddress={this.props.listingAddress} network={this.props.network} />
                </ListingTabContent>
              </Tab>

              <Tab title="History">
                <ListingTabContent>
                  <ListingHistory listingAddress={this.props.listingAddress} />
                </ListingTabContent>
              </Tab>

              {(this.props.isUserNewsroomOwner && this.props.listing && (
                <Tab title="Owner Actions">
                  <ListingTabContent>
                    <ListingOwnerActions listing={this.props.listing} newsroom={this.props.newsroom!} />
                  </ListingTabContent>
                </Tab>
              )) || <></>}
            </Tabs>
          </StyledLeftContentWell>
        </StyledContentRow>
      </>
    );
  }

  private renderLoadingOrListingNotFound(): JSX.Element {
    return <ErrorNotFoundMsg>We could not find this Newsroom Listing</ErrorNotFoundMsg>;
  }

  private onTabChange = (newActiveTabIndex: number): void => {
    const tabName = TABS[newActiveTabIndex];
    this.setState({ activeTabIndex: newActiveTabIndex });
    this.props.history.push(`/listing/${this.props.listingId}/${tabName}`);
  };

  private showCharterTab = (): void => {
    this.onTabChange(0);
  };

  private closeStoryBoost = () => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/listing/" + this.props.listingId + "/storyfeed",
    });
  };

  private openStoryDetails = (postId: string) => {
    this.context.fireAnalyticsEvent("listing story boost", "story details clicked", postId);
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/listing/" + this.props.listingId + "/storyfeed/" + postId,
    });
  };

  private openPayments = (postId: string) => {
    this.context.fireAnalyticsEvent("listing story boost", "boost button clicked", postId);
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/listing/" + this.props.listingId + "/storyfeed/" + postId + "/payment",
    });
  };
}

const mapStateToProps = (state: State, ownProps: ListingPageComponentProps): ListingReduxProps => {
  const { user, govtParameters, content, loadingFinished } = state.networkDependent;
  const { network } = state;
  const newsroom = ownProps.newsroom;

  const listingPhaseState = getListingPhaseState(ownProps.listing);

  let charter;
  let charterUri;
  let charterRevisionId =
    newsroom && newsroom.data && newsroom.data.charterHeader && newsroom.data.charterHeader.revisionId;
  let charterRevision;
  if (listingPhaseState && listingPhaseState.isUnderChallenge && ownProps.listing && ownProps.listing.data.challenge) {
    const challengeStatement = content.get(ownProps.listing.data.challenge.challengeStatementURI!);
    if (challengeStatement && (challengeStatement as any).charterRevisionId !== undefined) {
      charterRevisionId = (challengeStatement as any).charterRevisionId;
    }
    if (ownProps.charterRevisions) {
      charterRevision = ownProps.charterRevisions.get(charterRevisionId!);
      if (charterRevision) {
        charter = content.get(charterRevision.uri) as CharterData;
      }
    }
  } else {
    if (newsroom && newsroom.data.charterHeader) {
      charterUri = newsroom.data.charterHeader.uri;
      charter = content.get(charterUri) as CharterData;
      charterRevisionId = newsroom.data.charterHeader.revisionId;
    }
  }

  return {
    ...ownProps,
    network,
    listingPhaseState,
    isUserNewsroomOwner: getIsUserNewsroomOwner(newsroom, user),
    userAccount: user.account,
    govtParameters,
    charter,
    charterRevisionId,
    charterRevision,
    loadingFinished,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  connectParameters,
)(ListingPageComponent);
