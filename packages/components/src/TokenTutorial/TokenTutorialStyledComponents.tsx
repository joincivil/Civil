import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, InvertedButton, ButtonProps } from "../Button";

export const TutorialContainer = styled.div`
  width: 100%;
`;

export const TutorialLandingContainer = styled.div`
  margin: 0 auto;
  max-width: 730px;
`;

export const WelcomeSlideBtns: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  border-radius: 1px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.3px;
  padding: 15px 15px;
  text-transform: none;
  width: 170px;
`;

export const WelcomeSlide = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  letter-spacing: -0.87px;
  margin: 0 auto;
  max-width: 500px;
  padding: 20px;
  text-align: center;

  svg {
    margin-bottom: 20px;
  }

  h2 {
    font-family: ${fonts.SANS_SERIF};
    font-size: 32px;
    font-weight: 300;
    line-height: 39px;
    margin: 0 0 10px;
    width: 100%;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 19px;
    line-height: 32px;
    margin: 0 0 30px;
    width: 100%;
  }
`;

export const SlideProgress = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 0 30px;
  width: 100%;

  svg {
    margin: 0 15px 0 0;

    &:last-of-type {
      margin: 0;
    }
  }
`;

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

export const TakeQuizBtn: StyledComponentClass<ButtonProps, "button"> = styled(InvertedButton)`
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
  margin-bottom: 15px;
`;

export const LaunchTopic: StyledComponentClass<ButtonProps, "button"> = styled(InvertedButton)`
  align-items: center;
  border: none;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  letter-spacing: 0;
  padding: 30px;
  text-align: left;
  text-transform: none;
  width: 100%;

  & > div {
    margin-right: 50px;
    padding-left: 75px;
    position: relative;

    svg {
      left: 0;
      position: absolute
      top: 5px;
    }
  }

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

  &:focus,
  &:hover {
    background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  }
`;

export const TopicProgress = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 16px;
  padding: 20px 30px;

  b {
    letter-spacing: 0.88px;
    font-size: 14px;
    line-height: 14px;
  }
`;

export interface TutorialLandingProgressBarProps {
  completed?: boolean;
}

export const TutorialLandingProgressBars = styled.div`
  align-items: center;
  display: flex;
  padding: 15px 0 5px;
`;

export const TutorialLandingProgressBar = styled.div`
  background-color: ${(props: TutorialLandingProgressBarProps) =>
    props.completed ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_4};
  height: 5px;
  margin-right: 5px;
  width: 100px;
`;

export const TutorialContain = styled.div`
  display: block;
  width: 100%;
`;
