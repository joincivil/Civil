import { combineReducers } from "redux";
import {
  listings,
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
import { newsrooms } from "./newsrooms";
import { user } from "./userAccount";
import { Set, List, Map } from "immutable";
import { TimestampedEvent, NewsroomWrapper } from "@joincivil/core";

export interface State {
  newsrooms: Map<string, NewsroomWrapper>;
  listings: Map<string, ListingWrapperWithExpiry>;
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
}

export default combineReducers({
  newsrooms,
  listings,
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
});
