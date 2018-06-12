import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors, fonts } from "./styleConstants";
import { SectionHeading } from "./Heading";
import { buttonSizes, InvertedButton } from "./Button";
import { CountdownTimer } from "./PhaseCountdown";

export const StyledListingSummaryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 1200px;
`;

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
  text-overflow: ellipsis;
`;

const PhaseCountdownContainer = styled.div`
  font: bold 16px/19px ${fonts.SANS_SERIF};
  margin: 0 0 16px;
`;

const BaseStatus = styled.div`
  color: ${colors.primary.BLACK};
  display: inline-block;
  font: bold 12px/15px ${fonts.SANS_SERIF};
  letter-spacing: 1px;
  margin: 0 0 9px;
  padding: 5px 8px;
  text-transform: uppercase;
`;

export const CommitVoteStatus = BaseStatus.extend`
  background-color: ${colors.accent.CIVIL_YELLOW};
`;
export const RevealVoteStatus = BaseStatus.extend`
  background-color: ${colors.accent.CIVIL_TEAL_FADED};
`;
export const RequestingAppealStatus = BaseStatus.extend`
  background-color: ${colors.primary.BLACK};
  color: ${colors.basic.WHITE};
`;

export interface ListingSummaryComponentProps {
  address?: EthAddress;
  name?: string;
  owners?: EthAddress[];
  description?: string;
  listingDetailURL?: string;
  isInApplication?: boolean | undefined;
  canBeChallenged?: boolean | undefined;
  inChallengePhase?: boolean | undefined;
  inRevealPhase?: boolean | undefined;
  appExpiry?: number | undefined;
  commitEndDate?: number | undefined;
  revealEndDate?: number | undefined;
}

export class ListingSummaryComponent extends React.Component<ListingSummaryComponentProps> {
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

            {this.renderPhaseLabel()}

            {this.renderPhaseCountdown()}

            <InvertedButton size={buttonSizes.SMALL} to={this.props.listingDetailURL}>
              View Details
            </InvertedButton>
          </div>
        </StyledListingSummaryHed>
        <StyledListingSummaryDek>{this.props.description}</StyledListingSummaryDek>
      </StyledListingSummaryContainer>
    );
  }

  private renderPhaseLabel = (): JSX.Element => {
    if (this.props.inChallengePhase) {
      return <CommitVoteStatus>Accepting Votes</CommitVoteStatus>;
    } else if (this.props.inRevealPhase) {
      return <RevealVoteStatus>Revealing Votes</RevealVoteStatus>;
    }
    return <></>;
  };

  private renderPhaseCountdown = (): JSX.Element => {
    let expiry: number | undefined;
    if (this.props.isInApplication) {
      expiry = this.props.appExpiry;
    } else if (this.props.inChallengePhase) {
      expiry = this.props.commitEndDate;
    } else if (this.props.inRevealPhase) {
      expiry = this.props.revealEndDate;
    }

    if (expiry) {
      return (
        <PhaseCountdownContainer>
          Ends in <CountdownTimer endTime={expiry!} />
        </PhaseCountdownContainer>
      );
    }

    return <></>;
  };
}

export interface ListingSummaryListComponentProps {
  listings: any[];
}

export class ListingSummaryListComponent extends React.Component<ListingSummaryListComponentProps> {
  public render(): JSX.Element {
    const listingViews = this.props.listings.map((listing: any) => (
      <ListingSummaryComponent key={listing.address} {...listing} />
    ));
    return <StyledListingSummaryList>{listingViews}</StyledListingSummaryList>;
  }
}
