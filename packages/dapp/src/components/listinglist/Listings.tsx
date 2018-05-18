import * as React from "react";
import styled from "styled-components";
import { Set } from "immutable";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%
  color: black;
`;

export interface ListingProps {
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
  error: undefined | string;
}

class Listings extends React.Component<ListingProps> {
  public render(): JSX.Element {
    return (
      <StyledDiv>
        Whitelisted Newsrooms:<br />
        <ListingList listings={this.props.whitelistedListings} />
        <br />
        Applications:<br />
        <ListingList listings={this.props.applications} />
        <br />
        Ready to be Whitelisted:<br />
        <ListingList listings={this.props.readyToWhitelistListings} />
        <br />
        In Challenge Vote-Commit Stage:<br />
        <ListingList listings={this.props.inChallengeCommitListings} />
        <br />
        In Challenge Vote-Reveal Stage:<br />
        <ListingList listings={this.props.inChallengeRevealListings} />
        <br />
        Awaiting Appeal Request:<br />
        <ListingList listings={this.props.awaitingAppealRequestListings} />
        <br />
        Awaiting Appeal Judgment:<br />
        <ListingList listings={this.props.awaitingAppealJudgmentListings} />
        <br />
        Awaiting Appeal Challenge:<br />
        <ListingList listings={this.props.awaitingAppealChallengeListings} />
        <br />
        Appeal Challenge in Commit Phase:<br />
        <ListingList listings={this.props.appealChallengeCommitPhaseListings} />
        <br />
        Appeal Challenge in Reveal Phase:<br />
        <ListingList listings={this.props.appealChallengeRevealPhaseListings} />
        <br />
        Appeal Can Be Resolved:<br />
        <ListingList listings={this.props.resolveAppealListings} />
        <br />
        Rejected Listings:<br />
        <ListingList listings={this.props.rejectedListings} />
        <br />
        {this.props.error}
      </StyledDiv>
    );
  }
}

const mapStateToProps = (state: State): ListingProps => {
  const {
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
  } = state;

  return {
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
    error: undefined,
  };
};

export default connect(mapStateToProps)(Listings);
