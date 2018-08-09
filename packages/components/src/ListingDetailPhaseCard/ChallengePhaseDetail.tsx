import * as React from "react";
import { ChallengePhaseProps } from "./types";
import {
  StyledListingDetailPhaseCardSection,
  MetaRow,
  MetaItem,
  MetaItemValue,
  MetaItemLabel,
} from "./styledComponents";
import { QuestionToolTip } from "../QuestionToolTip";

export const ChallengePhaseDetail: React.StatelessComponent<ChallengePhaseProps> = props => {
  return (
    <StyledListingDetailPhaseCardSection>
      <MetaRow>
        <MetaItem>
          <MetaItemLabel>{props.isViewingUserChallenger ? "You are the challenger" : "Challenger"}</MetaItemLabel>
          <MetaItemValue>{props.challenger}</MetaItemValue>
        </MetaItem>
      </MetaRow>
      <MetaRow>
        <MetaItem>
          <MetaItemLabel>
            Reward Pool
            <QuestionToolTip
              explainerText={
                "The Reward Pool is the amount of CVL tokens that will be distributed amongst the voters for the winning party"
              }
            />
          </MetaItemLabel>
          <MetaItemValue>{props.rewardPool}</MetaItemValue>
        </MetaItem>
        <MetaItem>
          <MetaItemLabel>
            Stake
            <QuestionToolTip
              explainerText={
                "The Stake is the amount of CVL tokens that each party has put on the line forthis challenge. The loser of the challenge will lose their stake, while the winner keeps their stake and gets half of the losing party's stake. The remaining half of the loser's stake makes up the Reward Pool"
              }
            />
          </MetaItemLabel>
          <MetaItemValue>{props.stake}</MetaItemValue>
        </MetaItem>
      </MetaRow>
    </StyledListingDetailPhaseCardSection>
  );
};
