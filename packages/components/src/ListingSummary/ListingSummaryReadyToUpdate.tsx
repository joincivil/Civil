import * as React from "react";
import { EthAddress, AppealData } from "@joincivil/core";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { TextCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import { ApplicationPhaseEndedLabelText, ApprovedLabelText, ChallengeEndedLabelText } from "./textComponents";
import {
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledBaseResultsBanner,
  StyledRejectedResultsBanner,
  MetaRow,
  MetaItemValue,
  MetaItemLabel,
  StyledChallengeResultsHeader,
  ChallengeResultsContain,
} from "./styledComponents";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export interface ListingSummaryReadyToUpdateComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export class ListingSummaryReadyToUpdateComponent extends React.Component<ListingSummaryReadyToUpdateComponentProps> {
  public render(): JSX.Element {
    const { challengeID, challengeStatementSummary, appealStatementSummary } = this.props;

    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary>
          {this.renderDecisionBanner()}

          <NewsroomInfo {...this.props} />

          {this.renderChallengeResults()}

          <StyledListingSummarySection>
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

  private renderChallengeResults = (): JSX.Element => {
    const {
      canBeWhitelisted,
      canResolveChallenge,
      canListingAppealBeResolved,
      canListingAppealChallengeBeResolved,
      challengeID,
      totalVotes,
      votesFor,
      votesAgainst,
      percentFor,
      percentAgainst,
      didListingChallengeSucceed,
    } = this.props;

    if (canBeWhitelisted || canResolveChallenge || canListingAppealBeResolved || canListingAppealChallengeBeResolved) {
      const challengeIDDisplay = !!challengeID ? `#${challengeID}` : "";
      return (
        <ChallengeResultsContain>
          <ChallengeResults
            headerText={`Challenge ${challengeIDDisplay} Results`}
            styledHeaderComponent={StyledChallengeResultsHeader}
            totalVotes={totalVotes!}
            votesFor={votesFor!}
            votesAgainst={votesAgainst!}
            percentFor={percentFor!}
            percentAgainst={percentAgainst!}
            didChallengeSucceed={didListingChallengeSucceed!}
          />
        </ChallengeResultsContain>
      );
    }

    return <></>;
  };
}
