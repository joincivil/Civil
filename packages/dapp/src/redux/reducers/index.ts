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
  proposalChallengeUserData,
  proposalChallengesToPropIDs,
} from "./parameterizer";
import {
  appealChallengeUserData,
  challenges,
  challengesFetching,
  challengesVotedOnByUser,
  challengesStartedByUser,
  challengeUserData,
  grantAppealTxs,
  grantAppealTxsFetching,
  appealChallengeIDsToChallengeIDs,
} from "./challenges";
import {
  government,
  govtParameters,
  constitution,
  appellate,
  controller,
  appellateMembers,
  councilMultisigTransactions,
  govtProposals,
} from "./government";
import { user } from "./userAccount";
import { network, networkName } from "./network";
import { ui, useGraphQL } from "./ui";
import { contractAddresses } from "./contractAddresses";
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
  TxDataAll,
} from "@joincivil/core";
import { currentUserNewsrooms, content, contentFetched } from "./newsrooms";
import {
  newsrooms,
  NewsroomState,
  newsroomUi,
  newsroomUsers,
  newsroomGovernment,
  grantApplication,
} from "@joincivil/newsroom-signup";
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
  newsroomGovernment: Map<string, string>;
  grantApplication: Map<string, boolean>;
}

export interface NetworkDependentState {
  currentUserNewsrooms: Set<string>;
  content: Map<string, ContentData>;
  contentFetched: Map<string, EthContentHeader>;
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
  proposalChallengeUserData: Map<string, Map<string, UserChallengeData>>;
  proposalChallengesToPropIDs: Map<string, string>;
  govtParameters: object;
  govtProposals: Map<string, object>;
  challenges: Map<string, WrappedChallengeData>;
  challengesFetching: Map<string, any>;
  challengesVotedOnByUser: Map<string, Set<string>>;
  challengesStartedByUser: Map<string, Set<string>>;
  challengeUserData: Map<string, Map<string, UserChallengeData>>;
  grantAppealTxs: Map<string, TxDataAll>;
  grantAppealTxsFetching: Map<string, boolean>;
  appealChallengeIDsToChallengeIDs: Map<string, string>;
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
  contractAddresses: Map<string, EthAddress>;
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
  proposalChallengeUserData,
  proposalChallengesToPropIDs,
  govtParameters,
  govtProposals,
  challenges,
  challengesFetching,
  challengesVotedOnByUser,
  challengesStartedByUser,
  challengeUserData,
  grantAppealTxs,
  grantAppealTxsFetching,
  appealChallengeIDsToChallengeIDs,
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
  contractAddresses,
});

const networkDependent = (state: any, action: AnyAction) => {
  if (action.type === networkActions.SET_NETWORK) {
    return networkDependentReducers(undefined, action);
  }
  return networkDependentReducers(state, action);
};
import { connectRouter } from "connected-react-router";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    newsrooms, // have to be top level because come from a package
    newsroomUi,
    newsroomUsers,
    newsroomGovernment,
    grantApplication,
    networkDependent,
    network,
    networkName,
    ui,
    useGraphQL,
  });
