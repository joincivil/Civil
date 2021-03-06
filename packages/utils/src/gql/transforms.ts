import { pollHelpers } from "../coreHelpers";

import { Set, Map } from "immutable";
import {
  BigNumber,
  ListingWrapper,
  NewsroomWrapper,
  ChallengeData,
  EthContentHeader,
  PollData,
  AppealData,
  AppealChallengeData,
  UserChallengeData,
  ParamPropChallengeData,
} from "@joincivil/typescript-types";

export function transformGraphQLDataIntoSpecificUserChallenge(userChallenge: any): UserChallengeData {
  if (userChallenge && userChallenge.userChallengeData && userChallenge.userChallengeData.length > 0) {
    const userData = userChallenge.userChallengeData[0];
    return {
      didUserCommit: userData.userDidCommit,
      didUserReveal: userData.userDidReveal,
      didUserCollect: userData.didUserCollect,
      didUserRescue: userData.didUserRescue,
      didCollectAmount: new BigNumber(userData.didCollectAmount),
      isVoterWinner: userData.isVoterWinner,
      salt: userData.salt,
      choice: new BigNumber(userData.choice),
      numTokens: new BigNumber(userData.numTokens),
      voterReward: new BigNumber(userData.voterReward),
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
      owner: listing.owner,
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
      challengeID: new BigNumber(listing.challengeID ? listing.challengeID : 0),
      challenge: transformGraphQLDataIntoChallenge(listing.challenge),
      prevChallengeID: transformGraphQLDataIntoPrevChallengeID(listing.prevChallenge),
      prevChallenge: transformGraphQLDataIntoChallenge(listing.prevChallenge),
      approvalDate: listing.approvalDate ? new BigNumber(listing.approvalDate) : new BigNumber(0),
      lastGovState: listing.lastGovState,
      lastUpdatedDate: listing.lastUpdatedDate ? new BigNumber(listing.lastUpdatedDate) : new BigNumber(0),
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

export function transformGraphQLDataIntoParamPropChallenge(
  queryChallengeData: any,
): ParamPropChallengeData | undefined {
  if (queryChallengeData) {
    const pollData = transfromGraphQLDataIntoPoll(queryChallengeData.poll);

    return {
      rewardPool: new BigNumber(queryChallengeData.rewardPool),
      challenger: queryChallengeData.challenger,
      resolved: queryChallengeData.resolved,
      stake: new BigNumber(queryChallengeData.stake),
      totalTokens: new BigNumber(queryChallengeData.totalTokens),
      poll: pollData!,
    };
  } else {
    return undefined;
  }
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
      appealGrantedStatementURI: queryAppealData.appealGrantedStatementURI,
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

export function transformGraphQLDataIntoParamProposal(propData: any): any {
  if (propData) {
    return {
      propID: "0x" + propData.propID,
      paramName: propData.name,
      propValue: new BigNumber(propData.value),
      pollID: propData.challengeID !== "0" ? new BigNumber(propData.challengeID) : undefined,
      applicationExpiry: new BigNumber(propData.appExpiry),
    };
  } else {
    return undefined;
  }
}

function mapPollIDsForUserChallengeDataQuerySet(challengeDataQuerySet: any): number[] | undefined {
  let pollIDs;

  if (challengeDataQuerySet) {
    pollIDs = challengeDataQuerySet.map((challenge: any): number => challenge.pollID);
  }

  return pollIDs;
}

function userChallengeDataFilter(
  userChallengeData: any,
  pollType: string,
  filterAvailableActions?: boolean,
  queryChallengesToReveal?: any[],
  queryChallengesToRescue?: any[],
): boolean {
  const isChallenge = userChallengeData.pollType === pollType;
  if (!filterAvailableActions) {
    return isChallenge;
  }

  const { pollID, didUserCollect, isVoterWinner } = userChallengeData;

  const challengesToReveal = mapPollIDsForUserChallengeDataQuerySet(queryChallengesToReveal);
  const challengesToRescue = mapPollIDsForUserChallengeDataQuerySet(queryChallengesToRescue);

  // canUserCollect can be derived from just user challenge data, so we don't need to look up the pollID in the graphql response for challengesWithRewards
  const canUserCollect = isVoterWinner && !didUserCollect;
  const canUserRescue = challengesToRescue && challengesToRescue.includes(pollID);
  const canUserReveal = challengesToReveal && challengesToReveal.includes(pollID);

  return isChallenge && (!!canUserCollect || !!canUserRescue || !!canUserReveal);
}

// Includes all challenges the user has particiapted in and parent challenges for all appeal challenges the user participated in
export function transformGraphQLDataIntoDashboardChallengesSet(
  queryUserChallengeData: any[],
  filterAvailableActions?: boolean,
  queryChallengesToReveal?: any[],
  queryChallengesToRescue?: any[],
): Set<string> {
  let allChallenges = Set<string>();
  if (queryUserChallengeData) {
    const challengeIDs = queryUserChallengeData
      .filter(challengeData => {
        return userChallengeDataFilter(
          challengeData,
          "CHALLENGE",
          filterAvailableActions,
          queryChallengesToReveal,
          queryChallengesToRescue,
        );
      })
      .map(challengeData => {
        return challengeData.pollID;
      });
    const appealChallengeParentChallengeIDs = queryUserChallengeData
      .filter(challengeData => {
        return userChallengeDataFilter(
          challengeData,
          "APPEAL_CHALLENGE",
          filterAvailableActions,
          queryChallengesToReveal,
          queryChallengesToRescue,
        );
      })
      .map(challengeData => {
        return challengeData.parentChallengeID;
      });

    allChallenges = allChallenges.union(challengeIDs, appealChallengeParentChallengeIDs);
  }
  return allChallenges;
}

export function getUserChallengeDataSetByPollType(
  queryUserChallengeData: any[],
  pollType: string,
  filterAvailableActions?: boolean,
): Set<string> {
  const challengeIDs = queryUserChallengeData
    .filter(challengeData => {
      return userChallengeDataFilter(challengeData, pollType, filterAvailableActions);
    })
    .map(challengeData => {
      return challengeData.pollID;
    });
  return Set<string>(challengeIDs);
}

export enum USER_CHALLENGE_DATA_POLL_TYPES {
  CHALLENGE = "CHALLENGE",
  APPEAL_CHALLENGE = "APPEAL_CHALLENGE",
  PARAMETER_PROPOSAL_CHALLENGE = "PARAMETER_PROPOSAL_CHALLENGE",
}

export function transformGraphQLDataIntoDashboardChallengesByTypeSets(
  queryUserChallengeData: any[],
): [Set<string>, Set<string>, Set<string>] {
  const challengeIDs = getUserChallengeDataSetByPollType(
    queryUserChallengeData,
    USER_CHALLENGE_DATA_POLL_TYPES.CHALLENGE,
  );
  const appealChallengeIDs = getUserChallengeDataSetByPollType(
    queryUserChallengeData,
    USER_CHALLENGE_DATA_POLL_TYPES.APPEAL_CHALLENGE,
  );
  const proposalChallengeIDs = getUserChallengeDataSetByPollType(
    queryUserChallengeData,
    USER_CHALLENGE_DATA_POLL_TYPES.PARAMETER_PROPOSAL_CHALLENGE,
  );
  return [challengeIDs, appealChallengeIDs, proposalChallengeIDs];
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
        canUserRescue =
          !didUserReveal &&
          !didUserRescue &&
          !pollHelpers.isInCommitStage(pollData) &&
          !pollHelpers.isInRevealStage(pollData);
      }
    } else if (pollData) {
      canUserReveal = didUserCommit && !didUserReveal && pollHelpers.isInRevealStage(pollData);
    }

    const userChallengeData = {
      didUserCommit,
      didUserReveal,
      didUserCollect,
      didUserRescue,
      didCollectAmount: new BigNumber(didCollectAmount || 0),

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

export function transformGraphQLDataIntoCharterRevisions(
  queryCharterRevisionsData: any[],
): Map<number, Partial<EthContentHeader>> {
  let contentRevisions = Map<number, Partial<EthContentHeader>>();
  queryCharterRevisionsData.forEach((queryCharterRevisionData: any) => {
    const {
      editorAddress: author,
      contractContentId: contentId,
      contractRevisionId: revisionId,
      revisionUri: uri,
      revisionDate: timestamp,
    } = queryCharterRevisionData;

    const charterRevisionHeader = {
      author,
      contentId,
      revisionId,
      uri,
      timestamp,
    };

    if (uri) {
      contentRevisions = contentRevisions.set(revisionId, charterRevisionHeader);
    }
  });

  return contentRevisions;
}
