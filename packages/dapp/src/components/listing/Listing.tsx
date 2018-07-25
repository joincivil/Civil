import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";

import ListingDiscourse from "./ListingDiscourse";
import ListingHistory from "./ListingHistory";
import ListingDetail from "./ListingDetail";
import ListingPhaseActions from "./ListingPhaseActions";
import ListingChallengeStatement from "./ListingChallengeStatement";
import { State } from "../../reducers";
import { fetchAndAddListingData } from "../../actionCreators/listings";
import { makeGetListingPhaseState, makeGetListing, makeGetListingExpiry } from "../../selectors";
import { GridRow, LeftShark, RightShark, ListingTabContent, ListingTab } from "./styledComponents";
import { Tabs, Tab } from "@joincivil/components";

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

            <Tabs TabComponent={ListingTab}>
              <Tab title="Discussions">
                <ListingTabContent>
                  <ListingChallengeStatement listing={this.props.listingAddress} />

                  <p>
                    Use this space to discuss, ask questions, or cheer on the newsmakers. If you have questions, check
                    out our help page.
                  </p>
                  <ListingDiscourse />
                </ListingTabContent>
              </Tab>
              <Tab title="History">
                <ListingTabContent>
                  <ListingHistory listing={this.props.listingAddress} />
                </ListingTabContent>
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
