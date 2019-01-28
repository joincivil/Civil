import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { CharterData } from "@joincivil/core";
import { ListingSummaryApprovedComponent } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { getListingPhaseState, makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingListItemOwnProps, ListingListItemReduxProps } from "./ListingListItem";
import { getContent, getBareContent } from "../../redux/actionCreators/newsrooms";
import { getChallengeResultsProps } from "../../helpers/transforms";

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
      if (listing.data.challenge.appeal) {
        this.props.dispatch!(await getBareContent(listing.data.challenge.appeal.appealStatementURI!));
      }
    }
  }

  public async componentDidUpdate(prevProps: ListingListItemOwnProps & ListingListItemReduxProps): Promise<void> {
    if (prevProps.listing !== this.props.listing) {
      const { listing } = this.props;
      if (listing && listing.data.challenge) {
        this.props.dispatch!(await getBareContent(listing.data.challenge.challengeStatementURI!));
        if (listing.data.challenge.appeal) {
          this.props.dispatch!(await getBareContent(listing.data.challenge.appeal.appealStatementURI!));
        }
      }
    }
    if (prevProps.newsroom !== this.props.newsroom) {
      if (this.props.newsroom) {
        this.props.dispatch!(await getContent(this.props.newsroom.data.charterHeader!));
      }
    }
  }

  public render(): JSX.Element {
    const { listingAddress, listing, newsroom, listingPhaseState, charter } = this.props;
    const listingData = listing!.data;
    const challenge = listingData.challenge;
    const challengeID = challenge && listingData.challengeID.toString();
    let challengeStatementSummary;
    if (this.props.challengeStatement) {
      try {
        challengeStatementSummary = JSON.parse(this.props.challengeStatement as string).summary;
      } catch (ex) {
        challengeStatementSummary = this.props.challengeStatement.summary;
      }
    }

    const pollData = challenge && challenge.poll;
    const commitEndDate = pollData && pollData.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData.revealEndDate.toNumber();
    const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
    const challengeStake = listingData.challenge && getFormattedTokenBalance(listingData.challenge.stake);

    const appeal = challenge && challenge.appeal;

    let appealStatementSummary;
    if (this.props.appealStatement) {
      try {
        appealStatementSummary = JSON.parse(this.props.appealStatement as string).summary;
      } catch (ex) {
        appealStatementSummary = this.props.appealStatement.summary;
      }
    }

    const appealPhaseExpiry = appeal && appeal.appealPhaseExpiry;
    const appealOpenToChallengeExpiry = appeal && appeal.appealOpenToChallengeExpiry;

    const newsroomData = newsroom!.data;
    const listingDetailURL = `/listing/${listingAddress}`;
    let whitelistedTimestamp = this.props.whitelistedTimestamp;
    if (this.props.queryData) {
      whitelistedTimestamp = this.props.queryData.listing.approvalDate;
    }

    let challengeResultsProps = {};

    if (
      listingPhaseState.isAwaitingAppealRequest ||
      listingPhaseState.isAwaitingAppealJudgement ||
      listingPhaseState.isInAppealChallengeCommitPhase ||
      listingPhaseState.isInAppealChallengeRevealPhase
    ) {
      challengeResultsProps = getChallengeResultsProps(challenge!);
    }

    const ListingSummaryItem = this.props.ListingItemComponent || ListingSummaryApprovedComponent;

    const listingViewProps = {
      ...newsroomData,
      listingAddress,
      charter,
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
      ...challengeResultsProps,
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
    let challengeStatement;
    let appealStatement;
    if (ownProps.newsroom && ownProps.newsroom.data.charterHeader) {
      charter = content.get(ownProps.newsroom.data.charterHeader.uri) as CharterData;
    }
    if (ownProps.listing && ownProps.listing.data.challenge) {
      challengeStatement = content.get(ownProps.listing.data.challenge.challengeStatementURI!);
      if (ownProps.listing.data.challenge.appeal) {
        appealStatement = content.get(ownProps.listing.data.challenge.appeal.appealStatementURI!);
      }
    }
    return {
      listingPhaseState: getListingPhaseState(ownProps.listing),
      whitelistedTimestamp,
      charter,
      challengeStatement,
      appealStatement,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(WhitelistedListingItem);
