import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { InvertedButton, ButtonProps } from "../Button";

export const TutorialIntro = styled.div`
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 12px;

  h2 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 28px;
    font-weight: 700;
    line-height: 39px;
    margin: 0 0 12px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 16px;
    line-height: 26px;
    margin: 0 0 35px;
  }
`;

export const TutorialTime = styled.div`
  align-items: center;
  color: ${colors.accent.CIVIL_GRAY_2};
  display: flex;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.87px;
  text-transform: uppercase;

  svg {
    margin-right: 7px;
  }
`;

export const TutorialSkipSection = styled.div`
  align-items: flex-start;
  background-color: ${colors.accent.CIVIL_TEAL_FADED_2};
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 20px 30px;

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 16px;
    line-height: 26px;
    margin: 0 35px 0 0;
  }
`;

export const TakeQuizBtns: StyledComponentClass<ButtonProps, "button"> = styled(InvertedButton)`
  background-color: transparent;
  border-radius: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  min-width: 170px;
  padding: 15px 30px;
  text-transform: none;
`;

export const TutorialTopic = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 30px;
`;

export const LaunchTopic = styled.a`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  cursor: pointer;
  display: block;
  padding: 30px;

  h3 {
    color: ${colors.accent.CIVIL_BLUE};
    font-size: 19px;
    font-weight: 400;
    line-height: 32px;
    margin: 0 0 5px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 16px;
    line-height: 26px;
    margin: 0;
  }
`;
