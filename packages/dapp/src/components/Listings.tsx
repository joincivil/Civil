import * as React from "react";
import styled from "styled-components";
import { List } from "immutable";
import { Subscription } from "rxjs";

import ListingList from "./ListingList";
import { getTCR } from "../helpers/civilInstance";
import { ListingWrapper } from "@joincivil/core";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingsState {
  applications: List<ListingWrapper>;
  whitelistedListings: List<ListingWrapper>;
  readyToWhitelistListings: List<ListingWrapper>;
  inChallengeCommitListings: List<ListingWrapper>;
  inChallengeRevealListings: List<ListingWrapper>;
  canBeUpdatedListings: List<ListingWrapper>;
  awaitingAppealRequestListings: List<ListingWrapper>;
  awaitingAppealJudgmentListings: List<ListingWrapper>;
  awaitingAppealChallengeListings: List<ListingWrapper>;
  appealChallengeCommitPhaseListings: List<ListingWrapper>;
  appealChallengeRevealPhaseListings: List<ListingWrapper>;
  resolveAppealListings: List<ListingWrapper>;
  rejectedListings: List<ListingWrapper>;
  compositeSubscription: Subscription;
  error: undefined | string;
}

class Listings extends React.Component<{}, ListingsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      applications: List<ListingWrapper>(),
      whitelistedListings: List<ListingWrapper>(),
      readyToWhitelistListings: List<ListingWrapper>(),
      inChallengeCommitListings: List<ListingWrapper>(),
      inChallengeRevealListings: List<ListingWrapper>(),
      canBeUpdatedListings: List<ListingWrapper>(),
      awaitingAppealRequestListings: List<ListingWrapper>(),
      awaitingAppealJudgmentListings: List<ListingWrapper>(),
      awaitingAppealChallengeListings: List<ListingWrapper>(),
      appealChallengeCommitPhaseListings: List<ListingWrapper>(),
      appealChallengeRevealPhaseListings: List<ListingWrapper>(),
      resolveAppealListings: List<ListingWrapper>(),
      rejectedListings: List<ListingWrapper>(),
      compositeSubscription: new Subscription(),
      error: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initListings();
  }

  public componentWillUnmount(): void {
    this.state.compositeSubscription.unsubscribe();
  }

  public render(): JSX.Element {
    return (
      <StyledDiv>
        Whitelisted Newsrooms:<br />
        <ListingList listings={this.state.whitelistedListings} />
        <br />
        Applications:<br />
        <ListingList listings={this.state.applications} />
        <br />
        Ready to be Whitelisted:<br />
        <ListingList listings={this.state.readyToWhitelistListings} />
        <br />
        In Challenge Vote-Commit Stage:<br />
        <ListingList listings={this.state.inChallengeCommitListings} />
        <br />
        In Challenge Vote-Reveal Stage:<br />
        <ListingList listings={this.state.inChallengeRevealListings} />
        <br />
        Awaiting Appeal Request:<br />
        <ListingList listings={this.state.awaitingAppealRequestListings} />
        <br />
        Challenge Can Be Resolved:<br />
        <ListingList listings={this.state.canBeUpdatedListings} />
        <br />
        Awaiting Appeal Judgment:<br />
        <ListingList listings={this.state.awaitingAppealJudgmentListings} />
        <br />
        Awaiting Appeal Challenge:<br />
        <ListingList listings={this.state.awaitingAppealChallengeListings} />
        <br />
        Appeal Challenge in Commit Phase:<br />
        <ListingList listings={this.state.appealChallengeCommitPhaseListings} />
        <br />
        Appeal Challenge in Reveal Phase:<br />
        <ListingList listings={this.state.appealChallengeRevealPhaseListings} />
        <br />
        Appeal Can Be Resolved:<br />
        <ListingList listings={this.state.resolveAppealListings} />
        <br />
        Rejected Listings:<br />
        <ListingList listings={this.state.rejectedListings} />
        <br />
        {this.state.error}
      </StyledDiv>
    );
  }

  // TODO(nickreynolds): move this all into redux
  private initListings = async () => {
    const tcr = getTCR();

    if (tcr) {
      this.state.compositeSubscription.add(
        tcr
          .listingsInApplicationStage()
          .distinct()
          .subscribe(event => {
            this.setState({ applications: this.state.applications.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .whitelistedListings()
          .distinct()
          .subscribe(event => {
            this.setState({ whitelistedListings: this.state.whitelistedListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .readyToBeWhitelistedListings()
          .distinct()
          .subscribe(event => {
            this.setState({ readyToWhitelistListings: this.state.readyToWhitelistListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .currentChallengedCommitVotePhaseListings()
          .distinct()
          .subscribe(event => {
            this.setState({ inChallengeCommitListings: this.state.inChallengeCommitListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .currentChallengedRevealVotePhaseListings()
          .distinct()
          .subscribe(event => {
            this.setState({ inChallengeRevealListings: this.state.inChallengeRevealListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .listingsAwaitingAppealRequest()
          .distinct()
          .subscribe(event => {
            this.setState({ awaitingAppealRequestListings: this.state.awaitingAppealRequestListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .listingsAwaitingAppealJudgment()
          .distinct()
          .subscribe(event => {
            this.setState({ awaitingAppealJudgmentListings: this.state.awaitingAppealJudgmentListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .listingsAwaitingAppealChallenge()
          .distinct()
          .subscribe(event => {
            this.setState({ awaitingAppealChallengeListings: this.state.awaitingAppealChallengeListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .listingsInAppealChallengeCommitPhase()
          .distinct()
          .subscribe(event => {
            this.setState({
              appealChallengeCommitPhaseListings: this.state.appealChallengeCommitPhaseListings.push(event),
            });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .listingsInAppealChallengeRevealPhase()
          .distinct()
          .subscribe(event => {
            this.setState({
              appealChallengeRevealPhaseListings: this.state.appealChallengeRevealPhaseListings.push(event),
            });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .listingsWithAppealToResolve()
          .distinct()
          .subscribe(event => {
            this.setState({ resolveAppealListings: this.state.resolveAppealListings.push(event) });
          }),
      );
      this.state.compositeSubscription.add(
        tcr
          .rejectedListings()
          .distinct()
          .subscribe(event => {
            this.setState({ rejectedListings: this.state.rejectedListings.push(event) });
          }),
      );
    }
  };
}

export default Listings;
