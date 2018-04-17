import * as React from "react";
import styled from "styled-components";
import { Civil } from "@joincivil/core";
import { List } from "immutable";
import { Subscription } from "rxjs";

import ListingEvent from "./ListingEvent";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingHistoryProps {
  match: any;
}

export interface ListingHistoryState {
  listingHistory: List<any>;
  applicationSubscription: Subscription;
  whitelistSubscription: Subscription;
  readyToWhitelistSubscription: Subscription;
  inChallengeCommitSubscription: Subscription;
  inChallengeRevealSubscription: Subscription;
  canBeUpdatedSubscription: Subscription;
  awaitingAppealRequestSubscription: Subscription;
  awaitingAppealJudgmentSubscription: Subscription;
  error: undefined | string;
}

class ListingHistory extends React.Component<ListingHistoryProps, ListingHistoryState> {
  constructor(props: any) {
    super(props);
    this.state = {
      listingHistory: List<any>(),
      applicationSubscription: new Subscription(),
      whitelistSubscription: new Subscription(),
      readyToWhitelistSubscription: new Subscription(),
      inChallengeCommitSubscription: new Subscription(),
      inChallengeRevealSubscription: new Subscription(),
      canBeUpdatedSubscription: new Subscription(),
      awaitingAppealRequestSubscription: new Subscription(),
      awaitingAppealJudgmentSubscription: new Subscription(),
      error: undefined,
    };
  }

  public componentWillMount(): void {
    window.addEventListener("load", this.initListings);
  }

  public componentWillUnmount(): void {
    this.state.applicationSubscription.unsubscribe();
    this.state.whitelistSubscription.unsubscribe();
    this.state.readyToWhitelistSubscription.unsubscribe();
    this.state.inChallengeCommitSubscription.unsubscribe();
    this.state.inChallengeRevealSubscription.unsubscribe();
    this.state.canBeUpdatedSubscription.unsubscribe();
    this.state.awaitingAppealRequestSubscription.unsubscribe();
    this.state.awaitingAppealJudgmentSubscription.unsubscribe();
    window.removeEventListener("load", this.initListings);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv>
        History:<br />
        {this.state.listingHistory.map(e => {
          return <ListingEvent key={this.props.match.params.listing + e.blockNumber} event={e} />;
        })}
      </StyledDiv>
    );
  }

  // TODO(nickreynolds): move this all into redux
  private initListings = async () => {
    const civil = new Civil();
    let tcr;
    try {
      tcr = civil.tcrSingletonTrusted();
    } catch (ex) {
      console.log("failed to get tcr.");
      this.setState({
        error: "No Supported Network Found. Please set MetaMask network to Rinkeby and Unlock Account.",
      });
    }

    if (tcr) {
      const applicationSubscription = tcr
        .listingApplications(this.props.match.params.listing)
        .subscribe(async (e: any) => {
          this.setState({ listingHistory: this.state.listingHistory.push(await e) });
        });
      this.setState({ applicationSubscription });

      /*const whitelistSubscription = tcr.whitelistedListings().subscribe(listing => {
        this.setState({ whitelistedListings: this.state.whitelistedListings.push(listing) });
      });
      this.setState({ whitelistSubscription });

      const readyToWhitelistSubscription = tcr.readyToBeWhitelistedListings().subscribe(listing => {
        this.setState({ readyToWhitelistListings: this.state.readyToWhitelistListings.push(listing) });
      });
      this.setState({ readyToWhitelistSubscription });

      const inChallengeCommitSubscription = tcr.currentChallengedCommitVotePhaseListings().subscribe(listing => {
        this.setState({ inChallengeCommitListings: this.state.inChallengeCommitListings.push(listing) });
      });
      this.setState({ inChallengeCommitSubscription });

      const inChallengeRevealSubscription = tcr.currentChallengedRevealVotePhaseListings().subscribe(listing => {
        this.setState({ inChallengeRevealListings: this.state.inChallengeRevealListings.push(listing) });
      });
      this.setState({ inChallengeRevealSubscription });

      const awaitingAppealRequestSubscription = tcr.listingsAwaitingAppealRequest().subscribe(listing => {
        this.setState({ awaitingAppealRequestListings: this.state.awaitingAppealRequestListings.push(listing) });
      });
      this.setState({ awaitingAppealRequestSubscription });

      const awaitingAppealJudgmentSubscription = tcr.listingsAwaitingAppeal().subscribe(listing => {
        this.setState({ awaitingAppealJudgmentListings: this.state.awaitingAppealJudgmentListings.push(listing) });
      });
      this.setState({ awaitingAppealJudgmentSubscription });*/
    }
  };
}

export default ListingHistory;
