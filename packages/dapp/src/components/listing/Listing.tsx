import * as React from "react";

import ListingDiscourse from "./ListingDiscourse";
import ListingHistory from "./ListingHistory";
import ListingDetail from "./ListingDetail";
import ListingPhaseActions from "./ListingPhaseActions";
import ListingChallengeStatement from "./ListingChallengeStatement";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { State } from "../../reducers";
import { connect, DispatchProp } from "react-redux";
import { fetchAndAddListingData } from "../../actionCreators/listings";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { makeGetListingPhaseState, makeGetListing, makeGetListingExpiry } from "../../selectors";
import { Tabs } from "../tabs/Tabs";
import { Tab } from "../tabs/Tab";

import styled from "styled-components";
import { ViewModule } from "../utility/ViewModules";
const GridRow = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 0 0 200px;
  width: 1200px;
`;
const LeftShark = styled.div`
  width: 695px;
`;
const RightShark = styled.div`
  margin: -100px 0 0 15px;
  width: 485px;
`;

export interface ListingPageProps {
  match: any;
}

export interface ListingPageComponentProps {
  listingAddress: EthAddress;
}

export interface ListingReduxProps {
  newsroom: NewsroomState | undefined;
  listing: ListingWrapper | undefined;
  expiry?: number;
  userAccount?: EthAddress;
  listingDataRequestStatus?: any;
  listingPhaseState?: any;
  parameters: any;
  govtParameters: any;
  constitutionURI: string;
}

class ListingPageComponent extends React.Component<ListingReduxProps & DispatchProp<any> & ListingPageComponentProps> {
  public componentDidUpdate(): void {
    if (!this.props.listing && !this.props.listingDataRequestStatus) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress));
    }
  }

  public render(): JSX.Element {
    const listing = this.props.listing;
    const newsroom = this.props.newsroom;
    const listingExistsAsNewsroom = listing && newsroom;
    return (
      <>
        {listingExistsAsNewsroom && (
          <ListingDetail
            userAccount={this.props.userAccount}
            listing={listing!}
            newsroom={newsroom!.wrapper}
            listingPhaseState={this.props.listingPhaseState}
          />
        )}

        <GridRow>
          <LeftShark>
            {!listingExistsAsNewsroom && this.renderListingNotFound()}

            <Tabs>
              <Tab tabText="Discuss">
                <ViewModule>
                  <ListingChallengeStatement listing={this.props.listingAddress} />
                  <ListingDiscourse />
                </ViewModule>
              </Tab>

              <Tab tabText="History">
                <ListingHistory listing={this.props.listingAddress} />
              </Tab>
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
  const getListingPhaseState = makeGetListingPhaseState();
  const getListing = makeGetListing();
  const getListingExpiry = makeGetListingExpiry();
  const mapStateToProps = (state: State, ownProps: ListingPageComponentProps): ListingReduxProps => {
    const { newsrooms } = state;
    const { listingsFetching, user, parameters, govtParameters, constitution } = state.networkDependent;
    const constitutionURI = constitution.get("uri");

    let listingDataRequestStatus;
    if (ownProps.listingAddress) {
      listingDataRequestStatus = listingsFetching.get(ownProps.listingAddress.toString());
    }

    return {
      newsroom: newsrooms.get(ownProps.listingAddress),
      listing: getListing(state, ownProps),
      expiry: getListingExpiry(state, ownProps),
      listingDataRequestStatus,
      listingPhaseState: getListingPhaseState(state, ownProps),
      userAccount: user.account,
      parameters,
      govtParameters,
      constitutionURI,
    };
  };
  return mapStateToProps;
};

export const ListingPage = connect(makeMapStateToProps)(ListingPageComponent);

export default class ListingPageContainer extends React.Component<ListingPageProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.match.params.listing;
    return <ListingPage listingAddress={listingAddress} />;
  }
}
