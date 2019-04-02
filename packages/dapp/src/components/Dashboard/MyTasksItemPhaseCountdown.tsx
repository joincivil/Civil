import * as React from "react";

import { PHASE_TYPE_NAMES } from "@joincivil/components";

import { ActivityListItemOwnProps, ActivityListItemReduxProps } from "./MyTasksItem";
import { PhaseCountdownTimer } from "./PhaseCountdownTimer";

const TaskItemPhaseCountdown: React.FunctionComponent<
  ActivityListItemOwnProps & ActivityListItemReduxProps
> = props => {
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
