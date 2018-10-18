import { ListingWrapper, NewsroomWrapper, ChallengeData } from "@joincivil/core";
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
      approvalDate
      challengeID
      challenge {
        challengeID
        listingAddress
        statement
        rewardPool
        challenger
        resolved
        stake
        totalTokens
        poll {
          commitEndDate
          revealEndDate
          voteQuorum
          votesFor
          votesAgainst
        }
        requestAppealExpiry
        lastUpdatedDateTs
      }
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
  return {
    address: listingAddress,
    data: {
      appExpiry: new BigNumber(queryData.listing.appExpiry),
      isWhitelisted: queryData.listing.whitelisted,
      owner: queryData.listing.owner,
      unstakedDeposit: new BigNumber(queryData.listing.unstakedDeposit),
      challengeID: new BigNumber(queryData.listing.challengeID),
      challenge: transformGraphQLDataIntoChallenge(queryData.listing.challenge),
    },
  };
}

export function transformGraphQLDataIntoChallenge(queryChallengeData: any): ChallengeData | undefined {
  console.log("transform. queryChallengeData: ", queryChallengeData);
  if (queryChallengeData) {
    return {
      statement: queryChallengeData.statement,
      rewardPool: new BigNumber(queryChallengeData.rewardPool),
      challenger: queryChallengeData.challenger,
      resolved: queryChallengeData.resolved,
      stake: new BigNumber(queryChallengeData.stake),
      totalTokens: new BigNumber(queryChallengeData.totalTokens),
      poll: {
        commitEndDate: new BigNumber(queryChallengeData.poll.commitEndDate),
        revealEndDate: new BigNumber(queryChallengeData.poll.revealEndDate),
        voteQuorum: new BigNumber(queryChallengeData.poll.voteQuorum),
        votesFor: new BigNumber(queryChallengeData.poll.votesFor),
        votesAgainst: new BigNumber(queryChallengeData.poll.votesAgainst),
      },
      requestAppealExpiry: new BigNumber(queryChallengeData.requestAppealExpiry),
    };
  } else {
    return undefined;
  }
}
