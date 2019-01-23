import * as React from "react";
import { getFormattedEthAddress } from "@joincivil/utils";
import { ChallengePhaseProps } from "./types";
import { MetaRow, MetaItem, MetaItemValue, MetaItemValueEthAddress, MetaItemLabel } from "./styledComponents";
import { RewardPoolToolTipText, DepositsToolTipText } from "./textComponents";
import { QuestionToolTip } from "../QuestionToolTip";

export const ChallengePhaseDetail: React.StatelessComponent<ChallengePhaseProps> = props => {
  return (
    <>
      <MetaRow>
        <MetaItem>
          <MetaItemLabel>{props.isViewingUserChallenger ? "You are the challenger" : "Challenger"}</MetaItemLabel>
          <MetaItemValueEthAddress>{getFormattedEthAddress(props.challenger)}</MetaItemValueEthAddress>
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
    </>
  );
};
