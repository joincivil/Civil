import * as React from "react";
import { ChallengePhaseProps } from "./types";
import {
  StyledListingDetailPhaseCardSection,
  MetaRow,
  MetaItem,
  MetaItemValue,
  MetaItemLabel,
} from "./styledComponents";

export const ChallengePhaseDetail: React.StatelessComponent<ChallengePhaseProps> = props => {
  return (
    <StyledListingDetailPhaseCardSection>
      <MetaRow>
        <MetaItem>
          <MetaItemLabel>Challenger</MetaItemLabel>
          <MetaItemValue>{props.challenger}</MetaItemValue>
        </MetaItem>
      </MetaRow>
      <MetaRow>
        <MetaItem>
          <MetaItemLabel>Reward Pool</MetaItemLabel>
          <MetaItemValue>{props.rewardPool}</MetaItemValue>
        </MetaItem>
        <MetaItem>
          <MetaItemLabel>Stake</MetaItemLabel>
          <MetaItemValue>{props.stake}</MetaItemValue>
        </MetaItem>
      </MetaRow>
    </StyledListingDetailPhaseCardSection>
  );
};
