import * as React from "react";
import { transformGraphQLDataIntoNewsroom, transformGraphQLDataIntoListing } from "../../helpers/queryTransformations";

import NewsroomsListItemComponent from "./NewsroomsListItemComponent";

interface NewsroomListItemOwnProps {
  listing: any;
}

const NewsroomsListItemGraphQL: React.FunctionComponent<NewsroomListItemOwnProps> = props => {
  const { listing } = props;

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
  const { listing } = props;
  return <NewsroomsListItemGraphQL listing={listing} />;
};

export default NewsroomListItem;
