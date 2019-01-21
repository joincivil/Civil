import * as React from "react";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { TextCountdownTimer } from "../PhaseCountdown/";
import { ListingSummaryComponentProps } from "./types";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import {
  MetaRow,
  MetaItemValue,
  MetaItemLabel,
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledAppealJudgementContainer,
  StyledChallengeResultsHeader,
  ChallengeResultsContain,
} from "./styledComponents";
import { ApplicationPhaseEndedLabelText, ApprovedLabelText, ChallengeEndedLabelText } from "./textComponents";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import ListingPhaseLabel from "./ListingPhaseLabel";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export interface ListingSummaryUnderChallengeComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export class ListingSummaryUnderChallengeComponent extends React.Component<ListingSummaryUnderChallengeComponentProps> {
  public render(): JSX.Element {
    const { challengeID, challengeStatementSummary, appealStatementSummary } = this.props;

    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary hasTopPadding={true}>
          {this.renderAppealJudgement()}

          <ListingPhaseLabel {...this.props} />

          <NewsroomInfo {...this.props} />

          {this.renderChallengeResults()}

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

  private renderAppealJudgement = (): JSX.Element => {
    const { appeal, didListingChallengeSucceed } = this.props;
    if (!appeal || !appeal.appealGranted) {
      return <></>;
    }

    let decisionText;

    // Challenge succeeded (newsroom rejected) and appeal was granted, so newsroom is accepted
    if (didListingChallengeSucceed) {
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

  private renderChallengeResults = (): JSX.Element => {
    const {
      isAwaitingAppealRequest,
      isAwaitingAppealJudgement,
      challengeID,
      totalVotes,
      votesFor,
      votesAgainst,
      percentFor,
      percentAgainst,
      didChallengeSucceed,
    } = this.props;

    if (isAwaitingAppealRequest || isAwaitingAppealJudgement) {
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
            didChallengeSucceed={didChallengeSucceed!}
          />
        </ChallengeResultsContain>
      );
    }

    return <></>;
  };
}
