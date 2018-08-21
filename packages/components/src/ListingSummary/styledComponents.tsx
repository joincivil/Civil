import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { SectionHeading } from "../Heading";
import { colors, fonts } from "../styleConstants";

export const StyledListingSummaryContainer = styled.div`
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

export const StyledListingSummaryTop = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  padding: 25px 22px;
`;

export const StyledListingSummarySection = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 25px 22px;
`;

export const StyledListingSummaryNewsroomName = SectionHeading.extend`
  margin: 0 0 16px;
`;

export const StyledListingSummaryDescription = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: 400 18px/33px ${fonts.SANS_SERIF};
  letter-spacing: -0.12px;
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
