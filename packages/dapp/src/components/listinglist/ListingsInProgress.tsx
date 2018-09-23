import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { Tabs, Tab, StyledSquarePillTabNav, StyledSquarePillTab } from "@joincivil/components";

import ListingList from "./ListingList";
import { State } from "../../reducers";
import { StyledListingCopy } from "../utility/styledComponents";

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
      <Tabs TabsNavComponent={StyledSquarePillTabNav} TabComponent={StyledSquarePillTab}>
        <Tab title={"New Applications (" + applications.count() + ")"}>
          <>
            <StyledListingCopy>
              New applications are subject to Civil community review for alignment with the Civil Constitution. By
              participating in our governance, you can help curate high-quality, trustworthy journalism.
            </StyledListingCopy>
            <ListingList listings={applications} />
          </>
        </Tab>
        <Tab title={"Under Challenge (" + beingChallenged.count() + ")"}>
          <>
            <StyledListingCopy>
              Applications “under challenge” require the Civil community vote to remain on the Registry due to a
              potential breach of the Civil Constitution. Help us curate high quality, trustworthy journalism, and earn
              CVL tokens when you vote.
            </StyledListingCopy>
            <ListingList listings={beingChallenged} />
          </>
        </Tab>
        <Tab title={"Appeal to Council (" + consideringAppeal.count() + ")"}>
          <>
            <StyledListingCopy>
              Appeal to the Civil Council has been granted to these Newsrooms. The Civil Council will review whether
              these Newsrooms breached the Civil Constitution, and a decision will be announced X days after the appeal
              is granted.
            </StyledListingCopy>
            <ListingList listings={consideringAppeal} />
          </>
        </Tab>
        <Tab title={"Challenge Council Appeal (" + appealChallenge.count() + ")"}>
          <>
            <StyledListingCopy>
              Newsrooms under “Challenge Council Appeal” require the Civil community vote to veto the Council decision
              in order to remain on the Registry. Help us curate high quality, trustworthy journalism, and earn CVL
              tokens when you vote.
            </StyledListingCopy>
            <ListingList listings={appealChallenge} />
          </>
        </Tab>
        <Tab title={"Ready to Update (" + readyToUpdate.count() + ")"}>
          <>
            <StyledListingCopy>Step 1: Resolve these challenges. Step 2: ???. Step 3: Profit!!!</StyledListingCopy>
            <ListingList listings={readyToUpdate} />
          </>
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
