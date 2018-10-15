import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";

// import ListingOwnerActions from "./ListingOwnerActions";
// import ListingDiscourse from "./ListingDiscourse";
// import ListingHistory from "./ListingHistory";
import ListingHeader from "./ListingHeader";
// import ListingCharter from "./ListingCharter";
// import ListingPhaseActions from "./ListingPhaseActions";
// import ListingChallengeStatement from "./ListingChallengeStatement";
import { State } from "../../reducers";
import { fetchAndAddListingData, setupListingHistorySubscription } from "../../actionCreators/listings";
import {
  makeGetListingPhaseState,
  makeGetListing,
  makeGetListingExpiry,
  makeGetIsUserNewsroomOwner,
} from "../../selectors";
// import { GridRow, LeftShark, RightShark, ListingTabContent } from "./styledComponents";
// import { Tabs, Tab, StyledTab } from "@joincivil/components";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { BigNumber } from "bignumber.js";

export interface ListingPageProps {
  match: any;
}

export interface ListingPageComponentProps {
  listingAddress: EthAddress;
}

export interface ListingReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
  expiry?: number;
  userAccount?: EthAddress;
  isUserNewsroomOwner?: boolean;
  listingDataRequestStatus?: any;
  listingPhaseState?: any;
  parameters: any;
  govtParameters: any;
  constitutionURI: string;
}

const LISTING_QUERY = gql`
  query($addr: String!) {
    listing(addr: $addr) {
      name
      ownerAddresses
      whitelisted
    }
  }
`;

class ListingPageComponent extends React.Component<ListingReduxProps & DispatchProp<any> & ListingPageComponentProps> {
  public componentDidUpdate(): void {
    if (!this.props.listing && !this.props.listingDataRequestStatus) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress));
    }
  }

  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(await setupListingHistorySubscription(this.props.listingAddress));
  }

  public renderGraphQLHistory(): JSX.Element {
    return (
      <Query query={LISTING_QUERY} variables={{ addr: this.props.listingAddress }}>
        {({ loading, error, data }: any): JSX.Element => {
          if (loading) {
            return <p>Loading...</p>;
          }
          if (error) {
            return <p>Error :(</p>;
          }
          console.log("data: ", data);
          const newsroom = this.transformGraphQLDataIntoNewsroom(data);
          const listing = this.transformGraphQLDataIntoListing(data);
          return (
            <>
              <ListingHeader
                userAccount={this.props.userAccount}
                listing={listing!}
                newsroom={newsroom}
                listingPhaseState={this.props.listingPhaseState}
              />
            </>
          );
        }}
      </Query>
    );
  }

  public render(): JSX.Element {
    return this.renderGraphQLHistory();
    /*      <Query query={LISTING_QUERY} variables={{ addr: "0xD51A14a9269E6fED86E95B96B73439226B35C200" }}>
        {({ loading, error, data }: any): JSX.Element => {
          if (loading) {
            console.log("loading");
            return <p>Loading...</p>;
          }
          if (error) {
            console.log("erro: ", error);
            return <p>Error :(</p>;
          }
          const listing = this.props.listing;
          const newsroom = this.transformGraphQLDataIntoNewsroom(data);
          // const listingExistsAsNewsroom = listing && newsroom;

          // console.log("listing: ", listing);
          // console.log("newsroom: ", newsroom);
          // console.log("data: ", data);
          // return data.listing.name;
          return <></>;
          // <>
          //   {listingExistsAsNewsroom && (
          //     <>
          //       <ListingHeader
          //         userAccount={this.props.userAccount}
          //         listing={listing!}
          //         newsroom={newsroom}
          //         listingPhaseState={this.props.listingPhaseState}
          //       />
          //     </>
          //   )}
          //   <GridRow>
          //     <LeftShark>
          //       {!listingExistsAsNewsroom && this.renderListingNotFound()}

          //       <Tabs TabComponent={StyledTab}>
          //         {(listingExistsAsNewsroom && (
          //           <Tab title="About">
          //             <ListingTabContent>
          //               <ListingCharter listing={this.props.listing!} newsroom={this.props.newsroom!.wrapper} />
          //             </ListingTabContent>
          //           </Tab>
          //         )) || <></>}

          //         <Tab title="Discussions">
          //           <ListingTabContent>
          //             <ListingChallengeStatement listing={this.props.listingAddress} />

          //             <p>
          //               Use this space to discuss, ask questions, or cheer on the newsmakers. If you have questions,
          //               check out our help page.
          //             </p>
          //             <ListingDiscourse />
          //           </ListingTabContent>
          //         </Tab>

          //         <Tab title="History">
          //           <ListingTabContent>
          //             <ListingHistory listingAddress={this.props.listingAddress} />
          //           </ListingTabContent>
          //         </Tab>

          //         {(this.props.isUserNewsroomOwner &&
          //           this.props.listing && (
          //             <Tab title="Owner Actions">
          //               <ListingTabContent>
          //                 <ListingOwnerActions listing={this.props.listing} />
          //               </ListingTabContent>
          //             </Tab>
          //           )) || <></>}
          //       </Tabs>
          //     </LeftShark>

          //     <RightShark>
          //       {listingExistsAsNewsroom && (
          //         <ListingPhaseActions
          //           listing={this.props.listing!}
          //           expiry={this.props.expiry}
          //           listingPhaseState={this.props.listingPhaseState}
          //           parameters={this.props.parameters}
          //           govtParameters={this.props.govtParameters}
          //           constitutionURI={this.props.constitutionURI}
          //         />
          //       )}
          //     </RightShark>
          //   </GridRow>
          // </>
          // );
        }};
      </Query>*/
  }

  private transformGraphQLDataIntoNewsroom(queryData: any): NewsroomWrapper {
    console.log("queryData: ", queryData);
    return {
      address: this.props.listingAddress,
      data: {
        name: queryData.listing.name,
        owners: queryData.listing.ownerAddresses,
      },
    };
  }
  private transformGraphQLDataIntoListing(queryData: any): ListingWrapper {
    console.log("queryData: ", queryData);
    return {
      address: this.props.listingAddress,
      data: {
        appExpiry: new BigNumber(0),
        isWhitelisted: queryData.listing.whitelisted,
        owner: "0x0",
        unstakedDeposit: new BigNumber(0),
        challengeID: new BigNumber(0),
      },
    };
  }
  // private renderListingNotFound(): JSX.Element {
  //   return <>NOT FOUND</>;
  // }
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

export default connect(makeMapStateToProps)(ListingPageComponent);
