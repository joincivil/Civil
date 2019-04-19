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
import { MyTasksItemSubComponentProps } from "./MyTasksItem";

interface AppealDecisionTextProps {
  currentNewsroomStatusPastTense: string;
  councilDecision: string;
}

const AppealDecisionText: React.FunctionComponent<AppealDecisionTextProps> = props => {
  return (
    <p>
      The Civil Council {props.currentNewsroomStatusPastTense} this newsroom, {props.councilDecision}ing the Community's
      vote.
    </p>
  );
};

const CurrentChallengeStateExplanation: React.FunctionComponent<MyTasksItemSubComponentProps> = props => {
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

const AppealSummary: React.FunctionComponent<MyTasksItemSubComponentProps> = props => {
  const { appeal, challengeState } = props;
  const { didChallengeOriginallySucceed, canRequestAppeal, isAwaitingAppealJudgement } = challengeState;

  let councilDecision;
  let currentNewsroomStatusPastTense;
  if (appeal && appeal.appealGranted) {
    councilDecision = "overturn";
    currentNewsroomStatusPastTense = didChallengeOriginallySucceed ? "approved" : "rejected";
  } else if (appeal && !isAwaitingAppealJudgement) {
    councilDecision = "uphold";
    currentNewsroomStatusPastTense = didChallengeOriginallySucceed ? "rejected" : "approved";
  }

  if (!councilDecision || canRequestAppeal) {
    return <></>;
  }

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

const UserAppealChallengeSummary: React.FunctionComponent<MyTasksItemSubComponentProps> = props => {
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

const AppealChallengeSummary: React.FunctionComponent<MyTasksItemSubComponentProps> = props => {
  const {
    appealChallengeID,
    appealChallenge,
    appealChallengeState,
    appealUserChallengeData,
    showClaimRewardsTab,
    showRescueTokensTab,
    listingDetailURL,
  } = props;

  let appealWinningChallengeResults;
  if (appealChallengeID && appealChallenge) {
    let onAppealChallengeCTAButtonClick;

    if (appealUserChallengeData) {
      const { canUserCollect: appealCanUserCollect, canUserRescue: appealCanUserRescue } = appealUserChallengeData!;

      if (appealCanUserCollect) {
        onAppealChallengeCTAButtonClick = showClaimRewardsTab;
      } else if (appealCanUserRescue) {
        onAppealChallengeCTAButtonClick = showRescueTokensTab;
      }
    }

    const appealChallengeButtonProps = {
      listingDetailURL,
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
              <WinningChallengeResults appealChallengeID={appealChallengeID} displayExplanation={true} />
            </StyledDashbaordActvityItemSectionInner>
          </StyledDashbaordActvityItemSection>
        </StyledChallengeSummarySection>

        <StyledDashboardActivityItemAction>
          <DashboardActivityItemCTAButton {...appealChallengeButtonProps} />
        </StyledDashboardActivityItemAction>
      </StyledDashbaordActvityItemSectionOuter>
    );
  }

  return (
    <>
      {appealChallenge && (
        <StyledDashboardActivityItemSubTitle>Appeal Challenge #{appealChallengeID}</StyledDashboardActivityItemSubTitle>
      )}
      {appealWinningChallengeResults}
    </>
  );
};

const ChallengeSummary: React.FunctionComponent<MyTasksItemSubComponentProps> = props => {
  const {
    challengeID,
    challengeState,
    userChallengeData,
    showClaimRewardsTab,
    showRescueTokensTab,
    listingDetailURL,
    viewDetailURL,
  } = props;

  if (!challengeState) {
    return <></>;
  }

  const {
    isResolved,
    canResolveChallenge,
    canRequestAppeal,
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

  const { canUserCollect, canUserRescue } = userChallengeData!;

  let onCTAButtonClick;
  if (canUserCollect) {
    onCTAButtonClick = showClaimRewardsTab;
  } else if (canUserRescue) {
    onCTAButtonClick = showRescueTokensTab;
  }

  const buttonProps = {
    listingDetailURL,
    onClick: onCTAButtonClick,
    ...challengeState,
    ...userChallengeData,
  };

  return (
    <>
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
    </>
  );
};

const DashboardItemChallengeDetails: React.FunctionComponent<MyTasksItemSubComponentProps> = props => {
  const { appeal, appealChallenge, challenge } = props;

  if (!challenge) {
    return <></>;
  }

  return (
    <>
      {<CurrentChallengeStateExplanation {...props} />}

      {<ChallengeSummary {...props} />}

      {appeal && <AppealSummary {...props} />}

      {appealChallenge && <AppealChallengeSummary {...props} />}
    </>
  );
};

export default DashboardItemChallengeDetails;
