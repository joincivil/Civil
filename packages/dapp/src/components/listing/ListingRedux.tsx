import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { compose } from "redux";

import { EthAddress, ListingWrapper, NewsroomWrapper, CharterData, StorageHeader } from "@joincivil/core";
import {
  Tabs,
  Tab,
  StyledTab,
  StyledContentRow,
  StyledLeftContentWell,
  StyledRightContentWell,
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
import ListingBoosts from "./ListingBoosts";
import ListingHeader from "./ListingHeader";
import ListingCharter from "./ListingCharter";
import ListingPhaseActions from "./ListingPhaseActions";
import ListingChallengeStatement from "./ListingChallengeStatement";
import { ListingTabContent } from "./styledComponents";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";

const TABS: TListingTab[] = [
  listingTabs.CHARTER,
  listingTabs.DISCUSSIONS,
  listingTabs.HISTORY,
  listingTabs.BOOSTS,
  listingTabs.OWNER,
];

export interface ListingPageComponentProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  charterRevisions?: Map<number, StorageHeader>;
  match?: any;
  history: any;
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
  parameters: any;
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
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

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
    } else if (listing && listing.data.challenge) {
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

              <Tab title="Boosts">
                <ListingTabContent>
                  <ListingBoosts listingAddress={this.props.listingAddress} newsroom={this.props.newsroom} />
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
    this.props.history.push(`/listing/${this.props.listingAddress}/${tabName}`);
  };

  private showCharterTab = (): void => {
    this.onTabChange(0);
  };
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state: State, ownProps: ListingPageComponentProps): ListingReduxProps => {
    const { user, parameters, govtParameters, content, loadingFinished } = state.networkDependent;
    const { network } = state;
    const newsroom = ownProps.newsroom;

    const listingPhaseState = getListingPhaseState(ownProps.listing);

    let charter;
    let charterUri;
    let charterRevisionId =
      newsroom && newsroom.data && newsroom.data.charterHeader && newsroom.data.charterHeader.revisionId;
    let charterRevision;
    if (
      listingPhaseState &&
      listingPhaseState.isUnderChallenge &&
      ownProps.listing &&
      ownProps.listing.data.challenge
    ) {
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
      parameters,
      govtParameters,
      charter,
      charterRevisionId,
      charterRevision,
      loadingFinished,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps),
)(ListingPageComponent);
