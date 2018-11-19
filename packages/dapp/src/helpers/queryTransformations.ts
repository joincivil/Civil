import { ListingWrapper, NewsroomWrapper, ChallengeData, AppealData, AppealChallengeData } from "@joincivil/core";
import BigNumber from "@joincivil/ethapi/node_modules/bignumber.js";
import gql from "graphql-tag";

export const LISTING_FRAGMENT = gql`
  fragment ListingFragment on Listing {
    name
    owner
    ownerAddresses
    contractAddress
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
      appeal {
        requester
        appealFeePaid
        appealPhaseExpiry
        appealGranted
        appealOpenToChallengeExpiry
        statement
        appealChallengeID
        appealChallenge {
          challengeID
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
        }
      }
    }
  }
`;

export const LISTING_QUERY = gql`
  query($addr: String!) {
    listing(addr: $addr) {
      ...ListingFragment
    }
  }
  ${LISTING_FRAGMENT}
`;

export const CHALLENGE_QUERY = gql`
  query($challengeID: Int!) {
    challenge(id: $challengeID) {
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
      appeal {
        requester
        appealFeePaid
        appealPhaseExpiry
        appealGranted
        appealOpenToChallengeExpiry
        statement
        appealChallengeID
        appealChallenge {
          challengeID
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
        }
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
  return {
    address: listingAddress,
    data: {
      appExpiry: new BigNumber(listing.appExpiry),
      isWhitelisted: listing.whitelisted,
      owner: listing.owner,
      unstakedDeposit: new BigNumber(listing.unstakedDeposit),
      challengeID: new BigNumber(listing.challengeID),
      challenge: transformGraphQLDataIntoChallenge(listing.challenge),
    },
  };
}

export function transformGraphQLDataIntoChallenge(queryChallengeData: any): ChallengeData | undefined {
  if (queryChallengeData) {
    return {
      challengeStatementURI: queryChallengeData.statement,
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
      appeal: transformGraphQLDataIntoAppeal(queryChallengeData.appeal),
    };
  } else {
    return undefined;
  }
}

export function transformGraphQLDataIntoAppeal(queryAppealData: any): AppealData | undefined {
  if (queryAppealData) {
    return {
      requester: queryAppealData.requester,
      appealFeePaid: new BigNumber(queryAppealData.appealFeePaid),
      appealPhaseExpiry: new BigNumber(queryAppealData.appealPhaseExpiry),
      appealGranted: queryAppealData.appealGranted,
      appealOpenToChallengeExpiry: new BigNumber(queryAppealData.appealOpenToChallengeExpiry),
      appealChallengeID: new BigNumber(queryAppealData.appealChallengeID),
      appealTxData: undefined,
      appealChallenge: transformGraphQLDataIntoAppealChallenge(queryAppealData.appealChallenge),
      appealStatementURI: queryAppealData.statement,
    };
  } else {
    return undefined;
  }
}

export function transformGraphQLDataIntoAppealChallenge(
  queryAppealChallengeData: any,
): AppealChallengeData | undefined {
  if (queryAppealChallengeData) {
    return {
      rewardPool: new BigNumber(queryAppealChallengeData.rewardPool),
      challenger: queryAppealChallengeData.challenger,
      resolved: queryAppealChallengeData.resolved,
      stake: new BigNumber(queryAppealChallengeData.stake),
      totalTokens: new BigNumber(queryAppealChallengeData.totalTokens),
      poll: {
        commitEndDate: new BigNumber(queryAppealChallengeData.poll.commitEndDate),
        revealEndDate: new BigNumber(queryAppealChallengeData.poll.revealEndDate),
        voteQuorum: new BigNumber(queryAppealChallengeData.poll.voteQuorum),
        votesFor: new BigNumber(queryAppealChallengeData.poll.votesFor),
        votesAgainst: new BigNumber(queryAppealChallengeData.poll.votesAgainst),
      },
      appealChallengeStatementURI: queryAppealChallengeData.statement,
    };
  } else {
    return undefined;
  }
}
