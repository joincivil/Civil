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
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";

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
        <StyledPhaseDisplayName>Rejected Newsroom</StyledPhaseDisplayName>
        <MetaItemValue>{displayDateTime}</MetaItemValue>
        <MetaItemLabel>Rejected date</MetaItemLabel>
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
