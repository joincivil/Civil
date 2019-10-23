import * as React from "react";
import styled from "styled-components";
import { CurrencyErrorMsg } from "../CurrencyConverter";
import { InputBase, InputIcon, Button, InvertedButton, colors, fonts, mediaQueries } from "@joincivil/elements";

export const PaymentWrapperStyled = styled.div`
  padding: 20px;

  ${CurrencyErrorMsg} {
    bottom: 10px;
  }
`;

export const PaymentHeader = styled.div`
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 25px;

  h2 {
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
`;

export const PaymentHeaderFlex = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const PaymentHeaderNewsroom = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
`;

export const PaymentHeaderTip = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  line-height: 16px;
`;

export const PaymentHeaderBoostLabel = styled.span`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 17px;
  margin-right: 5px;
`;

export const PaymentHeaderAmount = styled.span`
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
`;

export const PaymentDirectionsStyled = styled.p`
  font-family: ${fonts.SANS_SERIF};
  font-size: 15px;
  line-height: 20px;
  margin: 0 0 20px;

  a:hover {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: underline;
  }
`;

export interface PaymentOptionProps {
  warning?: boolean;
}

export const PaymentOptionDescription = styled.p`
  color: ${(props: PaymentOptionProps) => (props.warning ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_1)};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 18px;
  margin: ${(props: PaymentOptionProps) => (props.warning ? "6px 0" : "6px 0 25px")};

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PaymentBtn = styled(Button)`
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 19px;
  padding: 10px 40px;
  text-transform: none;
  width: 100%;
`;

export const PaymentInvertedBtn = styled(InvertedButton)`
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 19px;
  padding: 10px 40px;
  text-transform: none;
  width: 100%;
`;

export const PaymentNotice = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  line-height: 22px;
  margin: 0 0 15px;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PaymentTerms = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 12px;
  line-height: 22px;
  margin: 15px 0 10px;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PaymentTypeLabel = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 15px;
  line-height: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const PaymentAmountEth = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 20px;
`;

export const PaymentsUserInfoForm = styled.div`
  margin-bottom: 50px;
  max-width: 500px;
  width: 100%;

  label {
    color: ${colors.accent.CIVIL_GRAY_1};
    display: block;
    font-size: 13px;
    line-height: 24px;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
  }
`;

export const PaymentWarning = styled.div`
  color: ${colors.accent.CIVIL_RED};
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 15px;

  svg {
    vertical-align: sub;
  }
`;

export const PaymentEthUserInfoForm = styled.div`
  margin-bottom: 20px;
  max-width: 500px;
  width: 100%;

  label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
  }
`;

export const PaymentsModalContain = styled.div`
  font-family: ${fonts.SANS_SERIF};
  max-height: 600px;
  max-width: 500px;
  overflow: scroll;
  padding: 20px;
  position: relative;
  width: 100%;
`;

export const PaymentsModalCloseBtn = styled(InvertedButton)`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 50%;
  padding: 0;
  height: 32px;
  position: absolute;
  right: 15px;
  top: 15px;
  width: 32px;

  svg path {
    transition: fill 0.2s ease;
  }

  &:focus,
  &:hover {
    background-color: ${colors.basic.WHITE};

    svg path {
      fill: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export const PaymentEthLearnMore = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 5px;
  display: flex;
  font-size: 14px;
  justify-content: center;
  line-height: 19px;
  margin-bottom: 20px;
  padding: 15px;

  ${mediaQueries.MOBILE} {
    font-size: 12px;
    letter-spacing: -0.07px;
    line-height: 18px;
  }

  a {
    cursor: pointer;
    margin-right: 30px;

    ${mediaQueries.MOBILE} {
      margin-right: 15px;
    }

    &:last-of-type {
      margin-right: 0;
    }

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }
  }
`;

export const PaymentsRadioBtnContain = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  margin-right: 10px;

  input {
    display: none;
  }

  input:checked + button {
    border: 2px solid ${colors.accent.CIVIL_BLUE};
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

export const PaymentsRadioBtn = styled.button`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 4px;
  cursor pointer;
  font-size: 18px;
  font-weight: 600;
  height: 75px;
  padding: 10px;
  transition: border 0.2s ease;
  width: 70px;

  span {
    display: block;
    font-size: 12px;
    font-weight: 400;
  }

  &:hover {
    border: 2px solid ${colors.accent.CIVIL_BLUE};
  }
`;

export const PaymentAmountNewsroom = styled.div`
  h3 {
    font-family: ${fonts.SANS_SERIF};
    font-size: 18px;
    font-weight: 600;
    line-spacing: 22px;
    margin: 0 0 10px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 14px;
    line-spacing: 17px;
    margin: 0 0 15px;
    text-align: center;
  }
`;

export const PaymentsShowInputBtn = styled.button`
  border: none;
  color: ${colors.accent.CIVIL_BLUE};
  cursor: pointer;
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-spacing: 17px;
  padding: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const PaymentAmountUserInput = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0 0;

  > div {
    padding: 0;
  }

  label {
    display: none;
  }

  ${InputBase} {
    padding-left: 25px;
    width: 150px;
  }

  ${InputIcon} {
    left: 9px;
    top: -40px;
    width: 18px;
  }
`;

export const PaymentAmountUserOptions = styled.div`
  margin: 20px 0;

  label {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 14px;
    margin-right: 8px;
  }
`;

export const PaymentLoginTitle = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  margin-bottom: 40px;
  text-align: center;
`;

export const PaymentLoginOption = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-bottom: 20px;
  padding-bottom: 15px;

  &:last-of-type {
    border-bottom: none;
    margin: 0;
    padding: 0;
  }

  button {
    margin-bottom: 12px;
  }
`;

export const PaymentLoginType = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  margin-bottom: 12px;
`;

export const PaymentLoginDescription = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 16px;
  margin-bottom: 12px;
`;
