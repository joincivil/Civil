import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { ListingSummaryComponentProps } from "./types";
import {
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledAppealJudgementContainer,
} from "./styledComponents";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export class ListingSummaryComponent extends React.Component<ListingSummaryComponentProps> {
  public render(): JSX.Element {
    const { challengeID, challengeStatementSummary, appealStatementSummary } = this.props;

    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary hasTopPadding={true}>
          {this.renderAppealJudgement()}

          <NewsroomInfo {...this.props} />

          <StyledListingSummarySection>
            <ChallengeOrAppealStatementSummary
              challengeID={challengeID}
              challengeStatementSummary={challengeStatementSummary}
              appealStatementSummary={appealStatementSummary}
            />

            <SummaryActionButton {...this.props} />
          </StyledListingSummarySection>
        </StyledListingSummary>
      </StyledListingSummaryContainer>
    );
  }

  private renderAppealJudgement = (): JSX.Element => {
    const { appeal, didChallengeOriginallySucceed } = this.props;
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
}
