import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors, fonts } from "./styleConstants";
import { Heading } from "./Heading";
import { buttonSizes, InvertedButton } from "./Button";
import { CountdownTimer } from "./PhaseCountdown";

const StyledListingDetailPhaseCardContainer = styled.div`
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  padding: 30px 40px 50px;
  width: 485px;
`;

const StyledListingDetailPhaseCardSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  margin: 0 0 23px;
  padding: 0 26px;

  &:nth-child(1) {
    border-top: 0;
  }
`;

const StyledPhaseDisplayName = Heading.extend`
  font-size: 24px;
  letter-spacing: -0.5px;
  line-height: 29px;
  margin: 0 0 24px;
`;

const StyledListingDetailPhaseCardHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

export interface ListingDetailPhaseCardComponentProps {
  challenge?: any;
}

export class ListingDetailPhaseCardComponent extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>{"Approved Newsroom"}</StyledPhaseDisplayName>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
