import * as React from "react";
import { Set } from "immutable";
import { Tabs, Tab, TabComponentProps, colors, fonts } from "@joincivil/components";
import styled from "styled-components";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";

const StyledTabNav = styled.div`
  margin: 30px auto 50px;
  width: 100%;
`;

const StyledTab = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? "#e9eeff" : "transparent")};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-right: none;
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.primary.BLACK)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  padding: 20px 44px;
  &:last-of-type {
    border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
  }
  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
    background-color: #e9eeff;
  }
`;

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
      <Tabs TabsNavComponent={StyledTabNav} TabComponent={StyledTab}>
        <Tab title={"New Applications"} tabCount={" (" + applications.count() + ")"}>
          <ListingList listings={applications} />
        </Tab>
        <Tab title={"Under Challenged"} tabCount={" (" + beingChallenged.count() + ")"}>
          <ListingList listings={beingChallenged} />
        </Tab>
        <Tab title={"Appeal to Council"} tabCount={" (" + consideringAppeal.count() + ")"}>
          <ListingList listings={consideringAppeal} />
        </Tab>
        <Tab title={"Challenge Council Appeal"} tabCount={" (" + appealChallenge.count() + ")"}>
          <ListingList listings={appealChallenge} />
        </Tab>
        <Tab title={"Ready to Update"} tabCount={" (" + readyToUpdate.count() + ")"}>
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
