import * as React from "react";
import { ChallengePhaseProps } from "./types";
import {
  StyledListingDetailPhaseCardSection,
  MetaRow,
  MetaItem,
  MetaItemValue,
  MetaItemValueLong,
  MetaItemLabel,
} from "./styledComponents";
import { RewardPoolToolTipText, DepositsToolTipText } from "./textComponents";
import { QuestionToolTip } from "../QuestionToolTip";

export const ChallengePhaseDetail: React.StatelessComponent<ChallengePhaseProps> = props => {
  return (
    <StyledListingDetailPhaseCardSection>
      <MetaRow>
        <MetaItem>
          <MetaItemLabel>{props.isViewingUserChallenger ? "You are the challenger" : "Challenger"}</MetaItemLabel>
          <MetaItemValueLong>{props.challenger}</MetaItemValueLong>
        </MetaItem>
      </MetaRow>
      <MetaRow>
        <MetaItem>
          <MetaItemLabel>
            Reward Pool
            <QuestionToolTip explainerText={<RewardPoolToolTipText />} positionBottom={true} />
          </MetaItemLabel>
          <MetaItemValue>{props.rewardPool}</MetaItemValue>
        </MetaItem>
        <MetaItem>
          <MetaItemLabel>
            Stake
            <QuestionToolTip explainerText={<DepositsToolTipText />} positionBottom={true} />
          </MetaItemLabel>
          <MetaItemValue>{props.stake}</MetaItemValue>
        </MetaItem>
      </MetaRow>
    </StyledListingDetailPhaseCardSection>
  );
};
