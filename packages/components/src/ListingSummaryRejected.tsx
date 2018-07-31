import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors, fonts } from "./styleConstants";
import { SectionHeading } from "./Heading";
import { buttonSizes, InvertedButton } from "./Button";
import { ChallengeResults, ChallengeResultsProps } from "./ChallengeResultsChart";

const StyledListingSummaryContainer = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4}, 0 2px 4px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  height: 491px;
  margin: 0 30px 48px 0;
  width: 379px;

  &:nth-child(3n + 3) {
    margin-right: 0;
  }
`;

const StyledListingSummaryNewsroomName = SectionHeading.extend`
  margin: 0 0 16px;
`;

const StyledListingSummaryHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

const StyledListingSummaryDek = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font: normal 18px/33px ${fonts.SANS_SERIF};
  padding: 27px 23px 30px;
`;

const NewsroomIcon = styled.figure`
  background: ${colors.accent.CIVIL_GRAY_4};
  margin: 0 17px 0 0;
  height: 80px;
  min-width: 80px;
`;

const MetaItem = styled.div`
  margin: 0 0 16px;
`;
const MetaLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: normal 16px/16px ${fonts.SANS_SERIF};
  margin: 0 0 6px;
`;
const MetaValue = styled.abbr`
  color: ${colors.primary.CIVIL_GRAY_1};
  display: block;
  font: normal 14px/17px ${fonts.SANS_SERIF};
  max-width: 65%;
  overflow-y: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
`;

const StyledListingCardSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 23px 20px 26px;
  text-align: left;

  &:nth-child(1) {
    border-top: 0;
  }
`;

export interface ListingSummaryRejectedComponentProps {
  address?: EthAddress;
  name?: string;
  owners?: EthAddress[];
  description?: string;
  listingDetailURL?: string;
}

export class ListingSummaryRejectedComponent extends React.Component<ListingSummaryRejectedComponentProps & ChallengeResultsProps> {
  public render(): JSX.Element {
    return (
      <StyledListingSummaryContainer>
        <StyledListingSummaryHed>
          <NewsroomIcon />
          <div>
            <StyledListingSummaryNewsroomName>{this.props.name}</StyledListingSummaryNewsroomName>
            <MetaItem>
              <MetaLabel>Owner</MetaLabel>
              <MetaValue title={this.props.owners![0]}>{this.props.owners![0]}</MetaValue>
            </MetaItem>
          </div>
        </StyledListingSummaryHed>

        <StyledListingCardSection>
          <ChallengeResults
            totalVotes={"100000"}
            votesFor={"73000"}
            votesAgainst={"27000"}
            percentFor={"73"}
            percentAgainst={"27"}
          />
        </StyledListingCardSection>

        <StyledListingCardSection>
          <InvertedButton size={buttonSizes.SMALL} to={this.props.listingDetailURL}>
            View Details
          </InvertedButton>
        </StyledListingCardSection>
      </StyledListingSummaryContainer>
    );
  }
}
