import { combineReducers, AnyAction } from "redux";
import {
  listings,
  listingsExtendedMetadata,
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
  ListingExtendedMetadata,
  listingHistorySubscriptions,
  rejectedListingLatestChallengeSubscriptions,
  whitelistedSubscriptions,
  rejectedListingRemovedSubscriptions,
  loadingFinished,
} from "./listings";
import {
  parameters,
  proposals,
  parameterProposalChallenges,
  parameterProposalChallengesFetching,
} from "./parameterizer";
import {
  appealChallengeUserData,
  challenges,
  challengesFetching,
  challengesVotedOnByUser,
  challengesStartedByUser,
  challengeUserData,
} from "./challenges";
import {
  government,
  govtParameters,
  constitution,
  appellate,
  controller,
  appellateMembers,
  councilMultisigTransactions,
} from "./government";
import { user } from "./userAccount";
import { network, networkName } from "./network";
import { ui, useGraphQL } from "./ui";
import { Set, List, Map } from "immutable";
import {
  TimestampedEvent,
  WrappedChallengeData,
  UserChallengeData,
  EthAddress,
  ParamPropChallengeData,
  MultisigTransaction,
  EthContentHeader,
  ContentData,
} from "@joincivil/core";
import { currentUserNewsrooms, content, contentFetched } from "./newsrooms";
import { newsrooms, NewsroomState, newsroomUi, newsroomUsers } from "@joincivil/newsroom-manager";
import { networkActions } from "../actionCreators/network";
import { Subscription } from "rxjs";

export interface State {
  networkDependent: NetworkDependentState;
  network: string;
  networkName: string;
  ui: Map<string, any>;
  useGraphQL: boolean;
  newsrooms: Map<string, NewsroomState>;
  newsroomUi: Map<string, any>;
  newsroomUsers: Map<EthAddress, string>;
}

export interface NetworkDependentState {
  currentUserNewsrooms: Set<string>;
  content: Map<string, ContentData>;
  contentFetched: Set<EthContentHeader>;
  listings: Map<string, ListingWrapperWithExpiry>;
  listingsExtendedMetadata: Map<string, ListingExtendedMetadata>;
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
  loadingFinished: boolean;
  user: { account: any };
  parameters: object;
  proposals: Map<string, object>;
  parameterProposalChallenges: Map<string, ParamPropChallengeData>;
  parameterProposalChallengesFetching: Map<string, any>;
  govtParameters: object;
  challenges: Map<string, WrappedChallengeData>;
  challengesFetching: Map<string, any>;
  challengesVotedOnByUser: Map<string, Set<string>>;
  challengesStartedByUser: Map<string, Set<string>>;
  challengeUserData: Map<string, Map<string, UserChallengeData>>;
  appealChallengeUserData: Map<string, Map<string, UserChallengeData>>;
  government: Map<string, string>;
  constitution: Map<string, string>;
  appellate: string;
  controller: string;
  appellateMembers: string[];
  listingHistorySubscriptions: Map<string, Subscription>;
  rejectedListingRemovedSubscriptions: Map<string, Subscription>;
  rejectedListingLatestChallengeSubscriptions: Map<string, Subscription>;
  whitelistedSubscriptions: Map<string, Subscription>;
  councilMultisigTransactions: Map<string, MultisigTransaction>;
}

const networkDependentReducers = combineReducers({
  currentUserNewsrooms,
  content,
  contentFetched,
  listings,
  listingsExtendedMetadata,
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
  loadingFinished,
  user,
  parameters,
  proposals,
  parameterProposalChallenges,
  parameterProposalChallengesFetching,
  govtParameters,
  challenges,
  challengesFetching,
  challengesVotedOnByUser,
  challengesStartedByUser,
  challengeUserData,
  appealChallengeUserData,
  government,
  constitution,
  appellate,
  controller,
  appellateMembers,
  listingHistorySubscriptions,
  rejectedListingRemovedSubscriptions,
  rejectedListingLatestChallengeSubscriptions,
  whitelistedSubscriptions,
  councilMultisigTransactions,
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
  networkName,
  ui,
  useGraphQL,
});
