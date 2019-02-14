import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  ListingWrapper,
  WrappedChallengeData,
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
  getAppealChallenge,
  makeGetListingAddressByChallengeID,
  makeGetListingAddressByAppealChallengeID,
  getAppealChallengeParentChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
  getChallengeState,
  makeGetAppealChallengeState,
} from "../../selectors";
import { PhaseCountdownTimer } from "./PhaseCountdownTimer";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { getContent } from "../../redux/actionCreators/newsrooms";

import DashboardItemChallengeResults from "./ChallengeSummary";

export interface ActivityListItemOwnProps {
  listingAddress?: string;
  challengeID?: string;
  appealChallengeID?: string;
  // showClaimRewardsTab(): void;
  // showRescueTokensTab(): void;
}

export interface ActivityListItemReduxProps {
  newsroom?: NewsroomState;
  charter?: CharterData;
  listing?: ListingWrapper;
  listingDataRequestStatus?: any;
  challenge?: WrappedChallengeData;
  appealChallenge?: AppealChallengeData;
  challengeState?: any;
  userChallengeData?: UserChallengeData;
  user?: EthAddress;
}

class MyChallengesItemComponent extends React.Component<
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
      appealChallengeID,
      userChallengeData,
      challengeState,
      // showClaimRewardsTab,
      // showRescueTokensTab,
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
      const logoUrl = charter && charter.logoUrl;
      let title = newsroomData.name;
      // let onCTAButtonClick;
      if (appealChallengeID) {
        title = `${newsroomData.name} Appeal Challenge #${appealChallengeID}`;
      } else if (challengeID) {
        title = `${newsroomData.name} Challenge #${challengeID}`;
      }

      if (canUserCollect || canUserRescue) {
        viewDetailURL = `${listingDetailURL}/challenge/${challengeID}`;
      } else if (isAwaitingAppealJudgement) {
        viewDetailURL = listingDetailURL;
      }

      // if (canUserCollect) {
      //   onCTAButtonClick = showClaimRewardsTab;
      // } else if (canUserRescue) {
      //   onCTAButtonClick = showRescueTokensTab;
      // }

      const props = {
        title,
        logoUrl,
        listingDetailURL,
        viewDetailURL,
        // onClick: onCTAButtonClick,
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
    const { appealChallengeID, challenge, challengeState } = this.props;

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

    if (inCommitPhase && appealChallengeID) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_COMMIT_VOTE;
    } else if (inCommitPhase) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_COMMIT_VOTE;
      displayChallengeResults = false;
    } else if (inRevealPhase && appealChallengeID) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_REVEAL_VOTE;
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
  const getListingAddressByAppealChallengeID = makeGetListingAddressByAppealChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();
  const getAppealChallengeState = makeGetAppealChallengeState();

  const mapStateToProps = (
    state: State,
    ownProps: ActivityListItemOwnProps,
  ): ActivityListItemOwnProps & ActivityListItemReduxProps => {
    const { newsrooms } = state;
    const { user, content, listings, listingsFetching } = state.networkDependent;
    const userAcct = user && user.account.account;

    let listingAddress;
    let userChallengeData;
    let challenge;
    let appealChallenge;
    let challengeState;
    let challengeID = ownProps.challengeID;

    if (ownProps.appealChallengeID) {
      listingAddress = getListingAddressByAppealChallengeID(state, ownProps);
      userChallengeData = getUserAppealChallengeData(state, ownProps);
      appealChallenge = getAppealChallenge(state, ownProps);
      challengeState = getAppealChallengeState(state, ownProps);
      challengeID = getAppealChallengeParentChallengeID(state, ownProps);
    } else {
      listingAddress = getListingAddressByChallengeID(state, ownProps);
      userChallengeData = getUserChallengeData(state, ownProps);
      challenge = getChallenge(state, ownProps);
      challengeState = getChallengeState(challenge!);
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
      challengeID,
      challenge,
      appealChallenge,
      challengeState,
      userChallengeData,
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

export default connect(makeMapStateToProps)(MyChallengesItemComponent);
