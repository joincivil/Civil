import * as React from "react";
import { Query } from "react-apollo";
import { formatRoute } from "react-router-named-routes";
import { EthAddress } from "@joincivil/core";
import { NoNewsrooms, LoadingMessage } from "@joincivil/components";
import { routes } from "../../constants";
import {
  LISTING_QUERY,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoListing,
} from "../../helpers/queryTransformations";

import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";

import NewsroomsListItemComponent from "./NewsroomsListItemComponent";

interface ApplicationProgressData {
  newsroomAddress: EthAddress;
  tcrApplyTx?: string;
  grantRequested?: boolean;
  grantGranted?: boolean;
}

interface NewsroomListItemOwnProps {
  listingAddress: EthAddress;
  applicationProgressData?: ApplicationProgressData;
}

const NewsroomsListItemGraphQL: React.FunctionComponent<NewsroomListItemOwnProps> = props => {
  const { listingAddress, applicationProgressData } = props;
  return (
    <Query query={LISTING_QUERY} variables={{ addr: listingAddress }} pollInterval={10000}>
      {({ loading, error, data }: any): JSX.Element => {
        if (loading) {
          return <LoadingMessage />;
        }
        if (error) {
          console.error("Error querying listing", error);
          return <ErrorLoadingDataMsg />;
        }
        if (!data.listing) {
          if (applicationProgressData) {
            const { tcrApplyTx } = applicationProgressData;
            if (!tcrApplyTx || !tcrApplyTx.length) {
              return (
                <NoNewsrooms
                  hasInProgressApplication={true}
                  applyToRegistryURL={formatRoute(routes.APPLY_TO_REGISTRY)}
                />
              );
            }
          }
          console.error("Error querying listing: no listing returned");
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

const NewsroomListItem: React.FunctionComponent<NewsroomListItemOwnProps> = props => {
  const { listingAddress, applicationProgressData } = props;
  return <NewsroomsListItemGraphQL listingAddress={listingAddress} applicationProgressData={applicationProgressData} />;
};

export default NewsroomListItem;
