import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, InvertedButton, ButtonProps } from "../Button";

export const TutorialProgressContain = styled.div`
  padding: 20px 0;
  width: 100%;
`;

export const TutorialProgressBar = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  height: 6px;
  width: 100%;
`;

export const TutorialTopicTitle = styled.div`
  font-family: ${fonts.SANS_SERIF};
`;

export const TutorialTopicInfo = styled.div`
  font-family: ${fonts.SANS_SERIF};
`;

export const TutorialFooterContain = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  padding: 30px 0;
  width: 100%;
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
  border-radius: 1px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  padding: 12px;
  text-transform: none;
  width: 160px;
`;

export const TutorialSlideHeader = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  line-height: 29px;
  max-width: 540px;
`;

export const TutorialSlideP = styled.p`
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  line-height: 33px;
  max-width: 540px;
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
  padding: 5px;

  span {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-family: ${fonts.SANS_SERIF};
    font-size: 16px;
    line-height: 26px;
  }
`;
