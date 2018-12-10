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

import { State } from "../../redux/reducers";
import { fetchAndAddListingData, setupListingHistorySubscription } from "../../redux/actionCreators/listings";
import { getListingPhaseState, makeGetListingExpiry, getIsUserNewsroomOwner } from "../../selectors";
import { getContent } from "../../redux/actionCreators/newsrooms";

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
  constitutionURI: string;
  useGraphQL: boolean;
}

class ListingPageComponent extends React.Component<ListingReduxProps & DispatchProp<any> & ListingPageComponentProps> {
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
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.data.charterHeader!));
    }
  }

  public render(): JSX.Element {
    const listing = this.props.listing;
    const newsroom = this.props.newsroom;
    const listingExistsAsNewsroom = listing && newsroom;

    return (
      <>
        {listingExistsAsNewsroom && (
          <>
            <Helmet>
              <title>{newsroom!.data.name} - The Civil Registry</title>
            </Helmet>

            <ListingHeader
              userAccount={this.props.userAccount}
              listing={listing!}
              newsroom={newsroom!}
              listingPhaseState={this.props.listingPhaseState}
              charter={this.props.charter}
            />
          </>
        )}
        <StyledContentRow reverseDirection={true}>
          <StyledRightContentWell offsetTop={-100}>
            {listingExistsAsNewsroom && (
              <ListingPhaseActions
                listing={this.props.listing!}
                expiry={this.props.expiry}
                listingPhaseState={this.props.listingPhaseState}
                parameters={this.props.parameters}
                govtParameters={this.props.govtParameters}
                constitutionURI={this.props.constitutionURI}
              />
            )}
          </StyledRightContentWell>

          <StyledLeftContentWell>
            {!listingExistsAsNewsroom && this.renderListingNotFound()}

            <Tabs TabComponent={StyledTab}>
              {(listingExistsAsNewsroom && (
                <Tab title="About">
                  <ListingTabContent>
                    <ListingCharter
                      listing={this.props.listing!}
                      newsroom={this.props.newsroom!}
                      charter={this.props.charter}
                    />
                  </ListingTabContent>
                </Tab>
              )) || <></>}

              <Tab title="Discussions">
                <ListingTabContent>
                  <ListingChallengeStatement listingAddress={this.props.listingAddress} />

                  <p>
                    Use this space to discuss, ask questions, or cheer on the newsmakers. If you have questions, check
                    out our help page.
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

  private renderListingNotFound(): JSX.Element {
    return <>NOT FOUND</>;
  }
}

const makeMapStateToProps = () => {
  const getListingExpiry = makeGetListingExpiry();
  const mapStateToProps = (state: State, ownProps: ListingPageComponentProps): ListingReduxProps => {
    const { listingsFetching, user, parameters, govtParameters, constitution, content } = state.networkDependent;
    const { useGraphQL } = state;
    const constitutionURI = constitution.get("uri");
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
      expiry,
      listingDataRequestStatus,
      listingPhaseState,
      isUserNewsroomOwner: getIsUserNewsroomOwner(newsroom, user),
      userAccount: user.account,
      parameters,
      govtParameters,
      constitutionURI,
      charter,
      useGraphQL,
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ListingPageComponent);
