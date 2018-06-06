import { combineReducers } from "redux";
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
import { challenges, challengesFetching, challengesVotedOnByUser, challengeUserData } from "./challenges";
import { government, govtParameters } from "./government";
import { user } from "./userAccount";
import { ui } from "./ui";
import { Set, List, Map } from "immutable";
import { TimestampedEvent, WrappedChallengeData, UserChallengeData } from "@joincivil/core";
import { newsrooms, currentUserNewsrooms, NewsroomState } from "./newsrooms";

export interface State {
  newsrooms: Map<string, NewsroomState>;
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
  challengeUserData: Map<string, Map<string, UserChallengeData>>;
  government: Map<string, string>;
  ui: Map<string, any>;
}

export default combineReducers({
  newsrooms,
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
  challengeUserData,
  government,
  ui,
});
