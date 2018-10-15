import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { compose } from "redux";
import { State } from "../../reducers";
import { makeGetListingPhaseState, makeGetListing } from "../../selectors";
import { ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { ListingSummaryComponent, ListingSummaryRejectedComponent } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import WhitelistedListingItem from "./WhitelistedListingItem";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
  listingPhaseState?: any;
  charter?: any;
}

class ListingListItemComponent extends React.Component<
  ListingListItemOwnProps & ListingListItemReduxProps & DispatchProp<any>
> {
  public render(): JSX.Element {
    const { listing, newsroom, listingPhaseState } = this.props;
    const listingExists = listing && listing.data && newsroom && listingPhaseState;
    const isWhitelisted = listingExists && listingPhaseState.isWhitelisted && !listingPhaseState.isUnderChallenge;

    return (
      <>
        {isWhitelisted && <WhitelistedListingItem {...this.props} />}
        {listingExists && !isWhitelisted && !listingPhaseState.isRejected && this.renderListing()}
        {listingExists && listingPhaseState.isRejected && <RejectedListing {...this.props} />}
      </>
    );
  }

  private renderListing = (): JSX.Element => {
    const { listingAddress, listing, newsroom, listingPhaseState } = this.props;
    const listingData = listing!.data;
    let description = "";
    if (this.props.charter) {
      try {
        // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
        description = (this.props.charter!.content as any).desc;
      } catch (ex) {
        console.error("charter not formatted correctly");
      }
    }
    const appExpiry = listingData.appExpiry && listingData.appExpiry.toNumber();
    const challenge = listingData.challenge;
    const pollData = challenge && challenge.poll;
    const commitEndDate = pollData && pollData.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData.revealEndDate.toNumber();
    const requestAppealExpiry = challenge && challenge.requestAppealExpiry.toNumber();
    const appeal = challenge && challenge.appeal;
    const appealPhaseExpiry = appeal && appeal.appealPhaseExpiry;
    const appealOpenToChallengeExpiry = appeal && appeal.appealOpenToChallengeExpiry;
    const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
    const challengeStake = listingData.challenge && getFormattedTokenBalance(listingData.challenge.stake);
    const challengeStatementSummary =
      challenge && challenge.statement && JSON.parse(challenge.statement as string).summary;

    const newsroomData = newsroom!.wrapper.data;
    const listingDetailURL = `/listing/${listingAddress}`;

    const listingViewProps = {
      ...newsroomData,
      listingAddress,
      description,
      listingDetailURL,
      ...listingPhaseState,
      challengeStatementSummary,
      appeal,
      appExpiry,
      commitEndDate,
      revealEndDate,
      requestAppealExpiry,
      appealPhaseExpiry,
      appealOpenToChallengeExpiry,
      unstakedDeposit,
      challengeStake,
    };

    return <ListingSummaryComponent {...listingViewProps} />;
  };
}

const RejectedListing: React.StatelessComponent<ListingListItemOwnProps & ListingListItemReduxProps> = props => {
  const { listingAddress, newsroom, listingPhaseState } = props;
  const newsroomData = newsroom!.wrapper.data;
  const listingDetailURL = `/listing/${listingAddress}`;

  const listingViewProps = {
    ...newsroomData,
    listingAddress,
    listingDetailURL,
    ...listingPhaseState,
  };

  const ListingSummaryRejected = compose<React.ComponentClass<ListingContainerProps & {}>>(
    connectLatestChallengeSucceededResults,
  )(ListingSummaryRejectedComponent);

  return <ListingSummaryRejected {...listingViewProps} />;
};

const makeMapStateToProps = () => {
  const getListingPhaseState = makeGetListingPhaseState();
  const getListing = makeGetListing();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps,
  ): ListingListItemReduxProps & ListingListItemOwnProps => {
    const { newsrooms } = state;
    const { content } = state.networkDependent;
    const newsroom = ownProps.listingAddress ? newsrooms.get(ownProps.listingAddress) : undefined;
    const listing = getListing(state, ownProps);
    let charter;
    if (newsroom && newsroom.wrapper.data.charterHeader) {
      charter = content.get(newsroom.wrapper.data.charterHeader);
    }
    return {
      newsroom,
      listing,
      listingPhaseState: getListingPhaseState(state, ownProps),
      charter,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export const ListingListItem = connect(makeMapStateToProps)(ListingListItemComponent);
