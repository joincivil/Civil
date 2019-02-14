import * as React from "react";
import { Link } from "react-router-dom";

import {
  UserVotingSummary,
  CHALLENGE_RESULTS_VOTE_TYPES,
  StyledDashbaordActvityItemSection,
  StyledDashbaordActvityItemSectionOuter,
  StyledDashbaordActvityItemHeader,
  StyledDashbaordActvityItemSectionInner,
  StyledDashboardActivityItemSubTitle,
  StyledChallengeSummarySection,
  StyledDashboardActivityItemAction,
  DashboardActivityItemCTAButton,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { WinningChallengeResults } from "./WinningChallengeResults";
import { ActivityListItemOwnProps, ActivityListItemReduxProps } from "./MyTasksItem";

interface AppealDecisionTextProps {
  currentNewsroomStatusPastTense: string;
  councilDecision: string;
}

const AppealDecisionText: React.SFC<AppealDecisionTextProps> = props => {
  return (
    <p>
      The Civil Council {props.currentNewsroomStatusPastTense} this newsroom, {props.councilDecision}ing the Community's
      vote.
    </p>
  );
};

const CurrentChallengeStateExplanation: React.SFC<ActivityListItemOwnProps & ActivityListItemReduxProps> = props => {
  const { appeal, appealChallenge, appealChallengeState, challengeState } = props;

  if (!challengeState) {
    return <></>;
  }

  const {
    isResolved,
    canResolveChallenge,
    canRequestAppeal,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    canAppealBeResolved,
    didChallengeSucceed,
    isAppealChallengeInCommitStage,
    isAppealChallengeInRevealStage,
  } = challengeState;

  let canAppealChallengeBeResolved;
  if (appealChallenge && appealChallengeState) {
    canAppealChallengeBeResolved = appealChallengeState.canResolveChallenge;
  }

  const isAppealGranted = !!appeal && appeal.appealGranted;
  const isAppealChallengeSuccess =
    !!appealChallenge && !!appealChallengeState && appealChallengeState.didAppealChallengeSucceed;

  const currentNewsroomStatus = didChallengeSucceed ? "reject" : "approve";
  const currentNewsroomStatusPastTense = didChallengeSucceed ? "rejected" : "approved";
  const councilDecision = isAppealGranted ? "overturn" : "uphold";
  const appealChallengeResult = isAppealChallengeSuccess ? "overturn" : "uphold";

  // The ordering of these cases is significant. Appeal Challenge, then Appeal, the Original Challenge states should be checked in that order to ensure the proper explanation is set.
  let explanation = <></>;
  switch (true) {
    case canAppealChallengeBeResolved || (appealChallenge && appealChallenge.resolved):
      explanation = (
        <p>
          The Civil Community voted to {currentNewsroomStatus} this newsroom, {appealChallengeResult}ing the Civil
          Council's decision.
        </p>
      );
      break;

    case isAppealChallengeInCommitStage || isAppealChallengeInRevealStage:
      explanation = <p>The Civil Council's decision to {currentNewsroomStatus} this newsroom has been challenged.</p>;
      break;

    case isAwaitingAppealChallenge || canAppealBeResolved:
      explanation = <AppealDecisionText {...{ currentNewsroomStatusPastTense, councilDecision }} />;
      break;

    case isAwaitingAppealJudgement:
      explanation = (
        <p>The results of this challenge's vote are under appeal and awaiting a decision from The Civil Council.</p>
      );
      break;

    case isResolved && !!appeal:
      explanation = (
        <p>
          The Civil Council {currentNewsroomStatusPastTense} this newsroom via the appeal process, {councilDecision}ing
          the Community's vote.
        </p>
      );
      break;

    case canResolveChallenge || canRequestAppeal || isResolved:
      explanation = <p>The Civil Community voted to {currentNewsroomStatus} this newsroom.</p>;
      break;
  }

  return explanation;
};

const AppealSummary: React.SFC<ActivityListItemOwnProps & ActivityListItemReduxProps> = props => {
  const { appeal, challengeState } = props;
  const { didChallengeOriginallySucceed } = challengeState;

  let currentNewsroomStatusPastTense;
  if (appeal && appeal.appealGranted) {
    currentNewsroomStatusPastTense = didChallengeOriginallySucceed ? "approved" : "rejected";
  } else {
    currentNewsroomStatusPastTense = didChallengeOriginallySucceed ? "rejected" : "approved";
  }

  const councilDecision = appeal && appeal.appealGranted ? "overturn" : "uphold";

  return (
    <StyledDashbaordActvityItemSectionOuter>
      <StyledDashbaordActvityItemSection>
        <StyledDashbaordActvityItemHeader>Appeal Summary</StyledDashbaordActvityItemHeader>
        <StyledDashbaordActvityItemSectionInner>
          <AppealDecisionText {...{ currentNewsroomStatusPastTense, councilDecision }} />
        </StyledDashbaordActvityItemSectionInner>
      </StyledDashbaordActvityItemSection>
      <StyledDashboardActivityItemAction />
    </StyledDashbaordActvityItemSectionOuter>
  );
};

const UserAppealChallengeSummary: React.SFC<ActivityListItemOwnProps & ActivityListItemReduxProps> = props => {
  const { appealChallenge, appealChallengeState, appealUserChallengeData } = props;

  if (!appealChallenge || !appealChallengeState) {
    return <></>;
  }

  let userVotingSummaryContent = <></>;
  const { isResolved } = appealChallengeState;

  if (!isResolved) {
    return <></>;
  }

  if (appealUserChallengeData) {
    const { didUserCommit, didUserReveal, choice, numTokens } = appealUserChallengeData;
    let userChoice;

    if (!didUserCommit) {
      userVotingSummaryContent = <>You did not vote on this Appeal Challenge</>;
    } else if (didUserReveal) {
      if (choice) {
        userChoice =
          choice.toNumber() === 1 ? CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD : CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN;
        userVotingSummaryContent = (
          <UserVotingSummary choice={userChoice} numTokens={getFormattedTokenBalance(numTokens!)} />
        );
      }
    } else {
      userVotingSummaryContent = <>You did not reveal your vote</>;
    }
  }

  return (
    <StyledDashbaordActvityItemSection>
      <StyledDashbaordActvityItemHeader>Your Voting Summary</StyledDashbaordActvityItemHeader>
      <StyledDashbaordActvityItemSectionInner>{userVotingSummaryContent}</StyledDashbaordActvityItemSectionInner>
    </StyledDashbaordActvityItemSection>
  );
};

const DashboardItemChallengeResults: React.SFC<ActivityListItemOwnProps & ActivityListItemReduxProps> = props => {
  const {
    listingAddress,
    appeal,
    appealChallengeID,
    appealChallenge,
    appealChallengeState,
    appealUserChallengeData,
    challengeID,
    challengeState,
    userChallengeData,
    showClaimRewardsTab,
    showRescueTokensTab,
  } = props;

  if (!challengeState) {
    return <></>;
  }

  const listingDetailURL = `/listing/${listingAddress}`;
  let viewDetailURL;

  const {
    isResolved,
    canResolveChallenge,
    canRequestAppeal,
    isAwaitingAppealJudgement,
    isAppealChallengeInCommitStage,
    isAppealChallengeInRevealStage,
  } = challengeState;

  let userVotingSummary;
  let displayChallengeResultsExplanation;

  if (canRequestAppeal || isAppealChallengeInCommitStage || isAppealChallengeInRevealStage) {
    displayChallengeResultsExplanation = true;
  }

  if (userChallengeData && (isResolved || canResolveChallenge)) {
    const { didUserReveal, choice, numTokens } = userChallengeData;
    let userVotingSummaryContent;
    let userChoice;
    if (didUserReveal) {
      if (choice) {
        userChoice =
          choice.toNumber() === 1 ? CHALLENGE_RESULTS_VOTE_TYPES.REMAIN : CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
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

  let appealWinningChallengeResults;
  if (appealChallengeID && appealChallenge) {
    viewDetailURL = listingDetailURL;
    let onAppealChallengeCTAButtonClick;

    if (appealUserChallengeData) {
      const { canUserCollect: appealCanUserCollect, canUserRescue: appealCanUserRescue } = appealUserChallengeData!;

      if (appealCanUserCollect || appealCanUserRescue) {
        viewDetailURL = `${listingDetailURL}/challenge/${challengeID}`;
      } else if (isAwaitingAppealJudgement) {
        viewDetailURL = listingDetailURL;
      }

      if (appealCanUserCollect) {
        onAppealChallengeCTAButtonClick = showClaimRewardsTab;
      } else if (appealCanUserRescue) {
        onAppealChallengeCTAButtonClick = showRescueTokensTab;
      }
    }

    const appealChallengeButtonProps = {
      listingDetailURL,
      viewDetailURL,
      onClick: onAppealChallengeCTAButtonClick,
      ...appealChallengeState,
      ...appealUserChallengeData,
    };

    appealWinningChallengeResults = (
      <StyledDashbaordActvityItemSectionOuter>
        <StyledChallengeSummarySection>
          {<UserAppealChallengeSummary {...props} />}

          <StyledDashbaordActvityItemSection>
            <StyledDashbaordActvityItemHeader>Community Voting Summary</StyledDashbaordActvityItemHeader>
            <StyledDashbaordActvityItemSectionInner>
              <WinningChallengeResults
                appealChallengeID={appealChallengeID}
                displayExplanation={displayChallengeResultsExplanation}
              />
            </StyledDashbaordActvityItemSectionInner>
          </StyledDashbaordActvityItemSection>
        </StyledChallengeSummarySection>

        <StyledDashboardActivityItemAction>
          <DashboardActivityItemCTAButton {...appealChallengeButtonProps} />
        </StyledDashboardActivityItemAction>
      </StyledDashbaordActvityItemSectionOuter>
    );
  }

  viewDetailURL = listingDetailURL;
  let onCTAButtonClick;

  const { canUserCollect, canUserRescue } = userChallengeData!;

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

  const buttonProps = {
    listingDetailURL,
    viewDetailURL,
    onClick: onCTAButtonClick,
    ...challengeState,
    ...userChallengeData,
  };

  return (
    <>
      {<CurrentChallengeStateExplanation {...props} />}

      <StyledDashbaordActvityItemSectionOuter>
        <StyledChallengeSummarySection>
          {userVotingSummary}

          <StyledDashbaordActvityItemSection>
            <StyledDashbaordActvityItemHeader>Community Voting Summary</StyledDashbaordActvityItemHeader>
            <StyledDashbaordActvityItemSectionInner>
              <WinningChallengeResults
                challengeID={challengeID}
                displayExplanation={displayChallengeResultsExplanation}
              />
            </StyledDashbaordActvityItemSectionInner>
          </StyledDashbaordActvityItemSection>
        </StyledChallengeSummarySection>

        <StyledDashboardActivityItemAction>
          <DashboardActivityItemCTAButton {...buttonProps} />

          {viewDetailURL && <Link to={viewDetailURL}>View details &gt;</Link>}
        </StyledDashboardActivityItemAction>
      </StyledDashbaordActvityItemSectionOuter>

      {appeal && <AppealSummary {...props} />}

      {appealChallenge && (
        <StyledDashboardActivityItemSubTitle>Appeal Challenge #{appealChallengeID}</StyledDashboardActivityItemSubTitle>
      )}
      {appealWinningChallengeResults}
    </>
  );
};

export default DashboardItemChallengeResults;
