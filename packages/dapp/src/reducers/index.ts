import { combineReducers, AnyAction } from "redux";
import {
  listings,
  listingsFetching,
  histories,
  applications,
  whitelistedListings,
  readyToWhitelistListings,
  inChallengeCommitListings,
  inChallengeRevealListings,
  awaitingAppealRequestListings,
  awaitingAppealJudgmentListings,
  awaitingAppealChallengeListings,
  appealChallengeCommitPhaseListings,
  appealChallengeRevealPhaseListings,
  resolveChallengeListings,
  resolveAppealListings,
  rejectedListings,
  ListingWrapperWithExpiry,
  listingHistorySubscriptions,
} from "./listings";
import {
  parameters,
  proposals,
  proposalApplications,
  challengedCommitProposals,
  challengedRevealProposals,
  updateableProposals,
  resolvableChallengedProposals,
} from "./parameterizer";
import {
  appealChallengeUserData,
  challenges,
  challengesFetching,
  challengesVotedOnByUser,
  challengesStartedByUser,
  challengeUserData,
} from "./challenges";
import { government, govtParameters } from "./government";
import { user } from "./userAccount";
import { network } from "./network";
import { ui } from "./ui";
import { Set, List, Map } from "immutable";
import { TimestampedEvent, WrappedChallengeData, UserChallengeData, EthAddress } from "@joincivil/core";
import { currentUserNewsrooms } from "./newsrooms";
import { newsrooms, NewsroomState, newsroomUi, newsroomUsers } from "@joincivil/newsroom-manager";
import { networkActions } from "../actionCreators/network";
import { Subscription } from "rxjs";

export interface State {
  networkDependent: NetworkDependentState;
  network: string;
  ui: Map<string, any>;
  newsrooms: Map<string, NewsroomState>;
  newsroomUi: Map<string, any>;
  newsroomUsers: Map<EthAddress, string>;
}

export interface NetworkDependentState {
  currentUserNewsrooms: Set<string>;
  listings: Map<string, ListingWrapperWithExpiry>;
  listingsFetching: Map<string, any>;
  histories: Map<string, List<TimestampedEvent<any>>>;
  applications: Set<string>;
  whitelistedListings: Set<string>;
  readyToWhitelistListings: Set<string>;
  inChallengeCommitListings: Set<string>;
  inChallengeRevealListings: Set<string>;
  awaitingAppealRequestListings: Set<string>;
  awaitingAppealJudgmentListings: Set<string>;
  awaitingAppealChallengeListings: Set<string>;
  appealChallengeCommitPhaseListings: Set<string>;
  appealChallengeRevealPhaseListings: Set<string>;
  resolveChallengeListings: Set<string>;
  resolveAppealListings: Set<string>;
  rejectedListings: Set<string>;
  user: { account: any };
  parameters: object;
  proposals: Map<string, object>;
  proposalApplications: Set<object>;
  challengedCommitProposals: Set<object>;
  challengedRevealProposals: Set<object>;
  updateableProposals: Set<object>;
  resolvableChallengedProposals: Set<object>;
  govtParameters: object;
  challenges: Map<string, WrappedChallengeData>;
  challengesFetching: Map<string, any>;
  challengesVotedOnByUser: Map<string, Set<string>>;
  challengesStartedByUser: Map<string, Set<string>>;
  challengeUserData: Map<string, Map<string, UserChallengeData>>;
  appealChallengeUserData: Map<string, Map<string, UserChallengeData>>;
  government: Map<string, string>;
  listingHistorySubscriptions: Map<string, Subscription>;
}

const networkDependentReducers = combineReducers({
  currentUserNewsrooms,
  listings,
  listingsFetching,
  histories,
  applications,
  whitelistedListings,
  readyToWhitelistListings,
  inChallengeCommitListings,
  inChallengeRevealListings,
  awaitingAppealRequestListings,
  awaitingAppealJudgmentListings,
  awaitingAppealChallengeListings,
  appealChallengeCommitPhaseListings,
  appealChallengeRevealPhaseListings,
  resolveChallengeListings,
  resolveAppealListings,
  rejectedListings,
  user,
  parameters,
  proposals,
  proposalApplications,
  challengedCommitProposals,
  challengedRevealProposals,
  updateableProposals,
  resolvableChallengedProposals,
  govtParameters,
  challenges,
  challengesFetching,
  challengesVotedOnByUser,
  challengesStartedByUser,
  challengeUserData,
  appealChallengeUserData,
  government,
  listingHistorySubscriptions,
});

const networkDependent = (state: any, action: AnyAction) => {
  if (action.type === networkActions.SET_NETWORK) {
    return networkDependentReducers(undefined, action);
  }
  return networkDependentReducers(state, action);
};

export default combineReducers({
  newsrooms, // have to be top level because come from a package
  newsroomUi,
  newsroomUsers,
  networkDependent,
  network,
  ui,
});
