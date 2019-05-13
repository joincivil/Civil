import {
  ListingWrapper,
  NewsroomWrapper,
  ChallengeData,
  PollData,
  AppealData,
  AppealChallengeData,
  UserChallengeData,
  isInCommitStage,
  isInRevealStage,
} from "@joincivil/core";
import { Set } from "immutable";
import BigNumber from "@joincivil/ethapi/node_modules/bignumber.js";
import gql from "graphql-tag";

export const CHALLENGE_FRAGMENT = gql`
  fragment ChallengeFragment on Challenge {
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
      appealGrantedStatementURI
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
`;

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
      ...ChallengeFragment
    }
    prevChallenge {
      ...ChallengeFragment
    }
  }
  ${CHALLENGE_FRAGMENT}
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
      ...ChallengeFragment
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

export const USER_CHALLENGE_DATA_QUERY = gql`
  query($userAddr: String!, $pollID: Int!) {
    userChallengeData(userAddr: $userAddr, pollID: $pollID) {
      pollID
      pollRevealDate
      pollType
      userDidCommit
      userDidReveal
      didUserCollect
      didUserRescue
      didCollectAmount
      isVoterWinner
      pollIsPassed
      salt
      choice
      numTokens
      voterReward
      parentChallengeID
    }
  }
`;

export function transformGraphQLDataIntoSpecificUserChallenge(userChallenge: any): UserChallengeData {
  if (userChallenge && userChallenge.userChallengeData && userChallenge.userChallengeData.length > 0) {
    const userData = userChallenge.userChallengeData[0];
    return {
      didUserCommit: userData.userDidCommit,
      didUserReveal: userData.userDidReveal,
      didUserCollect: userData.didUserCollect,
      didUserRescue: userData.didUserRescue,
      didCollectAmount: userData.didCollectAmount,
      isVoterWinner: userData.isVoterWinner,
      salt: userData.salt,
      choice: userData.choice,
      numTokens: userData.numTokens,
      voterReward: userData.voterReward,
    };
  } else {
    return {};
  }
}

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
      prevChallengeID: transformGraphQLDataIntoPrevChallengeID(listing.prevChallenge),
      prevChallenge: transformGraphQLDataIntoChallenge(listing.prevChallenge),
      approvalDate: listing.approvalDate ? new BigNumber(listing.approvalDate) : new BigNumber(0),
    },
  };
}
export function transformGraphQLDataIntoPrevChallengeID(queryChallengeData: any): BigNumber | undefined {
  if (queryChallengeData) {
    return new BigNumber(queryChallengeData.challengeID);
  } else {
    return undefined;
  }
}

function transfromGraphQLDataIntoPoll(queryPollData: any): PollData | undefined {
  if (queryPollData) {
    return {
      commitEndDate: new BigNumber(queryPollData.commitEndDate),
      revealEndDate: new BigNumber(queryPollData.revealEndDate),
      voteQuorum: new BigNumber(queryPollData.voteQuorum),
      votesFor: new BigNumber(queryPollData.votesFor),
      votesAgainst: new BigNumber(queryPollData.votesAgainst),
    };
  }
  return undefined;
}

export function transformGraphQLDataIntoChallenge(queryChallengeData: any): ChallengeData | undefined {
  if (queryChallengeData) {
    const pollData = transfromGraphQLDataIntoPoll(queryChallengeData.poll);

    return {
      challengeStatementURI: queryChallengeData.statement,
      rewardPool: new BigNumber(queryChallengeData.rewardPool),
      challenger: queryChallengeData.challenger,
      resolved: queryChallengeData.resolved,
      stake: new BigNumber(queryChallengeData.stake),
      totalTokens: new BigNumber(queryChallengeData.totalTokens),
      poll: pollData!,
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
      appealChallenge: transformGraphQLDataIntoAppealChallenge(queryAppealData.appealChallenge),
      appealStatementURI: queryAppealData.statement,
      appealGrantedStatementURI: queryAppealData.appealGranted,
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

export function transformGraphQLDataIntoDashboardChallengesSet(queryUserChallengeData: any[]): Set<string> {
  let allChallenges = Set<string>();
  if (queryUserChallengeData) {
    const challengeIDs = queryUserChallengeData
      .filter(challengeData => {
        return challengeData.pollType === "CHALLENGE";
      })
      .map(challengeData => {
        return challengeData.pollID;
      });
    const appealChallengeParentChallengeIDs = queryUserChallengeData
      .filter(challengeData => {
        return challengeData.pollType === "APPEAL_CHALLENGE";
      })
      .map(challengeData => {
        return challengeData.parentChallengeID;
      });

    allChallenges = allChallenges.union(challengeIDs, appealChallengeParentChallengeIDs);
  }
  return allChallenges;
}

export function transfromGraphQLDataIntoUserChallengeData(
  queryUserChallengeData: any,
  challenge: ChallengeData,
): UserChallengeData | undefined {
  if (queryUserChallengeData) {
    const {
      userDidCommit: didUserCommit,
      userDidReveal: didUserReveal,
      didUserCollect,
      didUserRescue,
      didCollectAmount,
      isVoterWinner,
      pollIsPassed,
      salt,
      numTokens,
      choice,
      voterReward,
    } = queryUserChallengeData;

    let canUserReveal;
    let canUserCollect;
    let canUserRescue;

    const pollData = transfromGraphQLDataIntoPoll(challenge.poll);
    if (challenge.resolved) {
      canUserCollect = isVoterWinner && !didUserCollect;
      if (pollData) {
        canUserRescue = !didUserReveal && !didUserRescue && !isInCommitStage(pollData) && !isInRevealStage(pollData);
      }
    } else if (pollData) {
      canUserReveal = didUserCommit && !didUserReveal && isInRevealStage(pollData);
    }

    const userChallengeData = {
      didUserCommit,
      didUserReveal,
      didUserCollect,
      didUserRescue,
      didCollectAmount,

      canUserReveal,
      canUserCollect,
      canUserRescue,

      isVoterWinner,
      pollIsPassed,
      salt,
      numTokens: new BigNumber(numTokens),
      choice: new BigNumber(choice),
      voterReward: new BigNumber(voterReward || 0),
    };

    return userChallengeData;
  }

  return undefined;
}
