import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { SectionHeading } from "../Heading";
import { colors, fonts } from "../styleConstants";
import { StyledBaseStatus } from "../ApplicationPhaseStatusLabels";

export const StyledListingSummaryContainer = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4}, 0 2px 4px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  margin: 0 30px 48px 0;
  width: 379px;

  &:nth-child(3n + 3) {
    margin-right: 0;
  }

  & ${StyledBaseStatus} {
    margin: 25px 22px 10px;
  }
`;

export const StyledListingSummaryTop = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  padding: 0 22px 25px;
`;

export const StyledBaseResultsBanner = styled.div`
  align-items: center;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.BLACK};
  display: flex;
  font-size: 14px;
  justify-content: center;
  line-height: 18px;
  padding: 22px 0;
  margin-bottom: 22px;

  & svg {
    margin-right: 4px;
  }
`;

export const StyledApprovedResultsBanner = styled(StyledBaseResultsBanner)`
  background-color: ${colors.accent.CIVIL_TEAL_FADED};
`;

export const StyledRejectedResultsBanner = styled(StyledBaseResultsBanner)`
  background-color: ${colors.accent.CIVIL_RED_VERY_FADED};
`;

export const StyledAppealJudgementContainer = styled.div`
  align-items: center;
  display: flex;
  background: ${colors.primary.BLACK};
  border-radius: 3px;
  color: ${colors.basic.WHITE};
  font-size: 14px;
  justify-content: center;
  line-height: 18px;
  margin: 9px 8px 2px;
  padding: 15px 0;

  & svg {
    margin-right: 4px;
  }
`;

export const StyledListingSummarySection = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 25px 22px;
`;

export const StyledListingSummaryNewsroomName = styled(SectionHeading)`
  line-height: 26px;
  margin: 0 0 8px;
`;

export const StyledListingSummaryDescription = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: 400 14px/20px ${fonts.SANS_SERIF};
`;

export const ChallengeResultsContain = styled.div`
  margin: 0 0 20px;
`;

export const NewsroomIcon = styled.figure`
  background: ${colors.accent.CIVIL_GRAY_4};
  height: 80px;
  margin: 0 17px 0 0;
  min-width: 80px;
`;

export const MetaRow = styled.div`
  margin: 16px 0;
`;

export const TimestampLabel = styled.div`
  font-size: 16px;
  line-height: 16px;
`;

export const TimestampValue = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 4px;
`;

export const MetaItemValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  margin-bottom: 4px;
`;

export const MetaItemLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  line-height: 17px;
`;
