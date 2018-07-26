import * as React from "react";
import { Set } from "immutable";
import { Tabs, Tab, ListingsInProgressTabNav, ListingsInProgressTab } from "@joincivil/components";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";

export interface ListingProps {
  applications: Set<string>;
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
}

class ListingsInProgress extends React.Component<ListingProps> {
  public render(): JSX.Element {
    const applications = this.props.applications;
    const beingChallenged = this.props.inChallengeCommitListings
      .merge(this.props.inChallengeRevealListings)
      .merge(this.props.awaitingAppealRequestListings);
    const consideringAppeal = this.props.awaitingAppealJudgmentListings.merge(
      this.props.awaitingAppealChallengeListings,
    );
    const appealChallenge = this.props.appealChallengeCommitPhaseListings.merge(
      this.props.appealChallengeRevealPhaseListings,
    );
    const readyToUpdate = this.props.readyToWhitelistListings
      .merge(this.props.resolveChallengeListings)
      .merge(this.props.resolveAppealListings);
    return (
      <Tabs TabsNavComponent={ListingsInProgressTabNav} TabComponent={ListingsInProgressTab}>
        <Tab title={"New Applications (" + applications.count() + ")"}>
          <ListingList listings={applications} />
        </Tab>
        <Tab title={"Under Challenged (" + beingChallenged.count() + ")"}>
          <ListingList listings={beingChallenged} />
        </Tab>
        <Tab title={"Appeal to Council (" + consideringAppeal.count() + ")"}>
          <ListingList listings={consideringAppeal} />
        </Tab>
        <Tab title={"Challenge Council Appeal (" + appealChallenge.count() + ")"}>
          <ListingList listings={appealChallenge} />
        </Tab>
        <Tab title={"Ready to Update (" + readyToUpdate.count() + ")"}>
          <ListingList listings={readyToUpdate} />
        </Tab>
      </Tabs>
    );
  }
}

const mapStateToProps = (state: State): ListingProps => {
  const {
    applications,
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
  } = state.networkDependent;

  return {
    applications,
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
  };
};

export default connect(mapStateToProps)(ListingsInProgress);
