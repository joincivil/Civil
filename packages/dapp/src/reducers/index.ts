import { combineReducers } from "redux";
import {
  listings,
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
  resolveAppealListings,
  rejectedListings,
} from "./listings";
import { newsrooms } from "./newsrooms";
import { user } from "./userAccount";
import { Set } from "immutable";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";

export interface State {
  newsrooms: Map<string, NewsroomWrapper>;
  listings: Map<string, ListingWrapper>;
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
  resolveAppealListings: Set<string>;
  rejectedListings: Set<string>;
  user: { account: any };
}

export default combineReducers({
  newsrooms,
  listings,
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
  resolveAppealListings,
  rejectedListings,
  user,
});
