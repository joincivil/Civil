import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StyledListingDetailPhaseCardContainer = styled.div`
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  padding: 30px 40px 50px;
  width: 485px;
`;

export const StyledListingDetailPhaseCardSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 23px 0 26px;
  text-align: left;

  &:nth-child(1) {
    border-top: 0;
  }
`;

export const StyledPhaseDisplayName = styled.h3`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.5px;
  line-height: 29px;
  margin: 0 0 24px;
`;

export const StyledListingDetailPhaseCardHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

export const MetaItemValue = styled.div`
  font-size: 24px;
  line-height: 29px;
`;
export const MetaItemValueAccent = MetaItemValue.extend`
  color: ${colors.primary.CIVIL_BLUE_1};
`;
export const MetaItemLabel = styled.div`
  font-size: 14px;
  line-height: 17px;
`;
export const CTACopy = styled.p`
  font-size: 18px;
  font-weight: bold;
  line-height: 33px;

  & a {
    text-decoration: none;
  }
`;
export const FormCopy = styled.p`
  font-size: 16px;
  line-height: 26px;
  margin: 0 0 10px;
`;

export const VoteOptionsContainer = styled.div`
  display: flex;
  margin: 20px 0 0;
`;
export const StyledOrText = styled.div`
  font: italic normal 20px/30px ${fonts.SERIF};
  padding: 10px 13px;
  text-align: center;
`;

export const FormHeader = styled.h4`
  font-size: 21px;
  line-height: 25px;
  margin: 0;
`;
export const AccentHRule = styled.div`
  box-shadow: inset 0 5px 0 0 ${colors.accent.CIVIL_BLUE};
  height: 12px;
  margin: 10px 0;
  width: 45px;
`;
export const FormQuestion = styled.p`
  font-size: 24px;
  line-height: 36px;
  margin: 0 0 24px;
`;

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
  width: ${props => props.percentage.toString()}%;
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
