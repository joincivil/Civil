import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import BigNumber from "@joincivil/ethapi/node_modules/bignumber.js";
import gql from "graphql-tag";

export const LISTING_QUERY = gql`
  query($addr: String!) {
    listing(addr: $addr) {
      name
      owner
      ownerAddresses
      whitelisted
      charterUri
      unstakedDeposit
      appExpiry
      challengeID
    }
  }
`;

export function transformGraphQLDataIntoNewsroom(queryData: any, listingAddress: string): NewsroomWrapper {
  return {
    address: listingAddress,
    data: {
      name: queryData.listing.name,
      owners: queryData.listing.ownerAddresses,
      charterHeader: {
        contentId: 0,
        revisionId: 0,
        timestamp: new Date(),
        uri: queryData.listing.charterUri,
        contentHash: "asdf",
        author: "jejejej",
        signature: "asdf",
        verifySignature: () => true,
      },
    },
  };
}
export function transformGraphQLDataIntoListing(queryData: any, listingAddress: string): ListingWrapper {
  const date = Math.round(new Date(queryData.listing.appExpiry).getTime() / 1000);

  return {
    address: listingAddress,
    data: {
      appExpiry: new BigNumber(date),
      isWhitelisted: queryData.listing.whitelisted,
      owner: queryData.listing.owner,
      unstakedDeposit: new BigNumber(queryData.listing.unstakedDeposit),
      challengeID: new BigNumber(queryData.listing.challengeID),
    },
  };
}
