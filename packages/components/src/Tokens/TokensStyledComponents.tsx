import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, ButtonProps, InvertedButton } from "../Button";
import { TOKEN_PROGRESS } from "./Tokens";
import { TabComponentProps } from "../Tabs";
import { PaypalLogoIcon } from "../icons/logos";

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

export const TokenSection = styled.div`
  margin-bottom: 30px;
`;

const PAYPAL_BLUE = "rgba(43,86,255,0.5)";
const PAYPAL_BLUE_DARK = "#2b56ff";

export const PaypalDonateContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${PAYPAL_BLUE};
`;

export const PaypalDonateIconContainer = styled.div`
  padding: 18px 12px;
  border-right: 1px solid ${PAYPAL_BLUE};
`;

export const PaypalDonateIconButtonContainer = styled.div`
  flex-grow: 1;
`;

export const PaypalLogoContainer = styled.div`
  padding: 18px;
`;

export const PaypalDonateIconButton = styled.input`
  background: #fff;
  box-shadow: 0px 0px 0px transparent;
  border: 0px solid transparent;
  text-shadow: 0px 0px 0px transparent;
  color: ${PAYPAL_BLUE_DARK};
  padding: 20px;
  border-left: 1px solid ${PAYPAL_BLUE};
  flex-grow: 1;
  width: 100%;
  height: 100%;
  outline: none;
  font-weight: bold;

  &:hover {
    background: ${PAYPAL_BLUE_DARK};
    color: #fff;
    box-shadow: 0px 0px 0px transparent;
    border: 0px solid transparent;
    text-shadow: 0px 0px 0px transparent;
  }
`;

export const PaypalDonate: React.FunctionComponent = () => (
  <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
    <PaypalDonateContainer>
      <PaypalLogoContainer>
        <PaypalLogoIcon />
      </PaypalLogoContainer>
      <PaypalDonateIconButtonContainer>
        <PaypalDonateIconButton type="submit" value="Donate" />
      </PaypalDonateIconButtonContainer>
    </PaypalDonateContainer>
    <input type="hidden" name="cmd" value="_s-xclick" />
    <input type="hidden" name="hosted_button_id" value="7MGFAU85AUA46" />
    <img src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
  </form>
);

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

export const TokenHeader = styled.div`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 30px 40px;
  text-align: center;

  h2 {
    font-size: 27px;
    line-height: 39px;
    margin-bottom: 25px;
  }

  p {
    font-size: 24px;
    line-height: 29px;
    margin-bottom: 60px;
  }
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
    props.step === TOKEN_PROGRESS.DISABLED
      ? "1px solid" + colors.accent.CIVIL_GRAY_3
      : "1px solid" + colors.accent.CIVIL_BLUE};
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
    font-size: 16px;
    line-height: 24px;
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
  padding: 15px 30px 0 30px;
  text-align: center;

  button {
    diplay: block;
    width: 100%;
  }
`;

export const TokenSellSection = styled.div`
  margin: 0 auto;
  max-width: 450px;

  button {
    margin-top: 50px;
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

  span {
    margin-right: 15px;
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;
  }

  div {
    align-items: flex-start;
  }

  button {
    margin: 0 0 0 10px;
  }
`;

export const TokenFAQCollapse = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 21px;
  padding: 20px 30px;

  h3 {
    font-size: 14px;
    font-weight: bold;
    line-height: 32px;
    margin: 0;
  }

  li {
    margin-bottom: 15px;
  }
`;

export const TokenFAQImg = styled.div`
  align-items: flex-start;
  display: flex;

  img {
    margin-left: 50px;
    max-width: 250px;
    width: 50%;
  }
`;

export const TokenFAQLineBreak = styled.hr`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  margin: 20px 0;
  width: 15px;
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

export const TokenBuySellComplete = styled.div`
  margin-bottom: 35px;
  text-align: center;

  & > svg {
    margin 0 auto 5px;
  }

  h3 {
    font-size: 20px;
    font-weight: bold;
    line-height: 32px;
    margin-bottom: 14px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 17px;
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
    margin-bottom: 10px;

    svg {
      margin-right: 8px;
    }
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    line-height: 20px;

    b {
      font-weight: 700;
    }
  }

  a {
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    border-radius: 2px;
    padding: 16px 40px;
  }
`;

export const TokenBuySellTab = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? "transparent" : colors.accent.CIVIL_GRAY_4)};
  border-top: 1px solid ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : "transparent")};
  color: ${colors.primary.CIVIL_GRAY_1};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.12px;
  line-height: 33px;
  padding: 20px 0;
  text-align: center;
  text-decoration: none;
  transition: border-color 500ms;
  width: 50%;

  ${mediaQueries.HOVER} {
    &:hover {
      border-color: ${(props: TabComponentProps) =>
        props.isActive ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_3};
    }
  }
`;

export const TokenBuySellTabsNav = styled.div`
  height: 80px;
  margin: -31px 0 50px;
`;

export const ComingSoon = styled.div`
  text-align: center;

  h3 {
    margin-bottom: 10px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    line-height: 20px;

    a {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
