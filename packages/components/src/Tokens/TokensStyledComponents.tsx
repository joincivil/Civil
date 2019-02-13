import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, ButtonProps, InvertedButton } from "../Button";

export interface TokenRequirementStyleProps {
  step?: string;
  padding?: boolean;
}

export const TokenAccountOuter = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 20px 20px 50px;
  width: 100%;
`;

export const TokenAccountInner = styled.div`
  width: 1200px;
`;

export const TokenBtns: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  border-radius: 1px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: none;
`;

export const TokenBtnsInverted: StyledComponentClass<ButtonProps, "button"> = styled(InvertedButton)`
  border-radius: 1px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: none;
`;

export const FlexColumns = styled.div`
  display: flex;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const FlexColumnsPrimary = styled.div`
  margin-right: 30px;
  width: calc(100% - 380px);

  ${mediaQueries.MOBILE} {
    margin-right: 0;
    width: auto;
  }
`;

export const FlexColumnsPrimaryModule = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  background-color: ${colors.basic.WHITE};
  margin-bottom: 30px;
  ${(props: TokenRequirementStyleProps) => (props.padding ? "padding: 30px 0" : "")};
`;

export const FlexColumnsSecondary = styled.div`
  width: 350px;

  ${mediaQueries.MOBILE} {
    width: auto;
  }
`;

export const FlexColumnsSecondaryModule = styled.div`
  background-color: ${colors.basic.WHITE};
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 30px;
  padding: 20px 30px;

  h3 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 18px;
    line-height: 28px;
    margin: 0 0 25px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 16px;
    line-height: 26px;

    a {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const TokenHeaderOuter = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 30px 40px;
  text-align: center;
  width: 100%;
`;

export const TokenHeader = styled.h2`
  color: ${colors.primary.BLACK};
  font-size: 27px;
  line-height: 39px;
  margin-bottom: 25px;
`;

export const TokenSetup = styled.p`
  color: ${colors.primary.BLACK};
  font-size: 24px;
  line-height: 29px;
  margin-bottom: 60px;
`;

export const TokenAccountSectionHeader = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  margin: 0 0 30px;
  padding: 0 25px 30px;
  text-align: center;

  h3 {
    color: ${colors.primary.BLACK};
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    margin: 0 0 8px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 18px;
    letter-spacing: -0.12px;
    line-height: 33px;
    margin: 0;
  }
`;

export const TokenRequirement = styled.div`
  margin: 0 30px 0 50px;
  padding: ${(props: TokenRequirementStyleProps) =>
    props.step === "completed" ? "0 20px 0 35px" : "5px 20px 20px 35px"};
  position: relative;

  h3 {
    color: ${(props: TokenRequirementStyleProps) =>
      props.step === "completed" ? colors.primary.BLACK : colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 18px;
    font-weight: ${(props: TokenRequirementStyleProps) => (props.step === "completed" ? "400" : "600")};
    ${(props: TokenRequirementStyleProps) => (props.step === "completed" ? "letter-spacing: -0.12px;" : "")};
    line-height: 33px;
    margin: ${(props: TokenRequirementStyleProps) => (props.step === "completed" ? "0" : "0 0 5px")};
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 16px;
    line-height: 26px;
    margin: 0 0 30px;
  }
`;

export const TokenRequirementIcon = styled.div`
  align-items: center;
  background-color: ${colors.basic.WHITE};
  border: ${(props: TokenRequirementStyleProps) =>
    props.step === "disabled" ? "1px solid" + colors.accent.CIVIL_GRAY_3 : "1px solid" + colors.accent.CIVIL_BLUE};
  border-radius: 50%;
  display: flex;
  height: 38px;
  justify-content: center;
  left: -21px;
  position: absolute;
  top: 0;
  width: 38px;
  z-index: 1;
`;

export const TokenCheckIcon = styled.div`
  left: -21px;
  position: absolute;
  top: 0;
  z-index: 1;
`;

export const TokenBuySection = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 0 30px 5px;

  h4 {
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    margin: 0;
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    margin: 0;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 18px;
    letter-spacing: -0.12px;
    line-height: 33px;
    margin: 0 0 15px;
  }

  button {
    border-radius: 1px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: none;
  }
`;

export const TokenBuyIntro = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
  padding: 0 0 15px;
  margin: 0 0 25px;

  span {
    color: ${colors.accent.CIVIL_GRAY_0};
    display: block;
    font-size: 14px;
    line-height: 24px;
    margin: 0 0 15px;
  }
`;

export const TokenAirswapSection = styled.div`
  padding: 0 30px;
  text-align: center;

  button {
    diplay: block;
    width: 100%;
  }
`;

export const TokenOrBreak = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 50px 0;
  position: relative;

  p {
    background-color: ${colors.basic.WHITE};
    color: ${colors.accent.CIVIL_GRAY_3};
    font-size: 14px;
    left: calc(50% - 50px);
    letter-spacing: 0.88px;
    line-height: 1;
    margin: 0;
    position: absolute;
    text-transform: uppercase;
    top: -5px;
    width: 100px;
  }
`;

export const TokenProgressContain = styled.div`
  margin-bottom: 10px;

  h3 {
    color: ${colors.primary.BLACK};
    font-size: 16px;
    font-weight: bold;
    line-height: 26px;
    margin: 0 0 8px;

    svg {
      margin-right: 8px;
      vertical-align: text-bottom;
    }
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_2};
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.14px;
    line-height: 21px;
  }

  button {
    display: none;
  }
`;

export const TokenFAQCollapse = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  padding: 20px 30px;

  h3 {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    font-weight: bold;
    line-height: 32px;
    margin: 0;
  }
`;

export const CloseBtn: StyledComponentClass<ButtonProps, "button"> = styled(InvertedButton)`
  border: none;
  padding: 0;
  height: 40px;
  position: absolute;
  right: 50px;
  top: 45px;
  width: 40px;

  svg path {
    transition: fill 0.2s ease;
  }

  &:focus,
  &:hover {
    background-color: transparent;

    svg path {
      fill: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export const TokenExchangeSection = styled.div`
  button {
    background-color: transparent;
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.accent.CIVIL_BLUE};
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      background-color: ${colors.accent.CIVIL_BLUE};
      color: ${colors.basic.WHITE};
    }
  }
`;

export const TokenCalcCVL = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  margin: 70px 0 0;
  text-align: center;

  span {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }

  h4 {
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -0.58px;
    line-height: 39px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
  }
`;

export const TokenThanksPurchase = styled.div`
  text-align: center;

  h3 {
    font-size: 20px;
    font-weight: bold;
    line-height: 32px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    line-height: 20px;
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover,
    &:focus {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }
  }
`;

export const TokenUnlock = styled.div`
  background-color: #fff7f8;
  border: 1px solid ${colors.accent.CIVIL_RED_FADED};
  border-radius: 4px;
  padding: 20px;

  h4 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    line-height: 20px;
  }

  button {
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    padding: 16px 40px;
  }
`;
