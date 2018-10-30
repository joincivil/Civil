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
      lastGovState
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

export function transformGraphQLDataIntoNewsroom(listing: any, listingAddress: string): NewsroomWrapper {
  return {
    address: listingAddress,
    data: {
      name: listing.name,
      owners: listing.ownerAddresses,
      charterHeader: {
        contentId: listing.charter.contentID,
        revisionId: listing.charter.revisionID,
        timestamp: new Date(listing.charter.timestamp),
        uri: listing.charter.uri,
        contentHash: listing.charter.contentHash,
        author: listing.charter.author,
        signature: listing.charter.signature,
        verifySignature: () => true,
      },
    },
  };
}
export function transformGraphQLDataIntoListing(listing: any, listingAddress: string): ListingWrapper {
  console.log("listing.challengeID: ", listing.challengeID);
  const id = listing.challengeID;
  console.log("ID == -1: ", id === -1);
  return {
    address: listingAddress,
    data: {
      appExpiry: new BigNumber(listing.appExpiry),
      isWhitelisted: listing.whitelisted,
      owner: listing.owner,
      unstakedDeposit: new BigNumber(listing.unstakedDeposit),
      challengeID: id === -1 ? new BigNumber(0) : new BigNumber(listing.challengeID),
      challenge: transformGraphQLDataIntoChallenge(listing.challenge),
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
