import * as React from "react";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
} from "./styledComponents";
import { RejectedNewroomDisplayNameText, RejectedNewsroomsToolTipText } from "./textComponents";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { QuestionToolTip } from "../QuestionToolTip";

export interface RejectedCardProps {
  listingRemovedTimestamp?: number;
}

export const RejectedCard: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & ChallengeResultsProps & RejectedCardProps
> = props => {
  let displayDateTime;

  if (props.listingRemovedTimestamp) {
    const listingRemovedDateTime = getLocalDateTimeStrings(props.listingRemovedTimestamp);
    displayDateTime = `${listingRemovedDateTime[0]} ${listingRemovedDateTime[1]}`;
  }

  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseDisplayName>
          <RejectedNewroomDisplayNameText />
          <QuestionToolTip explainerText={<RejectedNewsroomsToolTipText />} strokeColor="#000" />
        </StyledPhaseDisplayName>
        <MetaItemLabel>Rejected date</MetaItemLabel>
        <MetaItemValue>{displayDateTime}</MetaItemValue>
      </StyledListingDetailPhaseCardSection>
      <StyledListingDetailPhaseCardSection>
        <ChallengeResults
          totalVotes={props.totalVotes}
          votesFor={props.votesFor}
          votesAgainst={props.votesAgainst}
          percentFor={props.percentFor}
          percentAgainst={props.percentAgainst}
        />
      </StyledListingDetailPhaseCardSection>
    </StyledListingDetailPhaseCardContainer>
  );
};
