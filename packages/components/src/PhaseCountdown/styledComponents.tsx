import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const ProgressBarCountdownContainer = styled.div`
  margin-bottom: 24px;
`;
export const ProgressBarDisplayLabel = styled.h4`
  font-size: 16px;
  font-weight: normal;
  line-height: 19px;
  margin: 0 0 7px;
`;
export const ProgressBarBase = styled.div`
  height: 12px;
  border-radius: 7.5px;
`;
export const ProgressBarCountdownTotal = ProgressBarBase.extend`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  position: relative;
  width: 100%;
`;
export const ProgressBarCountdownProgress = ProgressBarBase.extend`
  display: inline-block;
  background-color: ${colors.accent.CIVIL_BLUE};
  left: 0;
  top: 0;
  position: absolute;
  transition: width 500ms ease;
`;
export const StyledProgressBarCountdownTimer = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  text-align: left;
`;

export const TwoPhaseProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;

  ${ProgressBarCountdownContainer}${ProgressBarCountdownContainer} {
    width: 46%;
    margin-left: 4%;
  }
  ${ProgressBarCountdownContainer}${ProgressBarCountdownContainer}:first-of-type {
    border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
    margin-left: 0;
    padding-right: 4%;
  }

  ${ProgressBarDisplayLabel} {
    color: ${colors.primary.CIVIL_GRAY_2};
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    margin: 0 0 7px;
    text-transform: uppercase;
  }
`;

export const MetaItem = styled.div`
  margin: 0 0 16px;
`;
export const MetaItemValue = styled.div`
  font-size: 22px;
  line-height: 27px;
`;
export const MetaItemValueAccent = MetaItemValue.extend`
  color: ${colors.primary.CIVIL_BLUE_1};
`;
export const MetaItemLabel = styled.div`
  font-size: 14px;
  line-height: 17px;
`;
export const ProgressBarCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  letter-spacing: 0.68px;
  line-height: 20px;
`;

export const CompactProgressBarDisplayLabel = styled.h4`
  font-size: 12px;
  line-height: 15px;
  margin: 0 0 7px;
  text-transform: uppercase;
`;

export const CompactMetaItemValueAccent = styled.div`
  color: ${colors.accent.CIVIL_RED};
  font-size: 14px;
  line-height: 17px;
`;
