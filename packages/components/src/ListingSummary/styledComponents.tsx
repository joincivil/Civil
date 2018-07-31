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

export const StyledListingSummaryNewsroomName = SectionHeading.extend`
  margin: 0 0 16px;
`;

export const StyledListingSummaryHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

export const StyledListingSummaryDek = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font: normal 18px/33px ${fonts.SANS_SERIF};
  padding: 27px 23px 30px;
`;

export const NewsroomIcon = styled.figure`
  background: ${colors.accent.CIVIL_GRAY_4};
  margin: 0 17px 0 0;
  height: 80px;
  min-width: 80px;
`;

export const MetaItem = styled.div`
  margin: 0 0 16px;
`;

export const MetaLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: normal 16px/16px ${fonts.SANS_SERIF};
  margin: 0 0 6px;
`;

export const MetaValue = styled.abbr`
  color: ${colors.primary.CIVIL_GRAY_1};
  display: block;
  font: normal 14px/17px ${fonts.SANS_SERIF};
  max-width: 65%;
  overflow-y: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
`;

export const StyledListingCardSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 23px 20px 26px;
  text-align: left;

  &:nth-child(1) {
    border-top: 0;
  }
`;
