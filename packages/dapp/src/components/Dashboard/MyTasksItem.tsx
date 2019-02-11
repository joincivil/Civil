import * as React from "react";
import { connect, DispatchProp } from "react-redux";
// import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import { ListingWrapper, WrappedChallengeData, UserChallengeData, CharterData } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { DashboardActivityItemCommitVote, PHASE_TYPE_NAMES, StyledDashbaordActvityItemSection } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import {
  getChallenge,
  getListingPhaseState,
  makeGetListing,
  makeGetListingAddressByChallengeID,
  makeGetUserChallengeData,
  makeGetUnclaimedRewardAmount,
  getChallengeState,
} from "../../selectors";
import { WinningChallengeResults } from "./WinningChallengeResults";
import { PhaseCountdownTimer } from "./PhaseCountdownTimer";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { getContent } from "../../redux/actionCreators/newsrooms";

export interface ActivityListItemOwnProps {
  listingAddress?: string;
  even: boolean;
  challenge?: WrappedChallengeData;
  userChallengeData?: UserChallengeData;
  unclaimedRewardAmount?: string;
  challengeState?: any;
  challengeID?: string;
  user?: string;
  listingDataRequestStatus?: any;
}

export interface ChallengeActivityListItemOwnProps {
  challengeID: string;
  even: boolean;
  user?: string;
}

export interface ResolvedChallengeActivityListItemProps {
  toggleSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

export interface ActivityListItemReduxProps {
  newsroom?: NewsroomState;
  charter?: CharterData;
  listing?: ListingWrapper;
  listingPhaseState?: any;
  challengeState?: any;
}

class MyTasksItemComponent extends React.Component<
  ActivityListItemOwnProps & ResolvedChallengeActivityListItemProps & ActivityListItemReduxProps & DispatchProp<any>
> {
  public async componentDidUpdate(): Promise<void> {
    if (!this.props.listing && !this.props.listingDataRequestStatus) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress!));
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.wrapper.data.charterHeader!));
    }
  }

  public async componentDidMount(): Promise<void> {
    if (!this.props.listing && !this.props.listingDataRequestStatus) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress!));
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.wrapper.data.charterHeader!));
    }
  }

  public render(): JSX.Element {
    const {
      listingAddress: address,
      listing,
      newsroom,
      listingPhaseState,
      charter,
      challengeID,
      userChallengeData,
    } = this.props;
    if (listing && listing.data && newsroom && listingPhaseState) {
      const newsroomData = newsroom.wrapper.data;
      let listingDetailURL = `/listing/${address}`;
      if (this.props.challenge) {
        listingDetailURL = `/listing/${address}/challenge/${this.props.challenge.challengeID}`;
      }
      const logoUrl = charter && charter.logoUrl;
      const props = {
        title: `${newsroomData.name} Challenge #${challengeID}`,
        logoUrl,
        listingDetailURL,
        ...listingPhaseState,
        ...userChallengeData,
      };

      if (
        (userChallengeData && userChallengeData.canUserCollect) ||
        (userChallengeData && userChallengeData.canUserRescue) ||
        (userChallengeData && userChallengeData.didUserCommit)
      ) {
        return (
          <DashboardActivityItemCommitVote {...props}>{this.renderActivityDetails()}</DashboardActivityItemCommitVote>
        );
      }

      return <></>;
    }

    return <></>;
  }

  private renderActivityDetails = (): JSX.Element => {
    console.log(this.props);
    const { challenge, listingPhaseState } = this.props;

    if (!listingPhaseState) {
      return <></>;
    }

    const {
      isAwaitingAppealRequest,
      inChallengeCommitVotePhase,
      inChallengeRevealPhase,
      isAwaitingAppealJudgement,
      isAwaitingAppealChallenge,
      canListingAppealBeResolved,
    } = listingPhaseState;

    if (inChallengeCommitVotePhase) {
      return <PhaseCountdownTimer phaseType={PHASE_TYPE_NAMES.CHALLENGE_COMMIT_VOTE} challenge={challenge} />;
    } else if (inChallengeRevealPhase) {
      return <PhaseCountdownTimer phaseType={PHASE_TYPE_NAMES.CHALLENGE_REVEAL_VOTE} challenge={challenge} />;
    } else if (isAwaitingAppealRequest) {
      return (
        <>
          <PhaseCountdownTimer phaseType={PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_REQUEST} challenge={challenge} />
          {challenge && <StyledDashbaordActvityItemSection><WinningChallengeResults challengeID={challenge.challengeID} /></StyledDashbaordActvityItemSection>}
        </>
      );
    } else if (challenge) {
      let label;
      if (isAwaitingAppealJudgement) {
        label = (
          <p>
            The results of this challenge's vote are under appeal and is awaiting a decision from The Civil Council.
          </p>
        );
      } else if (isAwaitingAppealChallenge) {
        const appeal = challenge.challenge.appeal;
        if (appeal && appeal.appealGranted) {
          label = <p>The results of this challenge's vote were appealed and overturned by The Civil Council.</p>;
        } else {
          label = <p>The results of this challenge's vote were appealed and upheld by The Civil Council.</p>;
        }
      } else if (canListingAppealBeResolved) {
        const appeal = challenge.challenge.appeal;

        if (appeal && appeal.appealGranted) {
          label = <p>The results of this challenge's vote were appealed and overturned by The Civil Council.</p>;
        } else {
          label = <p>The results of this challenge's vote were appealed and upheld by The Civil Council.</p>;
        }
      }
      return (
        <>
          {label}
          <WinningChallengeResults challengeID={challenge.challengeID} />
        </>
      );
    }

    return <></>;
  };
}

const makeMapStateToProps = () => {
  const getListing = makeGetListing();

  const mapStateToProps = (
    state: State,
    ownProps: ActivityListItemOwnProps,
  ): ActivityListItemReduxProps & ActivityListItemOwnProps => {
    const { newsrooms } = state;
    const { user, content } = state.networkDependent;
    const newsroom = ownProps.listingAddress ? newsrooms.get(ownProps.listingAddress) : undefined;
    const listing = getListing(state, ownProps);
    let charter;
    if (newsroom && newsroom.wrapper.data.charterHeader) {
      charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
    }
    let userAcct = ownProps.user;
    if (!userAcct) {
      userAcct = user.account.account;
    }

    return {
      newsroom,
      charter,
      listing,
      listingPhaseState: getListingPhaseState(listing),
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export const MyTasksItem = connect(makeMapStateToProps)(MyTasksItemComponent);

const makeChallengeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUnclaimedRewardAmount = makeGetUnclaimedRewardAmount();

  const mapStateToProps = (state: State, ownProps: ChallengeActivityListItemOwnProps): ActivityListItemOwnProps => {
    const listingAddress = getListingAddressByChallengeID(state, ownProps);
    const challenge = getChallenge(state, ownProps);
    const userChallengeData = getUserChallengeData(state, ownProps);
    const unclaimedRewardAmountBN = getUnclaimedRewardAmount(state, ownProps);
    const challengeState = getChallengeState(challenge!);
    const { even, user } = ownProps;
    const { listingsFetching } = state.networkDependent;
    let listingDataRequestStatus;
    if (listingAddress) {
      listingDataRequestStatus = listingsFetching.get(listingAddress.toString());
    }

    let unclaimedRewardAmount = "";
    if (unclaimedRewardAmountBN) {
      unclaimedRewardAmount = getFormattedTokenBalance(unclaimedRewardAmountBN);
    }

    return {
      listingAddress,
      challenge,
      challengeState,
      userChallengeData,
      unclaimedRewardAmount,
      even,
      user,
      listingDataRequestStatus,
    };
  };

  return mapStateToProps;
};

/**
 * Container that renders a listing associated with the specified `ChallengeID`
 */
export class ChallengeListingItemComponent extends React.Component<
  ChallengeActivityListItemOwnProps & ActivityListItemOwnProps
> {
  public render(): JSX.Element {
    return <MyTasksItem {...this.props} />;
  }
}

export default connect(makeChallengeMapStateToProps)(ChallengeListingItemComponent);
