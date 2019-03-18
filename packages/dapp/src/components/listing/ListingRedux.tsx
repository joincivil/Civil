import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Helmet } from "react-helmet";

import { EthAddress, ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";
import {
  Tabs,
  Tab,
  StyledTab,
  StyledContentRow,
  StyledLeftContentWell,
  StyledRightContentWell,
} from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";

import { State } from "../../redux/reducers";
import { fetchAndAddListingData, setupListingHistorySubscription } from "../../redux/actionCreators/listings";
import { getListingPhaseState, makeGetListingExpiry, getIsUserNewsroomOwner } from "../../selectors";
import { getContent } from "../../redux/actionCreators/newsrooms";
import LoadingMsg from "../utility/LoadingMsg";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";
import EmailSignup from "./EmailSignup";
import ListingOwnerActions from "./ListingOwnerActions";
import ListingDiscourse from "./ListingDiscourse";
import ListingHistory from "./ListingHistory";
import ListingHeader from "./ListingHeader";
import ListingCharter from "./ListingCharter";
import ListingPhaseActions from "./ListingPhaseActions";
import ListingChallengeStatement from "./ListingChallengeStatement";
import { ListingTabContent } from "./styledComponents";

export interface ListingPageComponentProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
}

export interface ListingReduxProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  expiry?: number;
  userAccount?: EthAddress;
  isUserNewsroomOwner?: boolean;
  listingDataRequestStatus?: any;
  listingPhaseState?: any;
  charter?: CharterData;
  parameters: any;
  govtParameters: any;
  network: string;
  useGraphQL: boolean;
  loadingFinished: boolean;
}

interface ListingPageComponentState {
  activeTab: number;
}

class ListingPageComponent extends React.Component<
  ListingReduxProps & DispatchProp<any> & ListingPageComponentProps,
  ListingPageComponentState
> {
  constructor(props: ListingReduxProps & DispatchProp<any> & ListingPageComponentProps) {
    super(props);
    this.state = { activeTab: 0 };
  }

  public async componentDidUpdate(): Promise<void> {
    if (!this.props.listing && !this.props.listingDataRequestStatus && !this.props.useGraphQL) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress));
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.data.charterHeader!));
    }
  }

  public async componentDidMount(): Promise<void> {
    if (!this.props.useGraphQL) {
      this.props.dispatch!(await setupListingHistorySubscription(this.props.listingAddress));
      if (!this.props.listing && !this.props.listingDataRequestStatus) {
        this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress));
      }
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.data.charterHeader!));
    }
  }

  public componentWillMount(): void {
    const listing = this.props.listing;
    const activeTab = listing && listing.data.challenge ? 1 : 0;
    this.setState({ activeTab });
  }

  public render(): JSX.Element {
    const listing = this.props.listing;
    const newsroom = this.props.newsroom;
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
              expiry={this.props.expiry}
              listingPhaseState={this.props.listingPhaseState}
              parameters={this.props.parameters}
              govtParameters={this.props.govtParameters}
              constitutionURI={links.CONSTITUTION}
            />
            <EmailSignup />
          </StyledRightContentWell>

          <StyledLeftContentWell>
            <Tabs TabComponent={StyledTab} activeIndex={this.state.activeTab} onActiveTabChange={this.onTabChange}>
              <Tab title="About">
                <ListingTabContent>
                  <ListingCharter
                    listing={this.props.listing!}
                    newsroom={this.props.newsroom!}
                    charter={this.props.charter}
                  />
                </ListingTabContent>
              </Tab>

              <Tab title="Discussions">
                <ListingTabContent>
                  <ListingChallengeStatement listingAddress={this.props.listingAddress} listing={this.props.listing} />

                  <p>
                    Use this space to discuss or ask questions of the Civil community. When using this forum, you agree
                    to adhere to our <a href={links.CODE_OF_CONDUCT}>code of conduct</a>. If you have questions, please{" "}
                    <a href={links.CONTACT}>contact us</a>.
                  </p>
                  <ListingDiscourse />
                </ListingTabContent>
              </Tab>

              <Tab title="History">
                <ListingTabContent>
                  <ListingHistory listingAddress={this.props.listingAddress} />
                </ListingTabContent>
              </Tab>

              {(this.props.isUserNewsroomOwner &&
                this.props.listing && (
                  <Tab title="Owner Actions">
                    <ListingTabContent>
                      <ListingOwnerActions listing={this.props.listing} />
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
    if (!this.props.loadingFinished && !this.props.useGraphQL) {
      return <LoadingMsg />;
    }
    return <ErrorNotFoundMsg>We could not find this Newsroom Listing</ErrorNotFoundMsg>;
  }

  private onTabChange = (newActiveTab: number): void => {
    this.setState({ activeTab: newActiveTab });
  };
}

const makeMapStateToProps = () => {
  const getListingExpiry = makeGetListingExpiry();
  const mapStateToProps = (state: State, ownProps: ListingPageComponentProps): ListingReduxProps => {
    const { listingsFetching, user, parameters, govtParameters, content, loadingFinished } = state.networkDependent;
    const { network, useGraphQL } = state;
    const newsroom = ownProps.newsroom;
    let listingDataRequestStatus;
    if (ownProps.listingAddress) {
      listingDataRequestStatus = listingsFetching.get(ownProps.listingAddress.toString());
    }
    let charter;
    if (newsroom && newsroom.data.charterHeader) {
      charter = content.get(newsroom.data.charterHeader.uri) as CharterData;
    }
    const expiry = getListingExpiry(state, ownProps);
    const listingPhaseState = getListingPhaseState(ownProps.listing);
    return {
      ...ownProps,
      network,
      expiry,
      listingDataRequestStatus,
      listingPhaseState,
      isUserNewsroomOwner: getIsUserNewsroomOwner(newsroom, user),
      userAccount: user.account,
      parameters,
      govtParameters,
      charter,
      useGraphQL,
      loadingFinished,
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ListingPageComponent);
