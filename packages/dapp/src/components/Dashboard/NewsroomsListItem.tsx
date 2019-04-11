import * as React from "react";
import { Query } from "react-apollo";
import { connect } from "react-redux";
import { EthAddress } from "@joincivil/core";
import { State } from "../../redux/reducers";
import {
  LISTING_QUERY,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoListing,
} from "../../helpers/queryTransformations";

import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import LoadingMsg from "../utility/LoadingMsg";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";

import NewsroomsListItemComponent from "./NewsroomsListItemComponent";

interface NewsroomListItemOwnProps {
  listingAddress: EthAddress;
}

interface NewsroomListItemReduxProps {
  useGraphQL: boolean;
}

const NewsroomsListItemGraphQL: React.FunctionComponent<NewsroomListItemOwnProps> = props => {
  const { listingAddress } = props;
  return (
    <Query query={LISTING_QUERY} variables={{ addr: listingAddress }} pollInterval={10000}>
      {({ loading, error, data }: any): JSX.Element => {
        if (loading) {
          return <LoadingMsg />;
        }
        if (error) {
          return <ErrorLoadingDataMsg />;
        }
        if (!data.listing) {
          return <ErrorNotFoundMsg>We could not find the listing you were looking for.</ErrorNotFoundMsg>;
        }
        const listing = transformGraphQLDataIntoListing(data.listing, listingAddress);
        const newsroom = transformGraphQLDataIntoNewsroom(data.listing, listingAddress);
        const charterHeader = newsroom && newsroom.data && newsroom.data.charterHeader && newsroom.data.charterHeader;
        return (
          <>
            <NewsroomsListItemComponent
              listingAddress={listingAddress}
              listing={listing}
              newsroomCharterHeader={charterHeader}
            />
          </>
        );
      }}
    </Query>
  );
};

const NewsroomListItem: React.FunctionComponent<NewsroomListItemOwnProps & NewsroomListItemReduxProps> = props => {
  const { listingAddress, useGraphQL } = props;
  if (useGraphQL) {
    return <NewsroomsListItemGraphQL listingAddress={listingAddress} />;
  }

  return <NewsroomsListItemComponent listingAddress={listingAddress} />;
};

const mapNewsroomListItemStateToProps = (
  state: State,
  ownProps: NewsroomListItemOwnProps,
): NewsroomListItemOwnProps & NewsroomListItemReduxProps => {
  const { useGraphQL } = state;
  return {
    useGraphQL,
    ...ownProps,
  };
};

export default connect(mapNewsroomListItemStateToProps)(NewsroomListItem);
