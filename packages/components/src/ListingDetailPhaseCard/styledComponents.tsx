import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, ButtonProps, ButtonTheme, DEFAULT_BUTTON_THEME } from "../Button";

const BACKGROUND_ACCENT_COLORS: any = {
  COMMIT_VOTE: colors.accent.CIVIL_YELLOW,
  REVEAL_VOTE: colors.accent.CIVIL_TEAL_FADED,
};

export const StyledListingDetailPhaseCardContainer = styled.div`
  box-sizing: border-box;
  background: ${colors.basic.WHITE};
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_3};
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 0 50px;
  position: relative;
  width: 440px;

  ${mediaQueries.MOBILE} {
    padding: 7px 0;
    width: auto;
  }
`;

export interface StyledListingDetailPhaseCardSectionProps {
  bgAccentColor?: string;
}

export const StyledListingDetailPhaseCardSection: StyledComponentClass<
  StyledListingDetailPhaseCardSectionProps,
  "div"
> = styled<StyledListingDetailPhaseCardSectionProps, "div">("div")`
  background: ${props => (props.bgAccentColor ? BACKGROUND_ACCENT_COLORS[props.bgAccentColor] : "transparent")};
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 23px 40px 26px;
  text-align: left;

  &:nth-child(1) {
    border-top: 0;
  }

  ${mediaQueries.MOBILE} {
    padding-left: 16px;
    padding-right: 16px;
    width: auto;
  }
`;

export const StyledListingDetailPhaseCardSectionHeader = styled.h4`
  color: ${colors.accent.CIVIL_BLUE};
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  margin: 0;
`;

export const StyledPhaseKicker = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1}
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const StyledPhaseDisplayName = styled.h3`
  color: ${colors.primary.BLACK};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.51px;
  line-height: 29px;
  margin: 0 0 24px;
`;

export const StyledListingDetailPhaseCardHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

export const MetaRow = styled.div`
  display: flex;
  margin: 0 0 16px;
`;

export const MetaItem = styled.div`
  &:first-child:nth-last-child(1) {
    width: 100%;
  }

  &:first-child:nth-last-child(2),
  &:first-child:nth-last-child(2) ~ & {
    width: 50%;
  }
`;

export const MetaItemValue = styled.div`
  font-size: 18px;
  line-height: 21px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaItemValueEthAddress = styled(MetaItemValue)`
  font-family: ${fonts.MONOSPACE};
  font-size: 15px;
  letter-spacing: -0.11px;
  line-height: 20px;
`;

export const MetaItemValueLong = styled(MetaItemValue)`
  font-size: 16px;
`;

export const MetaItemValueAccent = styled(MetaItemValue)`
  color: ${colors.primary.CIVIL_BLUE_1};
`;

export const MetaItemLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  margin-bottom: 8px;
  text-transform: uppercase;
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
  justify-content: space-between;
  margin: 20px 0;
`;

export const StyledOrText = styled.div`
  font: italic normal 20px/30px ${fonts.SERIF};
  padding: 10px 13px;
  text-align: center;
`;

export const StyledVoteCTAButton = styled.div`
  ${Button} {
    font-size: 13px;
    line-height: 14px;
    padding: 18px 0;
    width: 100%;
  }
`;

export const FormHeader = styled.h4`
  font-size: 21px;
  line-height: 25px;
  margin: 0 0 5px;
`;
export const AccentHRule = styled.div`
  box-shadow: inset 0 5px 0 0 ${colors.accent.CIVIL_BLUE};
  height: 12px;
  margin: 10px 0;
  width: 45px;
`;
export const FormQuestion = styled.p`
  font-size: 21px;
  line-height: 34px;
  margin: 0 0 24px;
  text-align: center;
`;

export interface StyledCardStageProps {
  width?: string;
}

export interface StyledCardProps {
  flipped?: boolean;
}

export const StyledCardStage: StyledComponentClass<StyledCardStageProps, "div"> = styled<StyledCardStageProps, "div">(
  "div",
)`
  perspective: 800px;
  width: ${props => (props.width ? props.width + "px" : "440")};

  ${mediaQueries.MOBILE} {
    width: auto;
  }

  & ${StyledListingDetailPhaseCardContainer} {
    box-shadow: none;
  }
`;

export const StyledCard: StyledComponentClass<StyledCardProps, "div"> = styled<StyledCardProps, "div">("div")`
  position: relative;
  transition: transform 500ms;
  transform-style: preserve-3d;
  ${props => (!!props.flipped ? "transform:rotateY(180deg)" : "")};
  height: 100%;
  width: 100%;
`;

export const StyledCardClose = styled.div`
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  right: 15px;
  top: 15px;

  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

export const StyledCardFace: StyledComponentClass<StyledCardProps, "div"> = styled<StyledCardProps, "div">("div")`
  background-color: ${colors.basic.WHITE};
  backface-visibility: hidden;
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_3};
  height: 100%;
  position: relative;
  min-height: 100%;
  width: 100%;
`;

export const StyledCardFront = styled(StyledCardFace)`
  z-index: ${props => (!!props.flipped ? "1" : "-1")};
`;

export const StyledCardBack = styled(StyledCardFace)`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  transform: rotateY(180deg);
  z-index: ${props => (!!props.flipped ? "-1" : "1")};

  ${StyledListingDetailPhaseCardContainer} {
    padding-top: 0;
  }
`;

export const FullWidthButton: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  margin: 14px 0 0;
  width: 100%;
`;

export const buttonTheme: ButtonTheme = {
  ...DEFAULT_BUTTON_THEME,
  primaryButtonDisabledBackground: colors.accent.CIVIL_GRAY_4,
  primaryButtonDisabledColor: colors.accent.CIVIL_GRAY_3,
  darkButtonTextTransform: "uppercase",
};

export const ToolTipHdr = styled.p`
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  margin: 0 0 12px;
`;

export const ToolTipItalic = styled.p`
  font-style: italic;
  margin: 0 0 12px;
`;

export interface StyledStepPropsState {
  visible: boolean;
}

export const StyledStep: StyledComponentClass<StyledStepPropsState, "div"> = styled<StyledStepPropsState, "div">("div")`
  display: ${(props: StyledStepPropsState) => (props.visible ? "block" : "none")};
`;

export const StyledStepLabel = styled(StyledPhaseKicker)`
  margin: 0 0 20px;
  text-align: center;
`;

export const StyledOneTokenOneVote = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 16px;
  line-height: 26px;
  margin: 0 -40px 39px;
  padding: 13px 0 15px;
  text-align: center;
`;

export const StyledBalanceRow = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  display: flex;
  font-size: 14px;
  line-height: 17px;
  justify-content: space-between;
`;

export const StyledBalanceRowRight = styled.div`
  text-align: right;
`;

export const ProgressBarBase = styled.div`
  height: 8px;
  border-radius: 5px;
`;

export const ProgressBarTotal = styled(ProgressBarBase)`
  background-color: ${colors.accent.CIVIL_TEAL_FADED_2};
  box-sizing: border-box;
  margin: 13px 0 16px;
  position: relative;
  width: 100%;
`;

export const ProgressBarProgress = styled(ProgressBarBase)`
  display: inline-block;
  background-color: ${colors.accent.CIVIL_TEAL};
  left: 0;
  top: 0;
  position: absolute;
  transition: width 500ms ease;
`;

export const StyledAppMessage = styled.div`
  color: ${colors.accent.CIVIL_RED};
  font-size: 14px;
  line-height: 17px;
  margin: 20px 0;
  padding: 0 20px;
  text-align: center;
`;

export const StyledButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 23px;
`;

export const StyledVisibleOnDesktop = styled.div`
  display: block;

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const StyledVisibleOnMobile = styled.div`
  display: none;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;
