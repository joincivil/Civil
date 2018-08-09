import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "./constants";
import { BreakdownBarPercentageProps, VotesPerTokenVoteProps } from "./types";

export const VoteTypeSummaryContainer = styled.div`
  box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4};
  font-size: 14px;
  line-height: 17px;
  padding: 14px 0;
`;

export const VoteTypeSummary = styled.div`
  display: flex;
`;

export const BreakdownBarContainer = styled.div`
  display: flex;
  width: 50%;
`;

export const BreakdownBarPercentageLabel = styled.div`
  font-weight: bold;
  width: 50px;
`;

export const BreakdownBarTotal = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  height: 8px;
  margin-top: 4px;
  position: relative;
  width: 100%;
`;

export const BreakdownBarPercentage = styled<BreakdownBarPercentageProps, "div">("div")`
  display: inline-block;
  background-color: ${props =>
    props.vote === CHALLENGE_RESULTS_VOTE_TYPES.REMAIN ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_RED};
  height: 8px;
  left: 0;
  top: 0;
  position: absolute;
  transition: width 500ms ease;
  width: ${props => props.percentage}%;
`;

export const VotesPerTokenContainer = styled.div`
  display: flex;
  width: 50%;
`;

export const VotesPerTokenVote = styled<VotesPerTokenVoteProps, "div">("div")`
  font-weight: bold;
  width: 95px;

  & > span {
    color: ${props =>
      props.vote === CHALLENGE_RESULTS_VOTE_TYPES.REMAIN ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_RED};
    margin-right: 4px;
  ]
`;

export const VotesPerTokenTotal = VotesPerTokenVote.extend`
  color: ${colors.accent.CIVIL_GRAY_3};
  text-transform: uppercase;
  width: 95px;
`;

export const VotesPerTokenCount = styled.div``;
