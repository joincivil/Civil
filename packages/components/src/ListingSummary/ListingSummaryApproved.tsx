import * as React from "react";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { TextCountdownTimer } from "../PhaseCountdown/";
import { ListingSummaryComponentProps } from "./types";
import {
  MetaRow,
  MetaItemValue,
  MetaItemLabel,
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledUnderChallengeBanner,
} from "./styledComponents";
import {
  ApplicationPhaseEndedLabelText,
  ApprovedLabelText,
  ChallengeEndedLabelText,
  UnderChallengeBannerText,
} from "./textComponents";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import ListingPhaseLabel from "./ListingPhaseLabel";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export class ListingSummaryApprovedComponent extends React.Component<ListingSummaryComponentProps> {
  public render(): JSX.Element {
    const { challengeID, challengeStatementSummary, appealStatementSummary } = this.props;

    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary hasTopPadding={!challengeID}>
          {challengeID && (
            <StyledUnderChallengeBanner>
              <UnderChallengeBannerText />
            </StyledUnderChallengeBanner>
          )}
          <ListingPhaseLabel {...this.props} />

          <NewsroomInfo {...this.props} />

          <StyledListingSummarySection>
            <ChallengeOrAppealStatementSummary
              challengeID={challengeID}
              challengeStatementSummary={challengeStatementSummary}
              appealStatementSummary={appealStatementSummary}
            />
            {this.renderPhaseCountdownOrTimestamp()}

            <SummaryActionButton {...this.props} />
          </StyledListingSummarySection>
        </StyledListingSummary>
      </StyledListingSummaryContainer>
    );
  }

  private renderPhaseCountdown = (): JSX.Element | undefined => {
    let expiry: number | undefined;
    const {
      isInApplication,
      inChallengeCommitVotePhase,
      inChallengeRevealPhase,
      isAwaitingAppealRequest,
      isAwaitingAppealJudgement,
      isAwaitingAppealChallenge,
    } = this.props;
    if (isInApplication) {
      expiry = this.props.appExpiry;
    } else if (inChallengeCommitVotePhase) {
      expiry = this.props.commitEndDate;
    } else if (inChallengeRevealPhase) {
      expiry = this.props.revealEndDate;
    } else if (isAwaitingAppealRequest) {
      expiry = this.props.requestAppealExpiry;
    } else if (isAwaitingAppealJudgement) {
      expiry = this.props.appealPhaseExpiry;
    } else if (isAwaitingAppealChallenge) {
      expiry = this.props.appealOpenToChallengeExpiry;
    }

    const warn = this.props.inChallengeCommitVotePhase || this.props.inChallengeRevealPhase;

    if (expiry) {
      return <TextCountdownTimer endTime={expiry!} warn={warn} />;
    }

    return;
  };

  /**
   * Renders a human-readable timestamp for phases that have no expiry
   */
  private renderTimestamp = (): JSX.Element | undefined => {
    let timestamp: number = 0;
    let LabelTextComponent: React.SFC = () => <></>;

    // Unchallenged application
    if (this.props.canBeWhitelisted && this.props.appExpiry) {
      timestamp = this.props.appExpiry;
      LabelTextComponent = ApplicationPhaseEndedLabelText;
      // Resolve Challenge
    } else if (this.props.canResolveChallenge && this.props.revealEndDate) {
      timestamp = this.props.revealEndDate;
      LabelTextComponent = ChallengeEndedLabelText;
      // Resolve Appeal Challenge
    } else if (this.props.canResolveAppealChallenge && this.props.appealChallengeRevealEndDate) {
      timestamp = this.props.appealChallengeRevealEndDate;
      LabelTextComponent = ChallengeEndedLabelText;
      // Whitelisted and not Under Challenge
    } else if (this.props.isWhitelisted && !this.props.isUnderChallenge && this.props.whitelistedTimestamp) {
      timestamp = this.props.whitelistedTimestamp;
      LabelTextComponent = ApprovedLabelText;
    }

    if (!!timestamp) {
      const timestampStrings: [string, string] = getLocalDateTimeStrings(timestamp);
      return (
        <MetaRow>
          <MetaItemLabel>
            <LabelTextComponent />
          </MetaItemLabel>
          <MetaItemValue>
            {timestampStrings![0]} {timestampStrings![1]}
          </MetaItemValue>
        </MetaRow>
      );
    }

    return;
  };

  private renderPhaseCountdownOrTimestamp = (): JSX.Element | undefined => {
    const { isInApplication, inChallengeCommitVotePhase, inChallengeRevealPhase, isAwaitingAppealRequest } = this.props;
    if (isInApplication || inChallengeCommitVotePhase || inChallengeRevealPhase || isAwaitingAppealRequest) {
      return this.renderPhaseCountdown();
    } else {
      return this.renderTimestamp();
    }
  };
}
