import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummary, StyledListingSummarySection, StyledAppealJudgementContainer } from "./styledComponents";
import ListingSummaryBase from "./ListingSummaryBase";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export const ListingSummaryComponent: React.SFC<ListingSummaryComponentProps> = props => {
  const { challengeID, challengeStatementSummary, appealStatementSummary } = props;

  const renderAppealJudgement = (): JSX.Element => {
    const { appeal, didChallengeOriginallySucceed } = props;
    if (!appeal || !appeal.appealGranted) {
      return <></>;
    }

    let decisionText;

    // Challenge succeeded (newsroom rejected) and appeal was granted, so newsroom is accepted
    if (didChallengeOriginallySucceed) {
      decisionText = (
        <>
          <HollowGreenCheck /> Appeal granted to accept Newsroom
        </>
      );
      // Challenge failed (newsroom accepted) and appeal was granted, so newsroom is rejected
    } else {
      decisionText = (
        <>
          <HollowRedNoGood /> Appeal granted to reject Newsroom
        </>
      );
    }

    return <StyledAppealJudgementContainer>{decisionText}</StyledAppealJudgementContainer>;
  };

  return (
    <ListingSummaryBase {...props}>
      <StyledListingSummary hasTopPadding={true}>
        {renderAppealJudgement()}

        <NewsroomInfo {...props} />

        <StyledListingSummarySection>
          <ChallengeOrAppealStatementSummary
            challengeID={challengeID}
            challengeStatementSummary={challengeStatementSummary}
            appealStatementSummary={appealStatementSummary}
          />

          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </ListingSummaryBase>
  );
};
