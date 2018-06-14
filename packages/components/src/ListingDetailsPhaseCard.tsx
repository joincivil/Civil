import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
<<<<<<< HEAD:packages/components/src/ListingDetailsPhaseCard.tsx
import { colors, fonts } from "./styleConstants";
import { Heading } from "./Heading";
import { buttonSizes, InvertedButton } from "./Button";
import { CountdownTimer } from "./PhaseCountdown";
=======
import { colors, fonts } from "../styleConstants";
import { buttonSizes, InvertedButton } from "../Button";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
>>>>>>> 9aa17e4... Stub out `ListingDetailPhaseCard`s for the initial application cycle:packages/components/src/ListingDetailPhaseCard/ListingDetailsPhaseCard.tsx

const StyledListingDetailPhaseCardContainer = styled.div`
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  padding: 30px 40px 50px;
  width: 485px;
`;

const StyledListingDetailPhaseCardSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  margin: 0 0 23px;
  padding: 23px 0 26px;
  text-align: left;

  &:nth-child(1) {
    border-top: 0;
  }
`;

const StyledPhaseDisplayName = styled.h3`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.5px;
  line-height: 29px;
  margin: 0 0 24px;
`;

const StyledListingDetailPhaseCardHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

const MetaItemValue = styled.div`
  font-size: 24px;
  line-height: 29px;
`;
const MetaItemValueAccent = MetaItemValue.extend`
  color: ${colors.primary.CIVIL_BLUE_1};
`;
const MetaItemLabel = styled.div`
  font-size: 14px;
  line-height: 17px;
`;
const CTACopy = styled.p`
  font-size: 18px;
  font-weight: bold;
  line-height: 33px;

  & a {
    text-decoration: none;
  }
`;

export interface ListingDetailPhaseCardComponentProps {
  challenge?: any;
}

<<<<<<< HEAD:packages/components/src/ListingDetailsPhaseCard.tsx
export class ListingDetailPhaseCardComponent extends React.Component<ListingDetailPhaseCardComponentProps> {
=======
export class WhitelistedCard extends React.Component<ListingDetailPhaseCardComponentProps> {
>>>>>>> 9aa17e4... Stub out `ListingDetailPhaseCard`s for the initial application cycle:packages/components/src/ListingDetailPhaseCard/ListingDetailsPhaseCard.tsx
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
<<<<<<< HEAD:packages/components/src/ListingDetailsPhaseCard.tsx
          <StyledPhaseDisplayName>{"Approved Newsroom"}</StyledPhaseDisplayName>
=======
          <StyledPhaseDisplayName>Approved Newsroom</StyledPhaseDisplayName>
          <MetaItemValue>May 5, 2018, 8:30 GMT-0400</MetaItemValue>
          <MetaItemLabel>Approved date</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            If you believe this newsroom does not align with the <a href="#">Civil Constitution</a>, you may{" "}
            <a href="#">submit a challenge</a>.
          </CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Submit a Challenge</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}

export class InApplicationCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>New Application</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={endTime}
            totalSeconds={phaseLength}
            displayLabel="Waiting for approval"
            flavorText="under community review"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            If you believe this newsroom does not align with the <a href="#">Civil Constitution</a>, you may{" "}
            <a href="#">submit a challenge</a>.
          </CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Submit a Challenge</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}

export class CommitVoteCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={endTime}
            totalSeconds={phaseLength}
            displayLabel="Accepting votes"
            flavorText="under challenge"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>You're invited to vote!</CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Vote</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}

export class RevealVoteCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={endTime}
            totalSeconds={phaseLength}
            displayLabel="Revealing votes"
            flavorText="under challenge"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>Verify Your Votes and Make Them Count!</CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Reveal My Votes</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}

export class AwaitingAppealRequestCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={endTime}
            totalSeconds={phaseLength}
            displayLabel="Revealing votes"
            flavorText="under challenge"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>If you disagree with the community, you may request an appeal to the Civil Council.</CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Request Appeal from Civil Council</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}

export class RejectedCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Rejected Newsroom</StyledPhaseDisplayName>
          <MetaItemValue>May 5, 2018, 8:30 GMT-0400</MetaItemValue>
          <MetaItemLabel>Rejected date</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>Challenge Results</CTACopy>
          Cool graph goes here!
>>>>>>> 9aa17e4... Stub out `ListingDetailPhaseCard`s for the initial application cycle:packages/components/src/ListingDetailPhaseCard/ListingDetailsPhaseCard.tsx
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
