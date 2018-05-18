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
  resolveAppealListings,
  rejectedListings,
} from "./listings";
import { parameters } from "./parameterizer";
import { newsrooms } from "./newsrooms";
import { user } from "./userAccount";
import { Set, List, Map } from "immutable";
import { ListingWrapper, TimestampedEvent, NewsroomWrapper } from "@joincivil/core";

export interface State {
  newsrooms: Map<string, NewsroomWrapper>;
  listings: Map<string, ListingWrapper>;
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
  resolveAppealListings: Set<string>;
  rejectedListings: Set<string>;
  user: { account: any };
  parameters: object;
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
  resolveAppealListings,
  rejectedListings,
  user,
  parameters,
});
