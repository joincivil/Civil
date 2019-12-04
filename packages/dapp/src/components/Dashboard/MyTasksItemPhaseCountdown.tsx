import * as React from "react";
import { WrappedChallengeData } from "@joincivil/typescript-types";
import { PHASE_TYPE_NAMES } from "@joincivil/components";

import { PhaseCountdownTimer } from "./PhaseCountdownTimer";

export interface TaskItemPhaseCountdownProps {
  challenge?: WrappedChallengeData;
  challengeState?: any;
}

const TaskItemPhaseCountdown: React.FunctionComponent<TaskItemPhaseCountdownProps> = props => {
  const { challenge, challengeState } = props;

  let phaseCountdown = <></>;

  if (challengeState) {
    const {
      inCommitPhase,
      inRevealPhase,
      canRequestAppeal,
      isAwaitingAppealJudgement,
      isAwaitingAppealChallenge,
      isAppealChallengeInCommitStage,
      isAppealChallengeInRevealStage,
    } = challengeState;

    let phaseCountdownType;

    if (inCommitPhase) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_COMMIT_VOTE;
    } else if (inRevealPhase) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_REVEAL_VOTE;
    } else if (canRequestAppeal) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_REQUEST;
    } else if (isAwaitingAppealJudgement) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_JUDGEMENT;
    } else if (isAwaitingAppealChallenge) {
      phaseCountdownType = PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_CHALLENGE;
    } else if (isAppealChallengeInCommitStage) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_COMMIT_VOTE;
    } else if (isAppealChallengeInRevealStage) {
      phaseCountdownType = PHASE_TYPE_NAMES.APPEAL_CHALLENGE_REVEAL_VOTE;
    }

    if (phaseCountdownType) {
      phaseCountdown = <PhaseCountdownTimer phaseType={phaseCountdownType} challenge={challenge} />;
    }
  }

  return phaseCountdown;
};

export default TaskItemPhaseCountdown;
