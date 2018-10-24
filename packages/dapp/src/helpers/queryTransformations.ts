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
      charter {
        uri
        contentID
        revisionID
        signature
        author
        contentHash
        timestamp
      }
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
        contentId: queryData.listing.charter.contentID,
        revisionId: queryData.listing.charter.revisionID,
        timestamp: new Date(queryData.listing.charter.timestamp),
        uri: queryData.listing.charter.uri,
        contentHash: queryData.listing.charter.contentHash,
        author: queryData.listing.charter.author,
        signature: queryData.listing.charter.signature,
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
      appeal: {
        requester: "0x0",
        appealFeePaid: new BigNumber(0),
        appealPhaseExpiry: new BigNumber(0),
        appealGranted: false,
        appealOpenToChallengeExpiry: new BigNumber(0),
        appealChallengeID: new BigNumber(0),
        appealTxData: undefined,
        appealChallenge: undefined,
        statement: undefined,
      },
    };
  } else {
    return undefined;
  }
}
