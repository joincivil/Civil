import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";
import { buttonSizes, DarkButton } from "../Button";
import { InputGroup, TextInput } from "../input/";
import { FormHeader } from "./styledComponents";
import { ChallengeResultsProps } from "./types";

export interface BreakdownBarPercentageProps {
  vote: string;
  percentage: string;
}
export interface VotesPerTokenVoteProps {
  vote?: string;
}

const VoteTypeSummary = styled.div`
  display: flex;

  & > div {
    box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4}, inset 0 -1px 0 0 ${colors.accent.CIVIL_GRAY_4};
    padding: 14px 0;
    width: 50%;
  }
`;

const BreakdownBarContainer = styled.div`
  display: flex;
`;

const BreakdownBarPercentageLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 17px;
  width: 50px;
`;

const BreakdownBarTotal = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  height: 8px;
  margin-top: 4px;
  position: relative;
  width: 100%;
`;
const BreakdownBarPercentage = styled<BreakdownBarPercentageProps, "div">("div")`
  display: inline-block;
  background-color: ${props => (props.vote === "remain" ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_RED)};
  height: 8px;
  left: 0;
  top: 0;
  position: absolute;
  transition: width 500ms ease;
  width: ${props => props.percentage}%;
`;

const VotesPerTokenContainer = styled.div`
  display: flex;
`;
const VotesPerTokenVote = styled<VotesPerTokenVoteProps, "div">("div")`
  width: 95px;

  & > span {
    color: ${props => (props.vote === "remain" ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_RED)};
  ]
`;
const VotesPerTokenTotal = VotesPerTokenVote.extend`
  color: ${colors.accent.CIVIL_GRAY_3};
  text-transform: uppercase;
  width: 95px;
`;
const VotesPerTokenCount = styled.div``;

export class ChallengeResults extends React.Component<ChallengeResultsProps> {
  public render(): JSX.Element {
    return (
      <>
        <FormHeader>Challenge Results</FormHeader>

        <VoteTypeSummary>
          <VotesPerTokenContainer>
            <VotesPerTokenVote vote="remain">
              <span>✔</span> Remain
            </VotesPerTokenVote>
            <VotesPerTokenCount>{this.props.votesAgainst}</VotesPerTokenCount>
          </VotesPerTokenContainer>

          <BreakdownBarContainer>
            <BreakdownBarPercentageLabel>{this.props.percentAgainst}%</BreakdownBarPercentageLabel>
            <BreakdownBarTotal>
              <BreakdownBarPercentage vote="remain" percentage={this.props.percentAgainst} />
            </BreakdownBarTotal>
          </BreakdownBarContainer>
        </VoteTypeSummary>

        <VoteTypeSummary>
          <VotesPerTokenContainer>
            <VotesPerTokenVote vote="remove">
              <span>✖</span> Remove
            </VotesPerTokenVote>
            <VotesPerTokenCount>{this.props.votesFor}</VotesPerTokenCount>
          </VotesPerTokenContainer>

          <BreakdownBarContainer>
            <BreakdownBarPercentageLabel>{this.props.percentFor}%</BreakdownBarPercentageLabel>
            <BreakdownBarTotal>
              <BreakdownBarPercentage vote="remove" percentage={this.props.percentFor} />
            </BreakdownBarTotal>
          </BreakdownBarContainer>
        </VoteTypeSummary>

        <VoteTypeSummary>
          <VotesPerTokenContainer>
            <VotesPerTokenTotal>Total Votes</VotesPerTokenTotal>
            <VotesPerTokenCount>{this.props.totalVotes}</VotesPerTokenCount>
          </VotesPerTokenContainer>

          <BreakdownBarContainer>
            <a href="#">Read more details</a>
          </BreakdownBarContainer>
        </VoteTypeSummary>
      </>
    );
  }
}
