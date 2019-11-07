import * as React from "react";
import { formatRoute } from "react-router-named-routes";
import { EthAddress } from "@joincivil/core";
import { NoNewsrooms } from "@joincivil/components";
import { routes } from "../../constants";
import {
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoListing,
} from "../../helpers/queryTransformations";

import ErrorNotFoundMsg from "../utility/ErrorNotFound";

import NewsroomsListItemComponent from "./NewsroomsListItemComponent";

interface ApplicationProgressData {
  newsroomAddress: EthAddress;
  tcrApplyTx?: string;
  grantRequested?: boolean;
  grantGranted?: boolean;
}

interface NewsroomListItemOwnProps {
  listing: any;
  applicationProgressData?: ApplicationProgressData;
}

const NewsroomsListItemGraphQL: React.FunctionComponent<NewsroomListItemOwnProps> = props => {
  const { listing, applicationProgressData } = props;

  if (!listing) {
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

  const listingData = transformGraphQLDataIntoListing(listing, listing.contractAddress);
  const newsroom = transformGraphQLDataIntoNewsroom(listing, listing.contractAddress);
  const charterHeader = newsroom && newsroom.data && newsroom.data.charterHeader && newsroom.data.charterHeader;
  return (
    <>
      <NewsroomsListItemComponent
        listingAddress={listing.contractAddress}
        listing={listingData}
        newsroom={newsroom}
        newsroomCharterHeader={charterHeader}
      />
    </>
  );

};

const NewsroomListItem: React.FunctionComponent<NewsroomListItemOwnProps> = props => {
  const { listing, applicationProgressData } = props;
  return <NewsroomsListItemGraphQL listing={listing} applicationProgressData={applicationProgressData} />;
};

export default NewsroomListItem;
