import * as React from "react";
import { Link } from "react-router-dom";

import { canParamPropChallengeBeResolved, didParamPropChallengeSucceed } from "@joincivil/core";
import {
  UserVotingSummary,
  CHALLENGE_RESULTS_VOTE_TYPES,
  StyledDashbaordActvityItemSection,
  StyledDashbaordActvityItemSectionOuter,
  StyledDashbaordActvityItemHeader,
  StyledDashbaordActvityItemSectionInner,
  StyledChallengeSummarySection,
  StyledDashboardActivityItemAction,
  DashboardActivityProposalItemCTAButton,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { WinningChallengeResults } from "./WinningChallengeResults";
import { MyTasksProposalItemSubComponentProps } from "./MyTasksProposalItem";

const CurrentChallengeStateExplanation: React.SFC<MyTasksProposalItemSubComponentProps> = props => {
  const { challenge } = props;

  if (!challenge) {
    return <></>;
  }

  const isResolved = challenge.resolved;
  const canResolveChallenge = canParamPropChallengeBeResolved(challenge);
  const didChallengeSucceed = didParamPropChallengeSucceed(challenge);

  const currentProposalStatus = didChallengeSucceed ? "reject" : "approve";

  // The ordering of these cases is significant. Appeal Challenge, then Appeal, the Original Challenge states should be checked in that order to ensure the proper explanation is set.
  let explanation = <></>;
  if (canResolveChallenge || isResolved) {
    explanation = <p>The Civil Community voted to {currentProposalStatus} this parameter proposal.</p>;
  }

  return explanation;
};

const ChallengeSummary: React.SFC<MyTasksProposalItemSubComponentProps> = props => {
  const { challengeID, challenge, proposalUserChallengeData, showClaimRewardsTab, showRescueTokensTab } = props;

  if (!proposalUserChallengeData || !challenge) {
    return <></>;
  }

  const { canUserCollect, canUserRescue, choice, numTokens } = proposalUserChallengeData;

  let userVotingSummary;

  let userVotingSummaryContent;
  let userChoice;
  if (canUserCollect) {
    if (choice) {
      userChoice = choice.toNumber() === 1 ? CHALLENGE_RESULTS_VOTE_TYPES.REMAIN : CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
      userVotingSummaryContent = (
        <UserVotingSummary choice={userChoice} numTokens={getFormattedTokenBalance(numTokens!)} />
      );
    }
  } else if (canUserRescue) {
    userVotingSummaryContent = <>You did not reveal your vote</>;
  }
  userVotingSummary = (
    <StyledDashbaordActvityItemSection>
      <StyledDashbaordActvityItemHeader>Your Voting Summary</StyledDashbaordActvityItemHeader>
      <StyledDashbaordActvityItemSectionInner>{userVotingSummaryContent}</StyledDashbaordActvityItemSectionInner>
    </StyledDashbaordActvityItemSection>
  );

  let onCTAButtonClick;
  if (canUserCollect) {
    onCTAButtonClick = showClaimRewardsTab;
  } else if (canUserRescue) {
    onCTAButtonClick = showRescueTokensTab;
  }

  const buttonProps = {
    ...proposalUserChallengeData,
    propDetailURL: "/parameterizer",
    onClick: onCTAButtonClick,
  };

  return (
    <>
      <StyledDashbaordActvityItemSectionOuter>
        <StyledChallengeSummarySection>
          {userVotingSummary}

          <StyledDashbaordActvityItemSection>
            <StyledDashbaordActvityItemHeader>Community Voting Summary</StyledDashbaordActvityItemHeader>
            <StyledDashbaordActvityItemSectionInner>
              <WinningChallengeResults challengeID={challengeID} isProposalChallenge={true} />
            </StyledDashbaordActvityItemSectionInner>
          </StyledDashbaordActvityItemSection>
        </StyledChallengeSummarySection>

        <StyledDashboardActivityItemAction>
          <DashboardActivityProposalItemCTAButton {...buttonProps} />
          <Link to="/parameterizer">View details &gt;</Link>
        </StyledDashboardActivityItemAction>
      </StyledDashbaordActvityItemSectionOuter>
    </>
  );
};

const DashboardProposalItemChallengeDetails: React.SFC<MyTasksProposalItemSubComponentProps> = props => {
  const { challenge } = props;

  if (!challenge) {
    return <></>;
  }

  return (
    <>
      {<CurrentChallengeStateExplanation {...props} />}

      {<ChallengeSummary {...props} />}
    </>
  );
};

export default DashboardProposalItemChallengeDetails;
