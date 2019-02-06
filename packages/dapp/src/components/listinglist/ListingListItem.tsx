import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { compose } from "redux";
import { State } from "../../redux/reducers";
import { getListingPhaseState } from "../../selectors";
import { ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";
import {
  ListingSummaryComponentProps,
  ListingSummaryComponent,
  ListingSummaryRejectedComponent,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import WhitelistedListingItem from "./WhitelistedListingItem";
import { getContent, getBareContent } from "../../redux/actionCreators/newsrooms";
import { getChallengeResultsProps, getAppealChallengeResultsProps } from "../../helpers/transforms";

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
  appealChallengeStatement?: any;
}

export const transformListingSummaryViewProps = (
  props: ListingListItemOwnProps & ListingListItemReduxProps & Partial<ListingSummaryComponentProps>,
) => {
  const { listingAddress, listing, newsroom, listingPhaseState, charter } = props;
  const listingData = listing!.data;
  const appExpiry = listingData.appExpiry && listingData.appExpiry.toNumber();
  let challenge = listingData.challenge;
  let challengeID = challenge && listingData.challengeID.toString();
  if (!challenge && !listingData.isWhitelisted) {
    challenge = listingData.prevChallenge;
    challengeID = challenge && listingData.prevChallengeID!.toString();
  }
  const pollData = challenge && challenge.poll;
  const commitEndDate = pollData && pollData.commitEndDate.toNumber();
  const revealEndDate = pollData && pollData.revealEndDate.toNumber();
  const requestAppealExpiry = challenge && challenge.requestAppealExpiry.toNumber();
  const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
  const challengeStake = challenge && getFormattedTokenBalance(challenge.stake);
  let challengeStatementSummary;
  if (props.challengeStatement) {
    try {
      challengeStatementSummary = JSON.parse(props.challengeStatement as string).summary;
    } catch (ex) {
      challengeStatementSummary = props.challengeStatement.summary;
    }
  }

  const appeal = challenge && challenge.appeal;

  let appealStatementSummary;
  if (props.appealStatement) {
    try {
      appealStatementSummary = JSON.parse(props.appealStatement as string).summary;
    } catch (ex) {
      appealStatementSummary = props.appealStatement.summary;
    }
  }

  let appealChallengeCommitEndDate;
  let appealChallengeRevealEndDate;
  let appealPollData;
  let appealChallengeID;
  const appealChallenge = appeal && appeal.appealChallenge;
  if (appealChallenge && appeal!.appealChallengeID) {
    appealChallengeID = appeal!.appealChallengeID.toString();
    appealPollData = appealChallenge.poll;
    appealChallengeCommitEndDate = appealPollData && appealPollData.commitEndDate.toNumber();
    appealChallengeRevealEndDate = appealPollData && appealPollData.revealEndDate.toNumber();
  }

  let appealChallengeStatementSummary;
  if (props.appealChallengeStatement) {
    try {
      appealChallengeStatementSummary = JSON.parse(props.appealChallengeStatement as string).summary;
    } catch (ex) {
      appealChallengeStatementSummary = props.appealChallengeStatement.summary;
    }
  }

  const appealPhaseExpiry = appeal && appeal.appealPhaseExpiry.toNumber();
  const appealOpenToChallengeExpiry = appeal && appeal.appealOpenToChallengeExpiry.toNumber();

  const newsroomData = newsroom!.data;
  const listingDetailURL = `/listing/${listingAddress}`;

  let challengeResultsProps = {};

  const {
    isAwaitingAppealRequest,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
    canBeWhitelisted,
    canResolveChallenge,
    canListingAppealBeResolved,
    canListingAppealChallengeBeResolved,
  } = listingPhaseState;

  if (
    (challenge && isAwaitingAppealRequest) ||
    isAwaitingAppealJudgement ||
    isAwaitingAppealChallenge ||
    isInAppealChallengeCommitPhase ||
    isInAppealChallengeRevealPhase ||
    canBeWhitelisted ||
    canResolveChallenge ||
    canListingAppealBeResolved ||
    canListingAppealChallengeBeResolved
  ) {
    challengeResultsProps = getChallengeResultsProps(challenge!);
  }

  let appealChallengeResultsProps;

  if (
    appealChallenge &&
    (canListingAppealChallengeBeResolved ||
      (!isInAppealChallengeCommitPhase &&
        !isInAppealChallengeRevealPhase &&
        !canListingAppealChallengeBeResolved &&
        !listingData.isWhitelisted))
  ) {
    appealChallengeResultsProps = getAppealChallengeResultsProps(appealChallenge!);
  }

  return {
    ...newsroomData,
    listingAddress,
    listingDetailURL,
    charter,
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
    appealChallengeCommitEndDate,
    appealChallengeRevealEndDate,
    unstakedDeposit,
    challengeStake,
    ...challengeResultsProps,
    ...appealChallengeResultsProps,
    appealChallengeID,
    appealChallengeStatementSummary,
  };
};

export const ListingItemBaseComponent: React.SFC<
  ListingListItemOwnProps & ListingListItemReduxProps & Partial<ListingSummaryComponentProps>
> = props => {
  const ListingSummaryItem = props.ListingItemComponent || ListingSummaryComponent;
  const listingViewProps = transformListingSummaryViewProps(props);

  return <ListingSummaryItem {...listingViewProps} />;
};

const RejectedListing: React.StatelessComponent<ListingListItemOwnProps & ListingListItemReduxProps> = props => {
  const { listing } = props;
  const listingViewProps = transformListingSummaryViewProps(props);

  const data = listing!.data!;
  if (!data.prevChallenge) {
    const ListingSummaryRejected = compose<React.ComponentClass<ListingContainerProps & {}>>(
      connectLatestChallengeSucceededResults,
    )(ListingSummaryRejectedComponent);
    // console.log("1 challengeResultsProps: ", { ...listingViewProps });
    return <ListingSummaryRejected {...listingViewProps} />;
  } else {
    const challengeResultsProps = getChallengeResultsProps(data.prevChallenge!);
    // console.log("2 challengeResultsProps: ", challengeResultsProps);
    return (
      <ListingSummaryRejectedComponent
        challengeID={data.prevChallengeID!.toString()}
        {...listingViewProps}
        {...challengeResultsProps}
      />
    );
  }
};

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

        if (listing.data.challenge.appeal.appealChallenge) {
          this.props.dispatch!(
            await getBareContent(listing.data.challenge.appeal.appealChallenge.appealChallengeStatementURI!),
          );
        }
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

          if (listing.data.challenge.appeal.appealChallenge) {
            this.props.dispatch!(
              await getBareContent(listing.data.challenge.appeal.appealChallenge.appealChallengeStatementURI!),
            );
          }
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
        {listingExists &&
          !isWhitelisted &&
          !listingPhaseState.isRejected && <ListingItemBaseComponent {...this.props} />}
        {listingExists && listingPhaseState.isRejected && <RejectedListing {...this.props} />}
      </>
    );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { content } = state.networkDependent;
  let charter;
  let challengeStatement;
  let appealStatement;
  let appealChallengeStatement;
  if (ownProps.newsroom && ownProps.newsroom.data.charterHeader) {
    charter = content.get(ownProps.newsroom.data.charterHeader.uri) as CharterData;
  }
  if (ownProps.listing && ownProps.listing.data.challenge) {
    challengeStatement = content.get(ownProps.listing.data.challenge.challengeStatementURI!);
    if (ownProps.listing.data.challenge.appeal) {
      appealStatement = content.get(ownProps.listing.data.challenge.appeal.appealStatementURI!);

      if (ownProps.listing.data.challenge.appeal.appealChallenge) {
        appealChallengeStatement = content.get(
          ownProps.listing.data.challenge.appeal.appealChallenge.appealChallengeStatementURI!,
        );
      }
    }
  }

  return {
    listingPhaseState: getListingPhaseState(ownProps.listing),
    charter,
    challengeStatement,
    appealStatement,
    appealChallengeStatement,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);
