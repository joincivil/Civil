import * as React from "react";

import { getLocalDateTimeStrings } from "@joincivil/utils";

import { TextCountdownTimer } from "../PhaseCountdown";

import { ListingSummaryComponentProps } from "./types";
import { MetaRow, MetaItemValue, MetaItemLabel } from "./styledComponents";
import {
  ApplicationPhaseEndedLabelText,
  ApprovedLabelText,
  ChallengeEndedLabelText,
  UnderChallengeBannerText,
} from "./textComponents";

const PhaseCountdown: React.SFC<ListingSummaryComponentProps> = props => {
  let expiry: number | undefined;
  const {
    isInApplication,
    inChallengeCommitVotePhase,
    inChallengeRevealPhase,
    isAwaitingAppealRequest,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
    appExpiry,
    commitEndDate,
    revealEndDate,
    requestAppealExpiry,
    appealPhaseExpiry,
    appealOpenToChallengeExpiry,
    appealChallengeCommitEndDate,
    appealChallengeRevealEndDate,
  } = props;
  if (isInApplication) {
    expiry = appExpiry;
  } else if (inChallengeCommitVotePhase) {
    expiry = commitEndDate;
  } else if (inChallengeRevealPhase) {
    expiry = revealEndDate;
  } else if (isAwaitingAppealRequest) {
    expiry = requestAppealExpiry;
  } else if (isAwaitingAppealJudgement) {
    expiry = appealPhaseExpiry;
  } else if (isAwaitingAppealChallenge) {
    expiry = appealOpenToChallengeExpiry;
  } else if (isInAppealChallengeCommitPhase) {
    expiry = appealChallengeCommitEndDate;
  } else if (isInAppealChallengeRevealPhase) {
    expiry = appealChallengeRevealEndDate;
  }

  const warn =
    inChallengeCommitVotePhase ||
    inChallengeRevealPhase ||
    isInAppealChallengeCommitPhase ||
    isInAppealChallengeRevealPhase;

  if (!expiry) {
    return null;
  }

  expiry = parseInt(expiry.toString(), 10);
  return <TextCountdownTimer endTime={expiry!} warn={warn} />;
};

/**
 * Renders a human-readable timestamp for phases that have no expiry
 */
const Timestamp: React.SFC<ListingSummaryComponentProps> = props => {
  let timestamp: number = 0;
  let LabelTextComponent: React.SFC = () => <></>;

  const {
    canBeWhitelisted,
    appExpiry,
    canResolveChallenge,
    revealEndDate,
    canListingAppealChallengeBeResolved,
    appealChallengeRevealEndDate,
    isWhitelisted,
    isUnderChallenge,
    whitelistedTimestamp,
  } = props;

  // Unchallenged application
  if (canBeWhitelisted && appExpiry) {
    timestamp = appExpiry;
    LabelTextComponent = ApplicationPhaseEndedLabelText;

    // Resolve Challenge
  } else if (canResolveChallenge && revealEndDate) {
    timestamp = revealEndDate;
    LabelTextComponent = ChallengeEndedLabelText;

    // Resolve Appeal Challenge
  } else if (canListingAppealChallengeBeResolved && appealChallengeRevealEndDate) {
    timestamp = appealChallengeRevealEndDate;
    LabelTextComponent = ChallengeEndedLabelText;

    // Whitelisted and not Under Challenge
  } else if (isWhitelisted && !isUnderChallenge && whitelistedTimestamp) {
    timestamp = whitelistedTimestamp;
    LabelTextComponent = ApprovedLabelText;
  }

  if (!timestamp) {
    return null;
  }

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
};

const PhaseCountdownOrTimestamp: React.SFC<ListingSummaryComponentProps> = props => {
  const {
    isInApplication,
    inChallengeCommitVotePhase,
    inChallengeRevealPhase,
    isAwaitingAppealRequest,
    isAwaitingAppealJudgement,
    isAwaitingAppealChallenge,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
  } = props;
  if (
    isInApplication ||
    inChallengeCommitVotePhase ||
    inChallengeRevealPhase ||
    isAwaitingAppealRequest ||
    isAwaitingAppealJudgement ||
    isAwaitingAppealChallenge ||
    isInAppealChallengeCommitPhase ||
    isInAppealChallengeRevealPhase
  ) {
    return <PhaseCountdown {...props} />;
  } else {
    return <Timestamp {...props} />;
  }
};

export default PhaseCountdownOrTimestamp;
