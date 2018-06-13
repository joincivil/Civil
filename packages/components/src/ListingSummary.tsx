import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors, fonts } from "./styleConstants";
import { SectionHeading } from "./Heading";
import { buttonSizes, InvertedButton } from "./Button";
import { CountdownTimer } from "./PhaseCountdown";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
} from "./ApplicationPhaseStatusLabels";

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

  private renderPhaseLabel = (): JSX.Element | undefined => {
    if (this.props.isInApplication) {
      return <AwaitingApprovalStatusLabel />;
    } else if (this.props.inChallengePhase) {
      return <CommitVoteStatusLabel />;
    } else if (this.props.inRevealPhase) {
      return <RevealVoteStatusLabel />;
    }
    return;
  };

  private renderPhaseCountdown = (): JSX.Element | undefined => {
    let expiry: number | undefined;
    if (this.props.isInApplication) {
      expiry = this.props.appExpiry;
    } else if (this.props.inChallengePhase) {
      expiry = this.props.commitEndDate;
    } else if (this.props.inRevealPhase) {
      expiry = this.props.revealEndDate;
    }

    const warn = this.props.inChallengePhase || this.props.inRevealPhase;

    if (expiry) {
      return <CountdownTimer endTime={expiry!} warn={warn} />;
    }

    return;
  };
}
