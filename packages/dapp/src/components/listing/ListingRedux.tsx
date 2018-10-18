import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";

import ListingOwnerActions from "./ListingOwnerActions";
import ListingDiscourse from "./ListingDiscourse";
import ListingHistory from "./ListingHistory";
import ListingHeader from "./ListingHeader";
import ListingCharter from "./ListingCharter";
import ListingPhaseActions from "./ListingPhaseActions";
import ListingChallengeStatement from "./ListingChallengeStatement";
import { State } from "../../reducers";
import { fetchAndAddListingData, setupListingHistorySubscription } from "../../actionCreators/listings";
import { getListingPhaseState, makeGetListingExpiry, getIsUserNewsroomOwner } from "../../selectors";
import { GridRow, LeftShark, RightShark, ListingTabContent } from "./styledComponents";
import { Tabs, Tab, StyledTab } from "@joincivil/components";
import { getContent } from "../../actionCreators/newsrooms";

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
  parameters: any;
  govtParameters: any;
  constitutionURI: string;
  charter: any;
}

class ListingPageComponent extends React.Component<ListingReduxProps & DispatchProp<any> & ListingPageComponentProps> {
  public async componentDidUpdate(): Promise<void> {
    if (!this.props.listing && !this.props.listingDataRequestStatus) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress));
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.data.charterHeader!));
    }
  }

  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(await setupListingHistorySubscription(this.props.listingAddress));
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
            <ListingHeader
              userAccount={this.props.userAccount}
              listing={listing!}
              newsroom={newsroom!}
              listingPhaseState={this.props.listingPhaseState}
              charter={this.props.charter}
            />
          </>
        )}
        <GridRow>
          <LeftShark>
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
          </LeftShark>

          <RightShark>
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
          </RightShark>
        </GridRow>
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
    const constitutionURI = constitution.get("uri");
    const newsroom = ownProps.newsroom;
    let listingDataRequestStatus;
    if (ownProps.listingAddress) {
      listingDataRequestStatus = listingsFetching.get(ownProps.listingAddress.toString());
    }
    let charter;
    if (newsroom && newsroom.data.charterHeader) {
      console.log("newsroom.data.charterHeader: ", newsroom.data.charterHeader);
      charter = content.get(newsroom.data.charterHeader);
    }
    console.log("charter: ", charter);
    const expiry = getListingExpiry(state, ownProps);
    console.log("expiry: ", expiry);
    const listingPhaseState = getListingPhaseState(ownProps.listing);
    console.log("listingPhaseState: ", listingPhaseState);
    return {
      ...ownProps,
      expiry: undefined,
      listingDataRequestStatus,
      listingPhaseState,
      isUserNewsroomOwner: getIsUserNewsroomOwner(newsroom, user),
      userAccount: user.account,
      parameters,
      govtParameters,
      constitutionURI,
      charter,
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ListingPageComponent);
