import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, ButtonProps } from "../Button";

const BACKGROUND_ACCENT_COLORS: any = {
  COMMIT_VOTE: colors.accent.CIVIL_YELLOW,
  REVEAL_VOTE: colors.accent.CIVIL_TEAL_FADED,
};

export const StyledListingDetailPhaseCardContainer = styled.div`
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  background: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 0 50px;
  position: relative;
  width: 485px;
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

export const MetaItemValueAccent = MetaItemValue.extend`
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
  margin: 0 0 5px;
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
  width: ${props => (props.width ? props.width + "px" : "")};
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
  height: 100%;
  position: absolute;
  width: 100%;
`;

export const StyledCardFront = StyledCardFace.extend`
  z-index: ${props => (!!props.flipped ? "1" : "-1")};
`;

export const StyledCardBack = StyledCardFace.extend`
  transform: rotateY(180deg);
  z-index: ${props => (!!props.flipped ? "-1" : "1")};

  ${StyledListingDetailPhaseCardContainer} {
    padding-top: 0;
  }
`;

export const FullWidthButton: StyledComponentClass<ButtonProps, "button"> = Button.extend`
  margin: 14px 0 0;
  width: 100%;
`;
