import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";

import ListingOwnerActions from "./ListingOwnerActions";
import ListingDiscourse from "./ListingDiscourse";
import ListingHistory from "./ListingHistory";
import ListingHeader from "./ListingHeader";
import ListingPhaseActions from "./ListingPhaseActions";
import ListingChallengeStatement from "./ListingChallengeStatement";
import { State } from "../../reducers";
import { fetchAndAddListingData } from "../../actionCreators/listings";
import {
  makeGetListingPhaseState,
  makeGetListing,
  makeGetListingExpiry,
  makeGetIsUserNewsroomOwner,
} from "../../selectors";
import { GridRow, LeftShark, RightShark, ListingTabContent } from "./styledComponents";
import { Tabs, Tab, StyledTab } from "@joincivil/components";

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
  isUserNewsroomOwner?: boolean;
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
          <>
            <ListingHeader
              userAccount={this.props.userAccount}
              listing={listing!}
              newsroom={newsroom!.wrapper}
              listingPhaseState={this.props.listingPhaseState}
            />
          </>
        )}

        <GridRow>
          <LeftShark>
            {!listingExistsAsNewsroom && this.renderListingNotFound()}

            <Tabs TabComponent={StyledTab}>
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
  const getListingPhaseState = makeGetListingPhaseState();
  const getListing = makeGetListing();
  const getListingExpiry = makeGetListingExpiry();
  const getIsUserNewsroomOwner = makeGetIsUserNewsroomOwner();
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
      isUserNewsroomOwner: getIsUserNewsroomOwner(state, ownProps),
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
