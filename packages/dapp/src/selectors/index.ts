import {
  BigNumber,
  EthAddress,
  ListingWrapper,
  WrappedChallengeData,
  AppealChallengeData,
  NewsroomWrapper,
} from "@joincivil/typescript-types";
import { createSelector } from "reselect";
import { Set, Map } from "immutable";
import { listingHelpers, challengeHelpers, appealHelpers, appealChallengeHelpers } from "@joincivil/utils";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { State } from "../redux/reducers";

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

export interface ProposalContainerProps {
  propID?: string | BigNumber;
}

// Simple selectors from State. These don't look at component props or
// return any derived props from state
export const getUser = (state: State) => state.networkDependent.user;

export const getGovtParameterProposals = (state: State) => state.networkDependent.govtProposals;

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

export const getIsMemberOfAppellate = createSelector(
  [getAppellateMembers, getUser],
  (appellateMembers, user) => {
    if (!appellateMembers || !user) {
      return false;
    }
    return appellateMembers.includes(user.account.account);
  },
);

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

export const getAppealChallengeIDProp = (state: State, props: AppealChallengeContainerProps) => {
  let { appealChallengeID } = props;
  if (!appealChallengeID) {
    return;
  }
  if (typeof appealChallengeID !== "string") {
    appealChallengeID = appealChallengeID.toString();
  }
  return appealChallengeID;
};

export const getProposalIDProp = (state: State, props: ProposalContainerProps) => {
  let { propID } = props;
  if (!propID) {
    return;
  }
  if (typeof propID !== "string") {
    propID = propID.toString();
  }
  return propID;
};

export const getChallengeState = (challengeData: WrappedChallengeData) => {
  const challenge = challengeData && challengeData.challenge;
  const isResolved = challenge && challenge.resolved;
  const inCommitPhase = challenge && challengeHelpers.isChallengeInCommitStage(challenge);
  const inRevealPhase = challenge && challengeHelpers.isChallengeInRevealStage(challenge);
  const canResolveChallenge = challenge && challengeHelpers.canResolveChallenge(challenge);
  const canRequestAppeal = challenge && challengeHelpers.canRequestAppeal(challenge);
  const doesChallengeHaveAppeal = challenge && challengeHelpers.doesChallengeHaveAppeal(challenge);
  const isAwaitingAppealJudgement =
    challenge && challenge.appeal && appealHelpers.isAppealAwaitingJudgment(challenge.appeal);
  const canAppealBeResolved = challenge && challenge.appeal && appealHelpers.canAppealBeResolved(challenge.appeal);
  const isAwaitingAppealChallenge =
    challenge && challenge.appeal && appealHelpers.isAwaitingAppealChallenge(challenge.appeal);
  const didChallengeSucceed = challenge && challengeHelpers.didChallengeSucceed(challenge);
  const didChallengeOriginallySucceed = challenge && challengeHelpers.didChallengeOriginallySucceed(challenge);

  const appealChallenge = challenge && challenge.appeal && challenge.appeal.appealChallenge;

  const isAppealChallengeInCommitStage =
    appealChallenge && appealChallengeHelpers.isAppealChallengeInCommitStage(appealChallenge);
  const isAppealChallengeInRevealStage =
    appealChallenge && appealChallengeHelpers.isAppealChallengeInRevealStage(appealChallenge);

  return {
    isResolved,
    inCommitPhase,
    inRevealPhase,
    canRequestAppeal,
    canResolveChallenge,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    canAppealBeResolved,
    didChallengeSucceed,
    didChallengeOriginallySucceed,
    doesChallengeHaveAppeal,
    isAppealChallengeInCommitStage,
    isAppealChallengeInRevealStage,
  };
};

export const getAppealChallengeState = (challengeData: AppealChallengeData) => {
  const challenge = challengeData;
  const isResolved = challenge && challenge.resolved;
  const inCommitPhase = challenge && appealChallengeHelpers.isAppealChallengeInCommitStage(challenge);
  const inRevealPhase = challenge && appealChallengeHelpers.isAppealChallengeInRevealStage(challenge);
  const canResolveChallenge = challenge && appealChallengeHelpers.canAppealChallengeBeResolved(challenge);
  const didChallengeSucceed = challenge && appealChallengeHelpers.didAppealChallengeSucceed(challenge);

  return {
    isResolved,
    inCommitPhase,
    inRevealPhase,
    canResolveChallenge,
    didAppealChallengeSucceed: didChallengeSucceed,
  };
};

export const getListingPhaseState = (listing?: ListingWrapper) => {
  if (!listing) {
    return;
  }
  const listingData = listing.data;
  const challenge = listingData.challenge;
  const appeal = challenge && challenge.appeal;

  const isInApplication = listingHelpers.isInApplicationPhase(listingData);
  const canBeChallenged = listingHelpers.canListingBeChallenged(listingData);
  const canBeWhitelisted = listingHelpers.canBeWhitelisted(listingData);

  const inChallengeCommitVotePhase = challenge && challengeHelpers.isChallengeInCommitStage(challenge);
  const inChallengeRevealPhase = challenge && challengeHelpers.isChallengeInRevealStage(challenge);
  const isAwaitingAppealRequest = listingHelpers.isAwaitingAppealRequest(listingData);
  const canResolveChallenge = challenge && challengeHelpers.canResolveChallenge(challenge);
  const didChallengeSucceed = challenge && challengeHelpers.didChallengeSucceed(challenge);
  const didChallengeOriginallySucceed = challenge && challengeHelpers.didChallengeOriginallySucceed(challenge);

  const doesChallengeHaveAppeal = challenge && challengeHelpers.doesChallengeHaveAppeal(challenge);
  const isAwaitingAppealJudgement = listingHelpers.isListingAwaitingAppealJudgment(listingData);
  const canListingAppealBeResolved = appeal && appealHelpers.canAppealBeResolved(appeal);

  const isAwaitingAppealChallenge = listingHelpers.isListingAwaitingAppealChallenge(listingData);
  const isInAppealChallengeCommitPhase = listingHelpers.isInAppealChallengeCommitPhase(listingData);
  const isInAppealChallengeRevealPhase = listingHelpers.isInAppealChallengeRevealPhase(listingData);
  const canListingAppealChallengeBeResolved = listingHelpers.canListingAppealChallengeBeResolved(listingData);

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
    didChallengeSucceed,
    didChallengeOriginallySucceed,
    doesChallengeHaveAppeal,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    canListingAppealBeResolved,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
    canListingAppealChallengeBeResolved,
  };
  return state;
};

export const getProposalParameterName = (state: State, props: ProposalParameterProps) => {
  const { parameterName } = props;
  return parameterName;
};

export const makeGetGovtProposalsByParameterName = () => {
  return createSelector(
    [getGovtParameterProposals, getProposalParameterName],
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

// end memoized selectors
