import * as React from "react";
import { EthAddress, AppealData } from "@joincivil/core";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { TextCountdownTimer } from "../PhaseCountdown/";
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
} from "./styledComponents";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export interface ListingSummaryReadyToUpdateComponentProps {
  listingAddress?: EthAddress;
  name?: string;
  description?: string;
  listingDetailURL?: string;
  challengeStatementSummary?: string;
  appeal?: AppealData;
  isInApplication?: boolean;
  canBeChallenged?: boolean;
  canBeWhitelisted?: boolean;
  inChallengeCommitVotePhase?: boolean;
  inChallengeRevealPhase?: boolean;
  isAwaitingAppealRequest?: boolean;
  didListingChallengeSucceed?: boolean;
  canResolveChallenge?: boolean;
  canResolveAppealChallenge?: boolean;
  isAwaitingAppealJudgement?: boolean;
  isAwaitingAppealChallenge?: boolean;
  canListingAppealBeResolved?: boolean;
  isInAppealChallengeCommitPhase?: boolean;
  isInAppealChallengeRevealPhase?: boolean;
  isWhitelisted?: boolean;
  isUnderChallenge?: boolean;
  canListingAppealChallengeBeResolved?: boolean;
  appExpiry?: number;
  commitEndDate?: number;
  revealEndDate?: number;
  requestAppealExpiry?: number;
  appealPhaseExpiry?: number;
  appealOpenToChallengeExpiry?: number;
  whitelistedTimestamp?: number;
  unstakedDeposit?: string;
  challengeStake?: string;
  appealChallengeCommitEndDate?: number;
  appealChallengeRevealEndDate?: number;
}

export class ListingSummaryReadyToUpdateComponent extends React.Component<ListingSummaryComponentProps> {
  public render(): JSX.Element {
    const { challengeID, challengeStatementSummary, appealStatementSummary } = this.props;

    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary>
          {this.renderDecisionBanner()}

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
