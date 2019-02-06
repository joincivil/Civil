import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, InvertedButton, ButtonProps } from "../Button";

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
  width: 100%;
`;

export const TutorialProgressBarActive = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 3px;
  height: 6px;
  width: ${(props: TutorialProgressBarProps) => (props.activeSlide / props.totalSlides * 100).toString()}%;
`;

export interface TutorialStyleProps {
  centerContent?: boolean;
  positionAbsolute?: boolean;
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
  margin: 0 auto 100px;
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

export interface TutorialButtonProps extends ButtonProps {
  positionAbsolute?: boolean;
}

export const TutorialBtn: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  border-radius: 1px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  padding: 14px;
  text-transform: none;
  width: 160px;
`;

export const TutorialInvertedBtn: StyledComponentClass<TutorialButtonProps, "button"> = styled(InvertedButton)`
  background-color: transparent;
  border-radius: 1px;
  font-size: 14px;
  font-weight: 700;
  ${(props: TutorialStyleProps) => (props.positionAbsolute ? "right: 0" : "")};
  letter-spacing: 0;
  padding: 12px;
  ${(props: TutorialStyleProps) => (props.positionAbsolute ? "position: absolute" : "")};
  text-transform: none;
  ${(props: TutorialStyleProps) => (props.positionAbsolute ? "top: 75px" : "")};
  width: 160px;
`;

export const TutorialQuizName = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 27px;
  font-weight: 300;
  letter-spacing: -0.14px;
  line-height: 30px;
`;

export const TutorialQuizQuestion = styled.h3`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: 700;
  line-height: 29px;
`;

export const TutorialCompletedHeader = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.58px;
  line-height: 39px;
  text-align: center;
`;

export const TutorialCompletedP = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  letter-spacing: -0.12px;
  line-height: 33px;
`;

export const TutorialOptionBox = styled.div`
  border: 1px solid ${colors.accent.CIVIL_BLUE};
  border-radius: 3px;
  margin-bottom: 15px;
  position: relative;
  transition: background-color 0.2s ease;
  width: 100%;

  input {
    cursor: pointer;
    left: 15px;
    position: absolute;
    top: 10px;
  }

  label {
    color: ${colors.accent.CIVIL_GRAY_0};
    cursor: pointer;
    display: block;
    font-family: ${fonts.SANS_SERIF};
    font-size: 16px;
    line-height: 26px;
    padding: 8px 15px 8px 40px;
  }

  &:hover {
    background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  }
`;
