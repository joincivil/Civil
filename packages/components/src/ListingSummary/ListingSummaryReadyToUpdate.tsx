import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import {
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledBaseResultsBanner,
  StyledRejectedResultsBanner,
} from "./styledComponents";
import ChallengeResults from "./ChallengeResults";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export interface ListingSummaryReadyToUpdateComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export class ListingSummaryReadyToUpdateComponent extends React.Component<ListingSummaryReadyToUpdateComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary>
          {this.renderDecisionBanner()}

          <NewsroomInfo {...this.props} />

          <ChallengeResults {...this.props} />

          <StyledListingSummarySection>
            <ChallengeOrAppealStatementSummary {...this.props} />
            <SummaryActionButton {...this.props} />
          </StyledListingSummarySection>
        </StyledListingSummary>
      </StyledListingSummaryContainer>
    );
  }

  private renderDecisionBanner = (): JSX.Element | undefined => {
    const { appeal, didListingChallengeSucceed, canBeWhitelisted } = this.props;
    let decisionText;

    if (appeal && appeal.appealGranted) {
      if (didListingChallengeSucceed) {
        // Challenge succeeded (newsroom rejected) and appeal was granted, so newsroom is accepted
        decisionText = (
          <StyledBaseResultsBanner>
            <HollowGreenCheck /> Appeal granted to accept Newsroom
          </StyledBaseResultsBanner>
        );
      } else {
        // Challenge failed (newsroom accepted) and appeal was granted, so newsroom is rejected
        decisionText = (
          <StyledRejectedResultsBanner>
            <HollowRedNoGood /> Appeal granted to reject Newsroom
          </StyledRejectedResultsBanner>
        );
      }
    } else if (didListingChallengeSucceed) {
      // Challenge succeeded (newsroom rejected)
      decisionText = (
        <StyledRejectedResultsBanner>
          <HollowRedNoGood /> Community voted to reject Newsroom
        </StyledRejectedResultsBanner>
      );
    } else if (canBeWhitelisted) {
      // Challenge failed (newsroom accepted)
      decisionText = (
        <StyledBaseResultsBanner>
          <HollowGreenCheck /> Newsroom application passed without challenge
        </StyledBaseResultsBanner>
      );
    } else if (!didListingChallengeSucceed) {
      // Challenge failed (newsroom accepted)
      decisionText = (
        <StyledBaseResultsBanner>
          <HollowGreenCheck /> Community voted to accept Newsroom
        </StyledBaseResultsBanner>
      );
    }

    return decisionText;
  };

}
