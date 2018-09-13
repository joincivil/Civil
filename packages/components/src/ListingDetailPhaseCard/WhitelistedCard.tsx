import * as React from "react";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps, SubmitChallengeProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
  CTACopy,
} from "./styledComponents";
import { WhitelistedNewroomsDisplayNameText, WhitelistedNewroomsToolTipText } from "./textComponents";
import { buttonSizes, InvertedButton } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";
import { QuestionToolTip } from "../QuestionToolTip";

export interface WhitelistedCardProps {
  whitelistedTimestamp?: number;
}

export const WhitelistedCard: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & SubmitChallengeProps & WhitelistedCardProps
> = props => {
  let displayDateTime;

  if (props.whitelistedTimestamp) {
    const listingRemovedDateTime = getLocalDateTimeStrings(props.whitelistedTimestamp);
    displayDateTime = `${listingRemovedDateTime[0]} ${listingRemovedDateTime[1]}`;
  }

  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseDisplayName>
          <WhitelistedNewroomsDisplayNameText />
          <QuestionToolTip explainerText={<WhitelistedNewroomsToolTipText />} strokeColor="#000" />
        </StyledPhaseDisplayName>
        <MetaItemLabel>Approved date</MetaItemLabel>
        <MetaItemValue>{displayDateTime}</MetaItemValue>
      </StyledListingDetailPhaseCardSection>
      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          If you believe this newsroom does not align with the <a href="#">Civil Constitution</a>, you may{" "}
          <a href="#">submit a challenge</a>.
        </CTACopy>
        {renderSubmitChallengeButton(props)}
      </StyledListingDetailPhaseCardSection>
    </StyledListingDetailPhaseCardContainer>
  );
};

const renderSubmitChallengeButton: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & SubmitChallengeProps & WhitelistedCardProps
> = props => {
  if (props.handleSubmitChallenge) {
    return (
      <InvertedButton size={buttonSizes.MEDIUM} onClick={props.handleSubmitChallenge}>
        Submit a Challenge
      </InvertedButton>
    );
  }

  return <TransactionInvertedButton transactions={props.transactions!}>Submit a Challenge</TransactionInvertedButton>;
};
