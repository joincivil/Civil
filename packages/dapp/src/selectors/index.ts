import BigNumber from "bignumber.js";
import { createSelector } from "reselect";
import { Set, Map, List } from "immutable";
import {
  canListingBeChallenged,
  EthAddress,
  canAppealBeResolved as getCanAppealBeResolved,
  canBeWhitelisted as getCanBeWhitelisted,
  canResolveChallenge as getCanResolveChallenge,
  didChallengeSucceed as getDidChallengeSucceed,
  isInApplicationPhase,
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  isAwaitingAppealRequest as getIsAwaitingAppealRequest,
  isListingAwaitingAppealJudgment as getIsListingAwaitingAppealJudgement,
  isListingAwaitingAppealChallenge as getIsListingAwaitingAppealChallenge,
  isAwaitingAppealChallenge as getIsAwaitingAppealChallenge,
  isInAppealChallengeCommitPhase as getIsInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase as getIsInAppealChallengeRevealPhase,
  canListingAppealChallengeBeResolved as getCanListingAppealChallengeBeResolved,
  isInCommitStage as isPollInCommitStage,
  isInRevealStage as isPollInRevealStage,
  isVotePassed as isPollVotePassed,
  isAppealAwaitingJudgment,
  ListingWrapper,
  UserChallengeData,
  WrappedChallengeData,
  TimestampedEvent,
  ParamPropChallengeData,
  NewsroomWrapper,
} from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { State } from "../redux/reducers";

// @TODO(jon): Export this in reducers?
import { ListingWrapperWithExpiry, ListingExtendedMetadata } from "../redux/reducers/listings";

export interface ListingContainerProps {
  listingAddress?: EthAddress;
  listing?: ListingWrapper;
  newsroom?: NewsroomWrapper;
}

export interface ChallengeContainerProps {
  challengeID?: string | BigNumber;
}

export interface AppealChallengeContainerProps {
  appealChallengeID?: string | BigNumber;
}

export interface ProposalParameterProps {
  parameterName: string;
}

// Simple selectors from State. These don't look at component props or
// return any derived props from state
export const getUser = (state: State) => state.networkDependent.user;

export const getListings = (state: State) => state.networkDependent.listings;

export const getChallenges = (state: State) => state.networkDependent.challenges;

export const getChallengeUserData = (state: State) => state.networkDependent.challengeUserData;

export const getAppealChallengeUserData = (state: State) => state.networkDependent.appealChallengeUserData;

export const getChallengesVotedOnByAllUsers = (state: State) => state.networkDependent.challengesVotedOnByUser;

export const getChallengesStartedByAllUsers = (state: State) => state.networkDependent.challengesStartedByUser;

export const getHistories = (state: State) => state.networkDependent.histories;

export const getParameters = (state: State) => state.networkDependent.parameters;

export const getParameterProposals = (state: State) => state.networkDependent.proposals;

export const getParameterProposalChallenges = (state: State) => state.networkDependent.parameterProposalChallenges;

export const getParameterProposalChallengesFetching = (state: State) =>
  state.networkDependent.parameterProposalChallengesFetching;

export const getAppellateMembers = (state: State) => state.networkDependent.appellateMembers;

// end simple selectors

// Memo-ized selectors. These selectors either return derived state and are
// memo-ized by reselect to optimize rendering and/or use props to
// return some derived data from state
export const getNewsroom = (state: State, props: ListingContainerProps): NewsroomState | undefined => {
  if (!props.listingAddress) {
    return;
  }
  return state.newsrooms.get(props.listingAddress);
};

export const getIsUserNewsroomOwner = (newsroomWrapper?: NewsroomWrapper, user?: any) => {
  if (!newsroomWrapper || !user) {
    return;
  }
  const userAccount = user.account && user.account.account;
  return newsroomWrapper.data.owners.includes(userAccount);
};

export const getIsMemberOfAppellate = createSelector([getAppellateMembers, getUser], (appellateMembers, user) => {
  if (!appellateMembers || !user) {
    return false;
  }
  return appellateMembers.includes(user.account.account);
});

export const getListingWrapper = (state: State, props: ListingContainerProps) => {
  if (!props.listingAddress) {
    return;
  }
  const listings: Map<string, ListingWrapperWithExpiry> = state.networkDependent.listings;
  const listingAddress = props.listingAddress;
  const listing: ListingWrapperWithExpiry | undefined = listings.get(listingAddress)
    ? listings.get(listingAddress)
    : undefined;
  return listing;
};

export const makeGetListing = () => {
  return createSelector([getListingWrapper], listingWrapper => {
    const listing: ListingWrapper | undefined = listingWrapper ? listingWrapper.listing : undefined;
    return listing;
  });
};

export const getListingAddress = (state: State, props: ListingContainerProps) => {
  const { listing, listingAddress } = props;
  if (!listing && !listingAddress) {
    return;
  }
  const address = listingAddress || listing!.address;
  return address;
};

export const getChallengeID = (state: State, props: ChallengeContainerProps) => {
  let { challengeID } = props;
  if (!challengeID) {
    return;
  }
  if (typeof challengeID !== "string") {
    challengeID = challengeID.toString();
  }
  return challengeID;
};

export const getChallenge = createSelector([getChallenges, getChallengeID], (challenges, challengeID) => {
  if (!challengeID) {
    return;
  }
  const challenge: WrappedChallengeData = challenges.get(challengeID);
  return challenge;
});

export const getAppealChallengeID = createSelector([getChallenge], challengeData => {
  if (!challengeData) {
    return;
  }

  const appealChallengeID =
    (challengeData &&
      challengeData.challenge &&
      challengeData.challenge.appeal &&
      challengeData.challenge.appeal.appealChallengeID) ||
    undefined;

  return appealChallengeID ? appealChallengeID.toString() : undefined;
});

export const makeGetAppealChallengeID = () => {
  return getAppealChallengeID;
};

export const getAppealChallenge = (state: State, props: AppealChallengeContainerProps) => {
  let { appealChallengeID } = props;
  if (!appealChallengeID) {
    return;
  }
  if (typeof appealChallengeID !== "string") {
    appealChallengeID = appealChallengeID.toString();
  }
  const challenges = state.networkDependent.challenges;
  const challenge: WrappedChallengeData = challenges.get(appealChallengeID);
  return challenge;
};

export const makeGetChallenge = () => {
  return getChallenge;
};

export const getChallengeUserDataMap = createSelector(
  [getChallengeUserData, getChallengeID],
  (challengeUserData, challengeID) => {
    if (!challengeID) {
      return;
    }
    const challengeUserDataMap = challengeUserData.get(challengeID);
    return challengeUserDataMap;
  },
);

export const makeGetUserChallengeData = () => {
  return createSelector([getChallengeUserDataMap, getUser], (challengeUserDataMap, user) => {
    if (!challengeUserDataMap || !user) {
      return;
    }
    const userChallengeData: UserChallengeData = challengeUserDataMap.get(user.account.account);
    return userChallengeData;
  });
};

export const getAppealChallengeUserDataMap = createSelector(
  [getAppealChallengeUserData, getAppealChallengeID],
  (challengeUserData, challengeID) => {
    if (!challengeID) {
      return;
    }
    const challengeUserDataMap = challengeUserData.get(challengeID);
    return challengeUserDataMap;
  },
);

export const makeGetUserAppealChallengeData = () => {
  return createSelector([getAppealChallengeUserDataMap, getUser], (challengeUserDataMap, user) => {
    if (!challengeUserDataMap || !user) {
      return;
    }
    const userChallengeData: UserChallengeData = challengeUserDataMap.get(user.account.account);
    return userChallengeData;
  });
};

export const getUserChallengesWithUnclaimedRewards = createSelector(
  [getChallengeUserData, getUser],
  (challengeUserData, user) => {
    if (!challengeUserData || !user) {
      return;
    }
    return challengeUserData
      .filter((challengeData, challengeID, iter): boolean => {
        try {
          const { didUserReveal, didUserCollect, isVoterWinner } = challengeData!.get(user.account.account);
          return !!didUserReveal && !!isVoterWinner && !didUserCollect;
        } catch (ex) {
          return false;
        }
      })
      .keySeq()
      .toSet() as Set<string>;
  },
);

export const getUserAppealChallengesWithUnclaimedRewards = createSelector(
  [getAppealChallengeUserData, getUser],
  (appealChallengeUserData, user) => {
    if (!appealChallengeUserData || !user) {
      return;
    }
    return appealChallengeUserData
      .filter((challengeData, challengeID, iter): boolean => {
        try {
          const { didUserReveal, didUserCollect, isVoterWinner } = challengeData!.get(user.account.account);
          return !!didUserReveal && !!isVoterWinner && !didUserCollect;
        } catch (ex) {
          return false;
        }
      })
      .keySeq()
      .toSet() as Set<string>;
  },
);

export const makeGetUnclaimedRewardAmount = () => {
  return createSelector(
    [getChallengeUserDataMap, getChallenges, getUser, getChallengeID],
    (challengeUserDataMap, challenges, user, challengeID) => {
      if (!challengeUserDataMap || !user || !challenges || !challengeID) {
        return;
      }
      const userChallengeData: UserChallengeData = challengeUserDataMap.get(user.account.account);
      const challenge = challenges.get(challengeID);
      if (!userChallengeData || !userChallengeData.numTokens || !challenge) {
        return;
      }
      const challengeData = challenge.challenge;
      let totalWinningVotes;
      if (getDidChallengeSucceed(challengeData)) {
        totalWinningVotes = challenge.challenge.poll.votesAgainst;
      } else {
        totalWinningVotes = challenge.challenge.poll.votesFor;
      }
      const userPercentOfWinningVotes = userChallengeData.numTokens.div(totalWinningVotes);
      const unclaimedRewardAmount = challenge.challenge.rewardPool.mul(userPercentOfWinningVotes);
      return unclaimedRewardAmount;
    },
  );
};

export const getUserChallengesWithUnrevealedVotes = createSelector(
  [getChallenges, getChallengeUserData, getUser],
  (challenges, challengeUserData, user) => {
    if (!challengeUserData || !user || !user.account) {
      return;
    }
    return challengeUserData
      .filter((challengeData, challengeID, iter): boolean => {
        try {
          const { didUserCommit, didUserReveal } = challengeData!.get(user.account.account);
          const challenge = challenges.get(challengeID!);
          const inRevealPhase = challenge && isChallengeInRevealStage(challenge.challenge);
          return !!didUserCommit && !didUserReveal && inRevealPhase;
        } catch (ex) {
          return false;
        }
      })
      .keySeq()
      .toSet() as Set<string>;
  },
);

export const getUserChallengesWithRescueTokens = createSelector(
  [getChallenges, getChallengeUserData, getUser],
  (challenges, challengeUserData, user) => {
    if (!challengeUserData || !user || !user.account) {
      return;
    }
    return challengeUserData
      .filter((challengeData, challengeID, iter): boolean => {
        try {
          const { didUserCommit, didUserReveal, didUserRescue } = challengeData!.get(user.account.account);
          const challenge = challenges.get(challengeID!);
          const canRescue =
            challenge &&
            !isChallengeInCommitStage(challenge.challenge) &&
            !isChallengeInRevealStage(challenge.challenge);
          return !!didUserCommit && !didUserReveal && canRescue && !didUserRescue;
        } catch (ex) {
          return false;
        }
      })
      .keySeq()
      .toSet() as Set<string>;
  },
);

export const getUserAppealChallengesWithRescueTokens = createSelector(
  [getAppealChallengeUserData, getUser],
  (challengeUserData, user) => {
    if (!challengeUserData || !user || !user.account) {
      return;
    }
    console.log("appealChallengeUserData: ", challengeUserData);
    return challengeUserData
      .filter((challengeData, challengeID, iter): boolean => {
        try {
          const { didUserCommit, didUserReveal, didUserRescue, canUserRescue } = challengeData!.get(
            user.account.account,
          );
          console.log("didUserCommit: ", didUserCommit);
          console.log("didUserReveal: ", didUserReveal);
          console.log("didUserRescue: ", didUserRescue);
          console.log("canUserRescue: ", canUserRescue);
          return !!didUserCommit && !didUserReveal && canUserRescue! && !didUserRescue;
        } catch (ex) {
          return false;
        }
      })
      .keySeq()
      .toSet() as Set<string>;
  },
);

export const getUserTotalClaimedRewards = createSelector([getChallengeUserData, getUser], (challengeUserData, user) => {
  const initTotal = new BigNumber(0);
  if (!challengeUserData || !user || !user.account) {
    return initTotal;
  }
  return challengeUserData
    .filter((challengeData, challengeID, iter): boolean => {
      try {
        const { didUserCollect, didCollectAmount } = challengeData!.get(user.account.account);
        return !!didUserCollect && !!didCollectAmount;
      } catch (ex) {
        return false;
      }
    })
    .map((challengeData, challengeID, iter): BigNumber => challengeData!.get(user.account.account).didCollectAmount!)
    .reduce((reduction, value, key, iter) => {
      return (reduction as BigNumber).add(value!);
    }, initTotal);
});

export const getChallengesVotedOnByUser = createSelector(
  [getChallengesVotedOnByAllUsers, getUser],
  (challengesVotedOnByUser, user) => {
    let currentUserChallengesVotedOn = Set<string>();
    if (user.account && challengesVotedOnByUser.has(user.account.account)) {
      currentUserChallengesVotedOn = challengesVotedOnByUser.get(user.account.account);
    }
    return currentUserChallengesVotedOn;
  },
);

export const getChallengesStartedByUser = createSelector(
  [getChallengesStartedByAllUsers, getUser],
  (challengesStartedByUser, user) => {
    let currentUserChallengesStarted = Set<string>();
    if (user.account && challengesStartedByUser.has(user.account.account)) {
      currentUserChallengesStarted = challengesStartedByUser.get(user.account.account);
    }
    return currentUserChallengesStarted;
  },
);

export const getChallengesWonByUser = createSelector(
  [getChallenges, getChallengesStartedByAllUsers, getUser],
  (challenges, challengesStartedByUser, user) => {
    let currentUserChallengesWon = Set<string>();
    if (user.account && challengesStartedByUser.has(user.account.account)) {
      const currentUserChallengesStarted = challengesStartedByUser.get(user.account.account);
      currentUserChallengesWon = currentUserChallengesStarted
        .filter((challengeID, index, iter): boolean => {
          const challenge = challenges.get(challengeID!);
          const challengeData = challenge.challenge;
          return getDidChallengeSucceed(challengeData);
        })
        .toSet() as Set<string>;
    }
    return currentUserChallengesWon;
  },
);

export const getChallengesWonTotalCvl = createSelector(
  [getChallengesWonByUser, getChallenges, getParameters],
  (challengesWonByUser, challenges, parameters) => {
    const bnZero = new BigNumber(0);
    return challengesWonByUser
      .map((challengeID, index, iter): BigNumber => {
        const challenge = challenges.get(challengeID!);
        if (!challenge) {
          return bnZero;
        }
        const numToBN = (num: number) => {
          return new BigNumber(num.toString(10), 10);
        };
        const dispensationPct = numToBN((parameters as any).dispensationPct).div(numToBN(100));
        return challenge.challenge.stake.times(dispensationPct);
      })
      .reduce((reduction, value, key, iter) => {
        return (reduction as BigNumber).add(value!);
      }, bnZero);
  },
);

export const getChallengeByListingAddress = createSelector(
  [getChallenges, getListings, getListingAddress],
  (challenges, listings, listingAddress) => {
    if (!challenges || !listings || !listingAddress) {
      return;
    }
    const listing = listings.get(listingAddress);
    if (!listing) {
      return;
    }

    const challengeID = listing!.listing.data.challengeID;
    if (!challengeID || challengeID.isZero()) {
      return;
    }

    return challenges.get(challengeID.toString());
  },
);

export const makeGetListingAddressByChallengeID = () => {
  return createSelector([getChallenge, getListings], (challenge, listings) => {
    let listingAddress;

    if (challenge) {
      listingAddress = challenge.listingAddress;
    }

    return listingAddress;
  });
};

export const makeGetListingExpiry = () => {
  return createSelector([getListingWrapper], listingWrapper => {
    return listingWrapper ? listingWrapper.expiry : undefined;
  });
};

export const getChallengeState = (challengeData: WrappedChallengeData) => {
  const challenge = challengeData && challengeData.challenge;
  const isResolved = challenge && challenge.resolved;
  const inCommitPhase = challenge && isChallengeInCommitStage(challenge);
  const inRevealPhase = challenge && isChallengeInRevealStage(challenge);
  const canResolveChallenge = challenge && getCanResolveChallenge(challenge);
  const isAwaitingAppealJudgement = challenge && challenge.appeal && isAppealAwaitingJudgment(challenge.appeal);
  const canAppealBeResolved = challenge && challenge.appeal && getCanAppealBeResolved(challenge.appeal);
  const isAwaitingAppealChallenge = challenge && challenge.appeal && getIsAwaitingAppealChallenge(challenge.appeal);
  const didChallengeSucceed = challenge && getDidChallengeSucceed(challenge);

  return {
    isResolved,
    inCommitPhase,
    inRevealPhase,
    canResolveChallenge,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    canAppealBeResolved,
    didChallengeSucceed,
  };
};

export const makeGetAppealChallengeState = () => {
  return createSelector([getAppealChallenge], challengeData => {
    const challenge = challengeData && challengeData.challenge;
    const isResolved = challenge && challenge.resolved;
    const inCommitPhase = challenge && isChallengeInCommitStage(challenge);
    const inRevealPhase = challenge && isChallengeInRevealStage(challenge);
    const canResolveChallenge = challenge && getCanResolveChallenge(challenge);
    const isAwaitingAppealJudgement = challenge && challenge.appeal && isAppealAwaitingJudgment(challenge.appeal);
    const canAppealBeResolved = challenge && challenge.appeal && getCanAppealBeResolved(challenge.appeal);
    const isAwaitingAppealChallenge = challenge && challenge.appeal && getIsAwaitingAppealChallenge(challenge.appeal);
    const didChallengeSucceed = challenge && getDidChallengeSucceed(challenge);

    return {
      isResolved,
      inCommitPhase,
      inRevealPhase,
      canResolveChallenge,
      isAwaitingAppealJudgement,
      isAwaitingAppealChallenge,
      canAppealBeResolved,
      didChallengeSucceed,
    };
  });
};

export const makeGetParameterProposalChallengeState = () => {
  return createSelector(
    [getParameterProposalChallenges, getChallengeID],
    (parameterProposalChallenges, challengeID) => {
      const challenge = parameterProposalChallenges.get(challengeID!);
      const isResolved = challenge && challenge.resolved;
      const inCommitPhase = challenge && isPollInCommitStage(challenge.poll);
      const inRevealPhase = challenge && isPollInRevealStage(challenge.poll);
      const didChallengeSucceed = challenge && isPollVotePassed(challenge.poll);

      return {
        isResolved,
        inCommitPhase,
        inRevealPhase,
        didChallengeSucceed,
      };
    },
  );
};

export const getListingPhaseState = (listing?: ListingWrapper) => {
  if (!listing) {
    return;
  }
  const listingData = listing.data;
  const challenge = listingData.challenge;
  const appeal = challenge && challenge.appeal;

  const isInApplication = isInApplicationPhase(listingData);
  const canBeChallenged = canListingBeChallenged(listingData);
  const canBeWhitelisted = getCanBeWhitelisted(listingData);

  const inChallengeCommitVotePhase = challenge && isChallengeInCommitStage(challenge);
  const inChallengeRevealPhase = challenge && isChallengeInRevealStage(challenge);
  const isAwaitingAppealRequest = getIsAwaitingAppealRequest(listingData);
  const canResolveChallenge = challenge && getCanResolveChallenge(challenge);
  const didListingChallengeSucceed = challenge && getDidChallengeSucceed(challenge);

  const isAwaitingAppealJudgement = getIsListingAwaitingAppealJudgement(listingData);
  const canListingAppealBeResolved = appeal && getCanAppealBeResolved(appeal);

  const isAwaitingAppealChallenge = getIsListingAwaitingAppealChallenge(listingData);
  const isInAppealChallengeCommitPhase = getIsInAppealChallengeCommitPhase(listingData);
  const isInAppealChallengeRevealPhase = getIsInAppealChallengeRevealPhase(listingData);
  const canListingAppealChallengeBeResolved = getCanListingAppealChallengeBeResolved(listingData);

  const isUnderChallenge = listingData.challenge && !listingData.challenge.resolved;
  const isWhitelisted = listingData.isWhitelisted;
  const isRejected = !isWhitelisted && !isInApplication && !canBeWhitelisted && !listingData.challenge;

  const state = {
    isInApplication,
    canBeChallenged,
    canBeWhitelisted,
    canResolveChallenge,
    inChallengeCommitVotePhase,
    inChallengeRevealPhase,
    isAwaitingAppealRequest,
    isWhitelisted,
    isUnderChallenge,
    isRejected,
    didListingChallengeSucceed,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    canListingAppealBeResolved,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
    canListingAppealChallengeBeResolved,
  };
  return state;
};

export const getListingHistory = (state: State, props: ListingContainerProps) => {
  const listingHistory: List<TimestampedEvent<any>> | undefined = state.networkDependent.histories.get(
    props.listingAddress!,
  );
  return listingHistory || List();
};

export const getListingExtendedMetadata = (state: State, props: ListingContainerProps) => {
  const listingExtendedMetadata:
    | ListingExtendedMetadata
    | undefined = state.networkDependent.listingsExtendedMetadata.get(props.listingAddress!);
  return listingExtendedMetadata;
};

export const makeGetLatestChallengeSucceededChallengeID = () => {
  return createSelector([getListingExtendedMetadata], listingExtendedMetadata => {
    if (listingExtendedMetadata && listingExtendedMetadata.latestChallengeID) {
      const { latestChallengeID } = listingExtendedMetadata;
      return latestChallengeID;
    }
    return;
  });
};

export const makeGetLatestListingRemovedTimestamp = () => {
  return createSelector([getListingExtendedMetadata], listingExtendedMetadata => {
    if (listingExtendedMetadata && listingExtendedMetadata.listingRemovedTimestamp) {
      const { listingRemovedTimestamp } = listingExtendedMetadata;
      return listingRemovedTimestamp;
    }
    return;
  });
};

export const makeGetLatestWhitelistedTimestamp = () => {
  return createSelector([getListingExtendedMetadata], listingExtendedMetadata => {
    if (listingExtendedMetadata && listingExtendedMetadata.whitelistedTimestamp) {
      const { whitelistedTimestamp } = listingExtendedMetadata;
      return whitelistedTimestamp;
    }
    return;
  });
};

export const getProposalParameterName = (state: State, props: ProposalParameterProps) => {
  const { parameterName } = props;
  return parameterName;
};

export const makeGetProposalsByParameterName = () => {
  return createSelector(
    [getParameterProposals, getProposalParameterName],
    (parameterProposals: Map<string, any>, parameterName) => {
      const proposalsForParameterName = parameterProposals
        .filter((proposal, proposalID, iter): boolean => {
          const { paramName: proposalParamName } = proposal;
          return proposalParamName === parameterName;
        })
        .toSet() as Set<any>;
      return proposalsForParameterName;
    },
  );
};

export const makeGetParameterProposalChallenge = () => {
  return createSelector([getParameterProposalChallenges, getChallengeID], (challenges, challengeID) => {
    if (!challengeID) {
      return;
    }
    const challenge: ParamPropChallengeData = challenges.get(challengeID);
    return challenge;
  });
};

export const makeGetParameterProposalChallengeRequestStatus = () => {
  return createSelector([getParameterProposalChallengesFetching, getChallengeID], (challengesFetching, challengeID) => {
    if (!challengeID) {
      return;
    }
    const requestStatus: any = challengesFetching.get(challengeID);
    return requestStatus;
  });
};
// end memoized selectors
