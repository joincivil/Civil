import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, InvertedButton, ButtonProps } from "../Button";

export const TutorialTopProgress = styled.div`
  padding: 20px 0;
  width: 100%;
`;

export const TutorialTopProgressBar = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  height: 6px;
  width: 100%;
`;

export const TutorialTopicTitle = styled.div`
  font-family: ${fonts.SANS_SERIF};
`;

export const TutorialFooter = styled.div`
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
