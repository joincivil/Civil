import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import { MetaRow, MetaItemValue, MetaItemLabel } from "./styledComponents";
import { AmountDepositedLabelText, AmountStakedChallengeLabelText } from "./textComponents";

const DepositOrStakeAmount: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  if (
    props.inChallengeCommitVotePhase ||
    props.isInAppealChallengeCommitPhase ||
    props.inChallengeRevealPhase ||
    props.isInAppealChallengeRevealPhase ||
    props.canResolveChallenge ||
    props.canListingAppealChallengeBeResolved ||
    props.isAwaitingAppealJudgement ||
    props.isAwaitingAppealChallenge
  ) {
    return <ChallengeStake {...props} />;
  } else if (props.isInApplication || props.canBeWhitelisted || props.isWhitelisted) {
    return <UnstakedDeposit {...props} />;
  }
  return null;
};

const UnstakedDeposit: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  if (!props.unstakedDeposit && !props.isWhitelisted) {
    return null;
  }
  return (
    <MetaRow>
      <MetaItemLabel>
        <AmountDepositedLabelText />
      </MetaItemLabel>
      <MetaItemValue>{props.unstakedDeposit}</MetaItemValue>
    </MetaRow>
  );
};

const ChallengeStake: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  if (!props.challengeStake) {
    return null;
  }
  return (
    <MetaRow>
      <MetaItemLabel>
        <AmountStakedChallengeLabelText />
      </MetaItemLabel>
      <MetaItemValue>{props.challengeStake}</MetaItemValue>
    </MetaRow>
  );
};

export default DepositOrStakeAmount;
