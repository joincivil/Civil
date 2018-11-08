import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { ListingSummaryApprovedComponent } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { getListingPhaseState, makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingListItemOwnProps, ListingListItemReduxProps } from "./ListingListItem";
import { getContent, getBareContent } from "../../redux/actionCreators/newsrooms";

export interface WhitelistedCardReduxProps extends ListingListItemReduxProps {
  whitelistedTimestamp?: number;
  ListingItemComponent?: any;
}

class WhitelistedListingItem extends React.Component<
  ListingListItemOwnProps & WhitelistedCardReduxProps & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.data.charterHeader!));
    }
    const { listing } = this.props;
    if (listing && listing.data.challenge) {
      this.props.dispatch!(await getBareContent(listing.data.challenge.challengeStatementURI!));
    }
  }

  public async componentDidUpdate(prevProps: ListingListItemOwnProps & WhitelistedCardReduxProps): Promise<void> {
    if (prevProps.listing !== this.props.listing) {
      const { listing } = this.props;
      if (listing && listing.data.challenge) {
        this.props.dispatch!(await getBareContent(listing.data.challenge.challengeStatementURI!));
      }
    }
  }

  public render(): JSX.Element {
    const { listingAddress, listing, newsroom, listingPhaseState, charter } = this.props;
    const listingData = listing!.data;
    let description = "";
    if (charter) {
      try {
        // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
        description = charter.desc;
      } catch (ex) {
        console.error("charter not formatted correctly");
      }
    }
    const challenge = listingData.challenge;
    const challengeID = challenge && listingData.challengeID.toString();
    const challengeStatementSummary =
      this.props.challengeStatement && JSON.parse(this.props.challengeStatement as string).summary;

    const pollData = challenge && challenge.poll;
    const commitEndDate = pollData && pollData.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData.revealEndDate.toNumber();
    const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
    const challengeStake = listingData.challenge && getFormattedTokenBalance(listingData.challenge.stake);

    const appeal = challenge && challenge.appeal;
    const appealStatementSummary = appeal && appeal.statement && JSON.parse(appeal.statement as string).summary;
    const appealPhaseExpiry = appeal && appeal.appealPhaseExpiry;
    const appealOpenToChallengeExpiry = appeal && appeal.appealOpenToChallengeExpiry;

    const newsroomData = newsroom!.data;
    const listingDetailURL = `/listing/${listingAddress}`;
    let whitelistedTimestamp = this.props.whitelistedTimestamp;
    if (this.props.queryData) {
      whitelistedTimestamp = this.props.queryData.listing.approvalDate;
    }

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
      whitelistedTimestamp,
    };

    return <ListingSummaryItem {...listingViewProps} />;
  }
}

const makeMapStateToProps = () => {
  const getLatestWhitelistedTimestamp = makeGetLatestWhitelistedTimestamp();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps,
  ): ListingListItemOwnProps & WhitelistedCardReduxProps => {
    const { content } = state.networkDependent;
    const whitelistedTimestamp = getLatestWhitelistedTimestamp(state, ownProps);
    let charter;
    if (ownProps.newsroom && ownProps.newsroom.data.charterHeader) {
      charter = content.get(ownProps.newsroom.data.charterHeader.uri);
    }
    return {
      listingPhaseState: getListingPhaseState(ownProps.listing),
      whitelistedTimestamp,
      charter,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(WhitelistedListingItem);
