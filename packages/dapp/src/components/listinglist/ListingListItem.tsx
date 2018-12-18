import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { compose } from "redux";
import { State } from "../../redux/reducers";
import { getListingPhaseState } from "../../selectors";
import { ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";
import { ListingSummaryComponent, ListingSummaryRejectedComponent } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  ListingContainerProps,
  connectLatestChallengeSucceededResults,
  getChallengeResultsProps,
} from "../utility/HigherOrderComponents";
import WhitelistedListingItem from "./WhitelistedListingItem";
import { getContent, getBareContent } from "../../redux/actionCreators/newsrooms";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  ListingItemComponent?: any;
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  even: boolean;
  user?: string;
  queryData?: any;
}

export interface ListingListItemReduxProps {
  listingPhaseState?: any;
  charter?: CharterData;
  challengeStatement?: any;
  appealStatement?: any;
}

class ListingListItem extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps & DispatchProp<any>> {
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
    const { listing, newsroom, listingPhaseState } = this.props;
    const listingExists = listing && listing.data && newsroom && listingPhaseState;
    const isWhitelisted = listingExists && listingPhaseState.isWhitelisted;

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
      // TODO(toby) remove legacy `desc` after transition
      description = this.props.charter.tagline || (this.props.charter as any).desc;
    }
    const logoURL = this.props.charter && this.props.charter.logoUrl;
    const appExpiry = listingData.appExpiry && listingData.appExpiry.toNumber();
    const challenge = listingData.challenge;
    const pollData = challenge && challenge.poll;
    const commitEndDate = pollData && pollData.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData.revealEndDate.toNumber();
    const requestAppealExpiry = challenge && challenge.requestAppealExpiry.toNumber();
    const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
    const challengeStake = listingData.challenge && getFormattedTokenBalance(listingData.challenge.stake);
    const challengeID = challenge && listingData.challengeID.toString();
    let challengeStatementSummary;
    if (this.props.challengeStatement) {
      try {
        challengeStatementSummary = JSON.parse(this.props.challengeStatement as string).summary;
      } catch (ex) {
        challengeStatementSummary = this.props.challengeStatement.summary;
      }
    }

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

    const listingViewProps = {
      ...newsroomData,
      listingAddress,
      description,
      logoURL,
      listingDetailURL,
      ...listingPhaseState,
      challengeID,
      challengeStatementSummary,
      appeal,
      appealStatementSummary,
      appExpiry,
      commitEndDate,
      revealEndDate,
      requestAppealExpiry,
      appealPhaseExpiry,
      appealOpenToChallengeExpiry,
      unstakedDeposit,
      challengeStake,
    };

    const ListingSummaryItem = this.props.ListingItemComponent || ListingSummaryComponent;

    return <ListingSummaryItem {...listingViewProps} />;
  };
}

const RejectedListing: React.StatelessComponent<ListingListItemOwnProps & ListingListItemReduxProps> = props => {
  const { listingAddress, newsroom, listingPhaseState, charter, listing } = props;
  const newsroomData = newsroom!.data;
  const listingDetailURL = `/listing/${listingAddress}`;
  let description = "";
  if (charter) {
    // TODO(toby) remove legacy `desc` after transition
    description = charter.tagline || (charter as any).desc;
  }

  const listingViewProps = {
    ...newsroomData,
    description,
    listingAddress,
    listingDetailURL,
    ...listingPhaseState,
  };
  const data = listing!.data!;
  if (!data.prevChallenge) {
    const ListingSummaryRejected = compose<React.ComponentClass<ListingContainerProps & {}>>(
      connectLatestChallengeSucceededResults,
    )(ListingSummaryRejectedComponent);
    return <ListingSummaryRejected {...listingViewProps} />;
  } else {
    const challengeResultsProps = getChallengeResultsProps({
      listingAddress: listingAddress!,
      challengeID: data.prevChallengeID!,
      challenge: data.prevChallenge!,
    });
    return (
      <ListingSummaryRejectedComponent
        challengeID={data.prevChallengeID!.toString()}
        {...challengeResultsProps}
        {...listingViewProps}
      />
    );
  }
};

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { content } = state.networkDependent;
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
    charter,
    challengeStatement,
    appealStatement,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);
