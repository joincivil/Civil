import * as React from "react";
import { Link } from "react-router-dom";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps, SubmitChallengeProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
  CTACopy,
  StyledVisibleOnDesktop,
  StyledVisibleOnMobile,
} from "./styledComponents";
import { WhitelistedNewroomsDisplayNameText, WhitelistedNewroomsToolTipText } from "./textComponents";
import { buttonSizes, InvertedButton } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";
import { QuestionToolTip } from "../QuestionToolTip";
import NeedHelp from "./NeedHelp";

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
          <QuestionToolTip explainerText={<WhitelistedNewroomsToolTipText />} positionBottom={true} />
        </StyledPhaseDisplayName>
        <MetaItemLabel>Approved date</MetaItemLabel>
        <MetaItemValue>{displayDateTime}</MetaItemValue>
      </StyledListingDetailPhaseCardSection>
      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          If you believe this newsroom does not align with the <a href={props.constitutionURI}>Civil Constitution</a>,
          you may <Link to={props.submitChallengeURI || "#"}>submit a challenge</Link>.
        </CTACopy>
        {renderSubmitChallengeButton(props)}
      </StyledListingDetailPhaseCardSection>

      <NeedHelp faqURL={props.faqURL} />
    </StyledListingDetailPhaseCardContainer>
  );
};

const renderSubmitChallengeButton: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & SubmitChallengeProps & WhitelistedCardProps
> = props => {
  if (props.submitChallengeURI) {
    return (
      <>
        <StyledVisibleOnDesktop>
          <InvertedButton size={buttonSizes.MEDIUM} to={props.submitChallengeURI}>
            Submit a Challenge
          </InvertedButton>
        </StyledVisibleOnDesktop>
        <StyledVisibleOnMobile>
          <InvertedButton size={buttonSizes.MEDIUM} onClick={props.onMobileTransactionClick}>
            Submit a Challenge
          </InvertedButton>
        </StyledVisibleOnMobile>
      </>
    );
  }

  return <TransactionInvertedButton transactions={props.transactions!}>Submit a Challenge</TransactionInvertedButton>;
};
