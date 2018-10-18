import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { ListingSummaryApprovedComponent } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../reducers";
import { setupListingWhitelistedSubscription } from "../../actionCreators/listings";
import { makeGetListingPhaseState, makeGetListing, makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingListItemOwnProps, ListingListItemReduxProps } from "./ListingListItem";

export interface WhitelistedCardReduxProps extends ListingListItemReduxProps {
  whitelistedTimestamp?: number;
  ListingItemComponent?: any;
}

class WhitelistedListingItem extends React.Component<
  ListingListItemOwnProps & WhitelistedCardReduxProps & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(await setupListingWhitelistedSubscription(this.props.listingAddress!));
  }

  public render(): JSX.Element {
    const { listingAddress, listing, newsroom, listingPhaseState } = this.props;
    const listingData = listing!.data;
    let description = "";
    if (newsroom!.wrapper.data.charter) {
      try {
        // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
        description = (newsroom!.wrapper.data.charter!.content as any).desc;
      } catch (ex) {
        console.error("charter not formatted correctly");
      }
    }
    const challenge = listingData.challenge;
    const challengeID = challenge && listingData.challengeID.toString();
    const challengeStatementSummary =
      challenge && challenge.statement && JSON.parse(challenge.statement as string).summary;

    const pollData = challenge && challenge.poll;
    const commitEndDate = pollData && pollData.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData.revealEndDate.toNumber();
    const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
    const challengeStake = listingData.challenge && getFormattedTokenBalance(listingData.challenge.stake);

    const appeal = challenge && challenge.appeal;
    const appealStatementSummary = appeal && appeal.statement && JSON.parse(appeal.statement as string).summary;
    const appealPhaseExpiry = appeal && appeal.appealPhaseExpiry;
    const appealOpenToChallengeExpiry = appeal && appeal.appealOpenToChallengeExpiry;

    const newsroomData = newsroom!.wrapper.data;
    const listingDetailURL = `/listing/${listingAddress}`;

    const ListingSummaryItem = this.props.ListingItemComponent || ListingSummaryApprovedComponent;

    const listingViewProps = {
      ...newsroomData,
      listingAddress,
      description,
      listingDetailURL,
      ...listingPhaseState,
      challengeID,
      challengeStatementSummary,
      appeal,
      appealStatementSummary,
      appealPhaseExpiry,
      appealOpenToChallengeExpiry,
      commitEndDate,
      revealEndDate,
      unstakedDeposit,
      challengeStake,
      whitelistedTimestamp: this.props.whitelistedTimestamp,
    };

    return <ListingSummaryItem {...listingViewProps} />;
  }
}

const makeMapStateToProps = () => {
  const getListingPhaseState = makeGetListingPhaseState();
  const getListing = makeGetListing();
  const getLatestWhitelistedTimestamp = makeGetLatestWhitelistedTimestamp();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps,
  ): ListingListItemOwnProps & WhitelistedCardReduxProps => {
    const { newsrooms } = state;
    const newsroom = ownProps.listingAddress ? newsrooms.get(ownProps.listingAddress) : undefined;
    const listing = getListing(state, ownProps);
    const whitelistedTimestamp = getLatestWhitelistedTimestamp(state, ownProps);

    return {
      newsroom,
      listing,
      listingPhaseState: getListingPhaseState(state, ownProps),
      whitelistedTimestamp,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(WhitelistedListingItem);
