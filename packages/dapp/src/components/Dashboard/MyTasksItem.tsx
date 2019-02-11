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
import {
  DashboardActivityItemTask,
  PHASE_TYPE_NAMES,
  UserVotingSummary,
  CHALLENGE_RESULTS_VOTE_TYPES,
  StyledDashbaordActvityItemSection,
  StyledDashbaordActvityItemHeader,
  StyledDashbaordActvityItemSectionInner,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
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
import { WinningChallengeResults } from "./WinningChallengeResults";
import { PhaseCountdownTimer } from "./PhaseCountdownTimer";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { getContent } from "../../redux/actionCreators/newsrooms";

export interface ActivityListItemOwnProps {
  listingAddress?: string;
  challengeID?: string;
  appealChallengeID?: string;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
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
      appealChallengeID,
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
      let viewDetailURL;
      const logoUrl = charter && charter.logoUrl;
      let title = newsroomData.name;
      let onCTAButtonClick;
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
    const { appealChallengeID, challengeID, challenge, challengeState, userChallengeData } = this.props;

    if (!challengeState) {
      return <></>;
    }

    const {
      isResolved,
      inCommitPhase,
      inRevealPhase,
      // canResolveChallenge,
      canRequestAppeal,
      isAwaitingAppealJudgement,
      isAwaitingAppealChallenge,
      canAppealBeResolved,
      didChallengeOriginallySucceed,
      isAppealChallengeInCommitStage,
      isAppealChallengeInRevealStage,
    } = challengeState;

    let phaseCountdownType;
    let challengeResults;
    let displayChallengeResultsExplanation;
    let label;
    let displayChallengeResults = true;

    if (inCommitPhase && appealChallengeID) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_COMMIT_VOTE;
      displayChallengeResultsExplanation = true;
    } else if (inCommitPhase) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_COMMIT_VOTE;
      displayChallengeResults = false;
    } else if (inRevealPhase && appealChallengeID) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_REVEAL_VOTE;
      displayChallengeResultsExplanation = true;
    } else if (inRevealPhase) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_REVEAL_VOTE;
      displayChallengeResults = false;
    } else if (canRequestAppeal) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_REQUEST;
      displayChallengeResultsExplanation = true;
    } else if (isAwaitingAppealJudgement) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_JUDGEMENT;
      label = (
        <p>The results of this challenge's vote are under appeal and awaiting a decision from The Civil Council.</p>
      );
    } else if (isAwaitingAppealChallenge || canAppealBeResolved) {
      const appeal = challenge && challenge.challenge && challenge.challenge.appeal;

      if (isAwaitingAppealChallenge) {
        phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_CHALLENGE;
      }

      let appealDecision;
      if (appeal && appeal.appealGranted) {
        appealDecision = didChallengeOriginallySucceed ? "approve" : "reject";
        label = <p>The Civil Coucil voted to {appealDecision} this newsroom, overturning the Community's vote.</p>;
      } else {
        appealDecision = didChallengeOriginallySucceed ? "reject" : "approve";
        label = <p>The Civil Coucil voted to {appealDecision} this newsroom, upholding the Community's vote.</p>;
      }
    } else if (isAppealChallengeInCommitStage || isAppealChallengeInRevealStage) {
      const appeal = challenge && challenge.challenge && challenge.challenge.appeal;

      if (isAppealChallengeInCommitStage) {
        phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_COMMIT_VOTE;
      } else if (isAppealChallengeInRevealStage) {
        phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_REVEAL_VOTE;
      }

      let appealDecision;
      if (appeal && appeal.appealGranted) {
        appealDecision = didChallengeOriginallySucceed ? "approve" : "reject";
      } else {
        appealDecision = didChallengeOriginallySucceed ? "reject" : "approve";
      }
      label = <p>The Civil Council's decision to {appealDecision} this newsroom has been challenged.</p>;
    }

    let userVotingSummary;
    if (userChallengeData && isResolved) {
      const { didUserReveal, choice, numTokens } = userChallengeData;
      let userVotingSummaryContent;
      let userChoice;
      if (didUserReveal) {
        if (choice) {
          if (appealChallengeID) {
            userChoice =
              choice.toNumber() === 1 ? CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN : CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD;
          } else {
            userChoice =
              choice.toNumber() === 1 ? CHALLENGE_RESULTS_VOTE_TYPES.REMAIN : CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
          }
          userVotingSummaryContent = (
            <UserVotingSummary choice={userChoice} numTokens={getFormattedTokenBalance(numTokens!)} />
          );
        }
      } else {
        userVotingSummaryContent = <>You did not reveal your vote</>;
      }
      userVotingSummary = (
        <StyledDashbaordActvityItemSection>
          <StyledDashbaordActvityItemHeader>Your Voting Summary</StyledDashbaordActvityItemHeader>
          <StyledDashbaordActvityItemSectionInner>{userVotingSummaryContent}</StyledDashbaordActvityItemSectionInner>
        </StyledDashbaordActvityItemSection>
      );
    }

    challengeResults = (
      <>
        {label}
        {userVotingSummary}
        <StyledDashbaordActvityItemSection>
          <StyledDashbaordActvityItemHeader>Community Voting Summary</StyledDashbaordActvityItemHeader>
          <StyledDashbaordActvityItemSectionInner>
            <WinningChallengeResults
              challengeID={challengeID}
              appealChallengeID={appealChallengeID}
              displayExplanation={displayChallengeResultsExplanation}
            />
          </StyledDashbaordActvityItemSectionInner>
        </StyledDashbaordActvityItemSection>
      </>
    );

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

export default connect(makeMapStateToProps)(MyTasksItemComponent);
