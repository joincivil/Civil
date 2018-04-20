import * as React from "react";
import styled from "styled-components";
import { List } from "immutable";
import { Subscription } from "rxjs";

import ListingList from "./ListingList";
import { getTCR } from "../helpers/civilInstance";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingsState {
  applications: List<string>;
  whitelistedListings: List<string>;
  readyToWhitelistListings: List<string>;
  inChallengeCommitListings: List<string>;
  inChallengeRevealListings: List<string>;
  canBeUpdatedListings: List<string>;
  awaitingAppealRequestListings: List<string>;
  awaitingAppealJudgmentListings: List<string>;
  compositeSubscription: Subscription;
  error: undefined | string;
}

class Listings extends React.Component<{}, ListingsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      applications: List<string>(),
      whitelistedListings: List<string>(),
      readyToWhitelistListings: List<string>(),
      inChallengeCommitListings: List<string>(),
      inChallengeRevealListings: List<string>(),
      canBeUpdatedListings: List<string>(),
      awaitingAppealRequestListings: List<string>(),
      awaitingAppealJudgmentListings: List<string>(),
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
        Can be Updated:<br />
        <ListingList listings={this.state.canBeUpdatedListings} />
        <br />
        Awaiting Appeal Request:<br />
        <ListingList listings={this.state.awaitingAppealRequestListings} />
        <br />
        Awaiting Appeal Judgment:<br />
        <ListingList listings={this.state.awaitingAppealJudgmentListings} />
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
          .listingsAwaitingAppeal()
          .distinct()
          .subscribe(event => {
            this.setState({ awaitingAppealJudgmentListings: this.state.awaitingAppealJudgmentListings.push(event) });
          }),
      );
    }
  };
}

export default Listings;
