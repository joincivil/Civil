import * as React from "react";
import { Set } from "immutable";
import { Tabs } from "../tabs/Tabs";
import { BoxTab } from "../tabs/Tab";

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
      <Tabs className={"listings-subnav"}>
        <BoxTab tabText={"Applications"} tabCount={" (" + applications.count() + ")"}>
          <ListingList listings={applications} />
        </BoxTab>
        <BoxTab tabText={"Being Challenged"} tabCount={" (" + beingChallenged.count() + ")"}>
          <ListingList listings={beingChallenged} />
        </BoxTab>
        <BoxTab tabText={"Appeal Being Considered"} tabCount={" (" + consideringAppeal.count() + ")"}>
          <ListingList listings={consideringAppeal} />
        </BoxTab>
        <BoxTab tabText={"Appeal Being Challenged"} tabCount={" (" + appealChallenge.count() + ")"}>
          <ListingList listings={appealChallenge} />
        </BoxTab>
        <BoxTab tabText={"Ready to Update"} tabCount={" (" + readyToUpdate.count() + ")"}>
          <ListingList listings={readyToUpdate} />
        </BoxTab>
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
