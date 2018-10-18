import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
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
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import * as heroImgUrl from "../images/img-hero-listings.png";

import ListingList from "./ListingList";
import { State } from "../../reducers";
import ListingsInProgress from "./ListingsInProgress";
import { StyledPageContent, StyledListingCopy } from "../utility/styledComponents";

const TABS: string[] = ["whitelisted", "under-challenge", "rejected"];

export interface ListingsContainerProps {
  match?: any;
}

export interface ListingsContainerReduxProps {
  useGraphQL: boolean;
}

class ListingsContainer extends React.Component<ListingsContainerProps & ListingsContainerReduxProps> {
  public render(): JSX.Element {
    if (this.props.useGraphQL) {
      return (
        <Query query={LISTING_QUERY} variables={{ addr: listingAddress }}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <p>Loading...</p>;
            }
            if (error) {
              return <p>Error :</p>;
            }
            const newsroom = this.transformGraphQLDataIntoNewsroom(data);
            const listing = this.transformGraphQLDataIntoListing(data);
            return <ListingRedux listingAddress={listingAddress} newsroom={newsroom} listing={listing} />;
          }}
        </Query>
      );
    } else {
      return <ListingReduxContainer listingAddress={listingAddress} />;
    }
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingsContainerProps,
): ListingsContainerProps & ListingsContainerReduxProps => {
  const { whitelistedListings, rejectedListings, parameters, loadingFinished } = state.networkDependent;
  const useGraphQL = state.useGraphQL;
  return {
    ...ownProps,
    useGraphQL,
  };
};

export default connect(mapStateToProps)(ListingsContainer);
