import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "./constants";
import { BreakdownBarPercentageProps, VotesPerTokenVoteProps } from "./types";

export const VoteTypeSummaryContainer = styled.div`
  box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4};
  font-size: 14px;
  line-height: 17px;
  padding: 14px 0 10px;
`;

export const VoteTypeSummary = styled.div`
  display: flex;
  color: ${colors.accent.CIVIL_GRAY_0};
`;

export const BreakdownBarContainer = styled.div`
  display: flex;
  width: 75%;
`;

export const BreakdownBarPercentageLabel = styled.div`
  font-weight: bold;
  width: 60px;
`;

export const BreakdownBarTotalContainer = styled.div`
  margin-top: 4px;
  width: 100%;
`;

export const BreakdownBarTotal = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  height: 8px;
  position: relative;
  width: 100%;
`;

export const BreakdownBarPercentage = styled.div<BreakdownBarPercentageProps>`
  display: inline-block;
  background-color: ${props => props.color};
  height: 8px;
  left: 0;
  top: 0;
  position: absolute;
  transition: width 500ms ease;
  width: ${props => props.percentage}%;
`;

export const VotesPerTokenContainer = styled.div`
  display: flex;
  white-space: nowrap;
  width: 25%;
`;

export const TotalVotesLabelContainer = styled.div`
  display: flex;
  white-space: nowrap;
  width: 39%;
`;

export const VotesPerTokenVote = styled.div<VotesPerTokenVoteProps>`
  font-weight: bold;
  width: 95px;

  & > span {
    color: ${props =>
      props.vote === CHALLENGE_RESULTS_VOTE_TYPES.REMAIN || props.vote === CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD
        ? colors.accent.CIVIL_TEAL
        : colors.accent.CIVIL_RED};
    margin-right: 4px;
  ]
`;

export const VotesPerTokenTotal = styled(VotesPerTokenVote)`
  color: ${colors.accent.CIVIL_GRAY_3};
  text-transform: uppercase;
  width: 95px;
`;

export const VotesPerTokenCount = styled.div`
  color: ${colors.primary.BLACK};
  font-size: 12px;
  line-height: 15px;
  margin: 6px 0 0;
`;

export const TotalVotesCount = styled.div`
  color: ${colors.primary.BLACK};
`;

export const StyledExplainerText = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 20px;
`;

// User Voting Summary
export const UserVotingSummaryContainer = styled.div`
  display: flex;
`;

export const UserVotingSummaryColumn = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  width: 50%;
`;

export const UserVotingSummaryColHeader = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 12px
  font-weight: 800;
  letter-spacing: 0.93px;
  line-height: 15px;
  margin: 0 0 10px;
  text-transform: uppercase;
`;
