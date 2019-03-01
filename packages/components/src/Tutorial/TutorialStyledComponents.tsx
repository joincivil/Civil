import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, InvertedButton, SecondaryButton, ButtonProps } from "../Button";

export interface TutorialProgressBarProps {
  activeSlide: number;
  totalSlides: number;
}

export const TutorialProgressContain = styled.div`
  padding: 20px 0 50px;
  width: 100%;
`;

export const TutorialProgressBar = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  height: 6px;
  margin: 0 auto;
  max-width: 900px;
  position: relative;
  width: 100%;
`;

export const TutorialProgressBarActive = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 3px;
  height: 6px;
  width: ${(props: TutorialProgressBarProps) => (props.activeSlide / props.totalSlides * 100).toString()}%;
`;

export const TutorialProgressBarSlideCount = styled.div`
  color: ${colors.accent.CIVIL_BLUE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: bold;
  left: calc(${(props: TutorialProgressBarProps) => (props.activeSlide / props.totalSlides * 100).toString()}% - 25px);
  position: absolute;
  text-align: center;
  top: -20px;
  width: 50px;
`;

export interface TutorialStyleProps {
  centerContent?: boolean;
}

export const TutorialContentWrap = styled.div`
  font-family: ${fonts.SANS_SERIF};
  margin: 0 auto 50px;
  max-width: 710px;
  min-height: 500px;
  position: relative;
  text-align: ${(props: TutorialStyleProps) => (props.centerContent ? "center" : "left")};

  svg {
    display: block;
    margin: 0 auto;
  }

  button {
    padding: 14px 30px;
    width: auto;
  }
`;

export const TutorialSlideContent = styled.div`
  margin: 0 auto;
  max-width: 540px;

  h2 {
    font-size: 24px;
    line-height: 29px;
  }

  p,
  li {
    font-size: 18px;
    line-height: 33px;
  }
`;

export const TutorialTopicTitle = styled.div`
  font-size: 32px;
  font-weight: 300;
  letter-spacing: -0.87px;
  line-height: 39px;
  margin-bottom: 50px;

  b {
    font-weight: 800;
  }
`;

export const TutorialTopicInfo = styled.div`
  font-size: 21px;
  font-weight: 300;
  letter-spacing: -0.11px;
  line-height: 31px;
  margin-bottom: 30px;
`;

export interface TutorialFooterFullProps {
  questionResult?: string;
  floatRight?: boolean;
}

export const TutorialFooterFull = styled.div`
  background-color: ${(props: TutorialFooterFullProps) =>
    props.questionResult === "correct"
      ? "rgba(41,203,66,0.2)"
      : props.questionResult === "incorrect"
        ? "#FFE6E8"
        : colors.accent.CIVIL_GRAY_4};
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 40px 20px 50px;
  position: fixed;
  width: 100%;
`;

export const TutorialFooterWrap = styled.div`
  align-items: center;
  display: flex;
  justify-content: ${(props: TutorialFooterFullProps) => (props.floatRight ? "flex-end" : "space-between")};
  max-width: 900px;
  width: 100%;
`;

export const TutorialFooterLeft = styled.div`
  align-items: flex-start;
  display: flex;
  font-family: ${fonts.SANS_SERIF};

  svg {
    margin-right: 15px;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    margin: 0 0 5px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 14px;
    line-height: 22px;
    margin: 0 0 25px;
  }

  span {
    color: ${colors.accent.CIVIL_RED};
    display: block;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
  }
`;

export const TutorialBtn: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  border-radius: 1px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  padding: 14px;
  text-transform: none;
  width: 160px;
`;

export const TutorialInvertedBtn: StyledComponentClass<ButtonProps, "button"> = styled(InvertedButton)`
  background-color: transparent;
  border-radius: 1px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  padding: 12px;
  text-transform: none;
  width: 160px;
`;

export const TutorialTextBtn: StyledComponentClass<ButtonProps, "button"> = styled(InvertedButton)`
  background-color: transparent;
  border: none;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.3px;
  line-height: 14px;
  padding: 12px;
  text-transform: none;
  width: 160px;

  &:hover,
  &:focus {
    background-color: transparent;
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: underline;
  }
`;

export const TutorialQuizName = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 27px;
  font-weight: 300;
  letter-spacing: -0.14px;
  line-height: 30px;
  margin: 10px 0 40px -65px;
`;

export const TutorialQuizQuestion = styled.h3`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: bold;
  line-height: 29px;
  position: relative;

  span {
    font-size: 18px;
    left: -20px;
    line-height: 28px;
    position: absolute;
    text-align: right;
    top: 0;
  }
`;

export const TutorialCompletedHeader = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.58px;
  line-height: 39px;
  margin: 30px 0;
  text-align: center;
`;

export const TutorialCompletedP = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  letter-spacing: -0.12px;
  line-height: 33px;
  margin: 30px 0 70px;
`;

export const TutorialRadioBtnCircle = styled.div`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.basic.WHITE};
  border-radius: 50%;
  box-shadow: 0 0 0 1px ${colors.accent.CIVIL_GRAY_2};
  height: 16px;
  left: 22px;
  position: absolute;
  top: 16px;
  width: 16px;
`;

export const TutorialRadioBtnContain = styled.div`
  width: 100%;

  input {
    display: none;
  }

  input:checked + button {
    background-color: ${colors.basic.WHITE};
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.accent.CIVIL_GRAY_0};

    ${TutorialRadioBtnCircle} {
      background-color: ${colors.accent.CIVIL_BLUE};
      border: 1px solid ${colors.basic.WHITE};
      box-shadow: 0 0 0 1px ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export const TutorialRadioBtn: StyledComponentClass<ButtonProps, "button"> = styled(SecondaryButton)`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  color: ${colors.accent.CIVIL_GRAY_0};
  cursor: pointer;
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  letter-spacing: 0;
  line-height: 26px;
  margin-bottom: 15px;
  padding: 12px 15px 12px 55px !important;
  position: relative;
  text-align: left;
  text-transform: none;
  transition: border-color 0.2s ease;
  width: 100% !important;

  &:hover {
    background-color: ${colors.basic.WHITE};
    border-color: ${colors.accent.CIVIL_BLUE};
    color: ${colors.accent.CIVIL_GRAY_0};
  }
`;
