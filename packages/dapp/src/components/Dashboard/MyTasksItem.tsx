import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  ListingWrapper,
  WrappedChallengeData,
  AppealData,
  AppealChallengeData,
  UserChallengeData,
  CharterData,
  EthAddress,
} from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { DashboardActivityItemTask, PHASE_TYPE_NAMES } from "@joincivil/components";
import { State } from "../../redux/reducers";
import { ListingWrapperWithExpiry } from "../../redux/reducers/listings";
import {
  getChallenge,
  makeGetListingAddressByChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
  getChallengeState,
  getAppealChallengeState,
} from "../../selectors";
import { PhaseCountdownTimer } from "./PhaseCountdownTimer";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { getContent } from "../../redux/actionCreators/newsrooms";

import DashboardItemChallengeResults from "./ChallengeSummary";

export interface ActivityListItemOwnProps {
  challengeID?: string;
  showClaimRewardsTab?(): void;
  showRescueTokensTab?(): void;
}

export interface ActivityListItemReduxProps {
  challenge?: WrappedChallengeData;
  challengeState?: any;
  userChallengeData?: UserChallengeData;
  appeal?: AppealData;
  appealChallengeID?: string;
  appealChallenge?: AppealChallengeData;
  appealChallengeState?: any;
  appealUserChallengeData?: UserChallengeData;
  user?: EthAddress;
  newsroom?: NewsroomState;
  charter?: CharterData;
  listingAddress?: string;
  listing?: ListingWrapper;
  listingDataRequestStatus?: any;
}

class MyTasksItemComponent extends React.Component<
  ActivityListItemOwnProps & ActivityListItemReduxProps & DispatchProp<any>
> {
  public async componentDidUpdate(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public async componentDidMount(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public render(): JSX.Element {
    const {
      listingAddress: address,
      listing,
      newsroom,
      charter,
      challengeID,
      userChallengeData,
      challengeState,
      showClaimRewardsTab,
      showRescueTokensTab,
    } = this.props;

    if (!userChallengeData || !challengeState) {
      return <></>;
    }

    const { canUserCollect, canUserRescue, didUserCommit } = userChallengeData;
    const { isAwaitingAppealJudgement } = challengeState;

    if (listing && listing.data && newsroom) {
      const newsroomData = newsroom.wrapper.data;
      const listingDetailURL = `/listing/${address}`;
      let viewDetailURL = listingDetailURL;
      const title = `${newsroomData.name} Challenge #${challengeID}`;
      const logoUrl = charter && charter.logoUrl;
      let onCTAButtonClick;

      if (canUserCollect || canUserRescue) {
        viewDetailURL = `${listingDetailURL}/challenge/${challengeID}`;
      } else if (isAwaitingAppealJudgement) {
        viewDetailURL = listingDetailURL;
      }

      if (canUserCollect) {
        onCTAButtonClick = showClaimRewardsTab;
      } else if (canUserRescue) {
        onCTAButtonClick = showRescueTokensTab;
      }

      const props = {
        title,
        logoUrl,
        listingDetailURL,
        viewDetailURL,
        onClick: onCTAButtonClick,
        ...challengeState,
        ...userChallengeData,
      };

      if (canUserCollect || canUserRescue || didUserCommit) {
        return <DashboardActivityItemTask {...props}>{this.renderActivityDetails()}</DashboardActivityItemTask>;
      }
    }

    return <></>;
  }

  private ensureListingAndNewsroomData = async (): Promise<void> => {
    if (!this.props.listing && !this.props.listingDataRequestStatus && this.props.listingAddress) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress!));
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.wrapper.data.charterHeader!));
    }
  };

  private renderActivityDetails = (): JSX.Element => {
    const { challenge, challengeState } = this.props;

    if (!challengeState) {
      return <></>;
    }

    const {
      // isResolved,
      inCommitPhase,
      inRevealPhase,
      // canResolveChallenge,
      canRequestAppeal,
      isAwaitingAppealJudgement,
      isAwaitingAppealChallenge,
      // canAppealBeResolved,
      // didChallengeOriginallySucceed,
      isAppealChallengeInCommitStage,
      isAppealChallengeInRevealStage,
    } = challengeState;

    let phaseCountdownType;
    let challengeResults;
    let displayChallengeResults = true;

    if (inCommitPhase) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_COMMIT_VOTE;
      displayChallengeResults = false;
    } else if (inRevealPhase) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_REVEAL_VOTE;
      displayChallengeResults = false;
    } else if (canRequestAppeal) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_REQUEST;
    } else if (isAwaitingAppealJudgement) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_JUDGEMENT;
    } else if (isAwaitingAppealChallenge) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_CHALLENGE;
    } else if (isAppealChallengeInCommitStage) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_COMMIT_VOTE;
    } else if (isAppealChallengeInRevealStage) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_REVEAL_VOTE;
    }

    challengeResults = <DashboardItemChallengeResults {...this.props} />;

    return (
      <>
        {phaseCountdownType && <PhaseCountdownTimer phaseType={phaseCountdownType} challenge={challenge} />}
        {displayChallengeResults && challengeResults}
      </>
    );
  };
}

const makeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: ActivityListItemOwnProps,
  ): ActivityListItemOwnProps & ActivityListItemReduxProps => {
    const { newsrooms } = state;
    const { user, content, listings, listingsFetching } = state.networkDependent;
    const userAcct = user && user.account.account;

    const listingAddress = getListingAddressByChallengeID(state, ownProps);
    const challenge = getChallenge(state, ownProps);
    const challengeState = getChallengeState(challenge!);
    const userChallengeData = getUserChallengeData(state, ownProps);

    const appeal = challenge && challenge.challenge.appeal;
    const appealChallengeID = appeal && appeal.appealChallengeID && appeal.appealChallengeID.toString();
    const appealChallenge = appeal && appeal.appealChallenge;

    let appealChallengeState;
    let appealUserChallengeData;
    if (appealChallenge) {
      appealChallengeState = getAppealChallengeState(appealChallenge);
      appealUserChallengeData = getUserAppealChallengeData(state, ownProps);
    }

    const listing = (listingAddress && listings.get(listingAddress)) as ListingWrapperWithExpiry | undefined;
    const newsroom = listingAddress ? newsrooms.get(listingAddress) : undefined;
    let charter;
    if (newsroom && newsroom.wrapper.data.charterHeader) {
      charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
    }
    let listingDataRequestStatus;
    if (listingAddress) {
      listingDataRequestStatus = listingsFetching.get(listingAddress.toString());
    }

    return {
      listingAddress,
      challenge,
      challengeState,
      userChallengeData,
      appeal,
      appealChallengeID,
      appealChallenge,
      appealChallengeState,
      appealUserChallengeData,
      user: userAcct,
      listingDataRequestStatus,
      newsroom,
      charter,
      listing: listing && listing.listing,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(MyTasksItemComponent);
