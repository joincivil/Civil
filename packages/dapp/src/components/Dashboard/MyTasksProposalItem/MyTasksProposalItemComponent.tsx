import * as React from "react";
import { paramPropChallengeHelpers } from "@joincivil/utils";
import { DashboardActivityItemTask } from "@joincivil/components";

import { routes } from "../../../constants";
import { MyTasksProposalItemOwnProps, MyTasksProposalItemReduxProps } from "./MyTasksProposalItemTypes";
import MyTasksProposalItemPhaseCountdown from "../MyTasksItemPhaseCountdown";
import DashboardProposalItemChallengeDetails from "../ProposalChallengeSummary";

const MyTasksProposalItemComponent: React.FunctionComponent<
  MyTasksProposalItemOwnProps & MyTasksProposalItemReduxProps
> = props => {
  const { proposal, challengeID, challenge, userChallengeData } = props;

  if (!userChallengeData || !challenge) {
    return <></>;
  }

  const { canUserReveal, canUserCollect, canUserRescue, didUserCommit } = userChallengeData;

  let title = `Parameter Proposal Challenge #${challengeID}`;
  if (proposal) {
    title = `${title}: ${proposal.paramName} = ${proposal.propValue}`;
  }

  const viewProps = {
    title,
    viewDetailURL: routes.PARAMETERIZER,
  };

  const inCommitPhase = paramPropChallengeHelpers.isParamPropChallengeInCommitStage(challenge);
  const inRevealPhase = paramPropChallengeHelpers.isParamPropChallengeInRevealStage(challenge);

  if (canUserReveal || canUserCollect || canUserRescue || didUserCommit) {
    return (
      <DashboardActivityItemTask {...viewProps}>
        <MyTasksProposalItemPhaseCountdown {...props} />
        {!inCommitPhase && !inRevealPhase && <DashboardProposalItemChallengeDetails {...props} />}
      </DashboardActivityItemTask>
    );
  }

  return <></>;
};

export default MyTasksProposalItemComponent;
