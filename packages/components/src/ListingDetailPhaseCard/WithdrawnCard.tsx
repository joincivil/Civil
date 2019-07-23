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
import { WithdrawnNewroomDisplayNameText, WithdrawnNewsroomsToolTipText } from "./textComponents";
import { QuestionToolTip } from "../QuestionToolTip";

export interface WithdrawnCardProps {
  listingRemovedTimestamp?: number;
}

export type WithdrawnCardAllProps = ListingDetailPhaseCardComponentProps & WithdrawnCardProps;

export const WithdrawnCard: React.FunctionComponent<WithdrawnCardAllProps> = props => {
  let displayDateTime;
  if (props.listingRemovedTimestamp) {
    const listingRemovedDateTime = getLocalDateTimeStrings(props.listingRemovedTimestamp);
    displayDateTime = `${listingRemovedDateTime[0]} ${listingRemovedDateTime[1]}`;
  }

  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseDisplayName>
          <WithdrawnNewroomDisplayNameText />
          <QuestionToolTip explainerText={<WithdrawnNewsroomsToolTipText />} positionBottom={true} />
        </StyledPhaseDisplayName>
        <MetaItemLabel>Withdrawn date</MetaItemLabel>
        <MetaItemValue>{displayDateTime}</MetaItemValue>
      </StyledListingDetailPhaseCardSection>
    </StyledListingDetailPhaseCardContainer>
  );
};
