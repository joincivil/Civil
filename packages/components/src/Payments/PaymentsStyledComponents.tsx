import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, InvertedButton } from "../Button";
import { CivilIcon } from "../icons";
import { CurrencyErrorMsg } from "../CurrencyConverter";
import { RadioButtonDiv, RadioButton, SecondaryButton } from "@joincivil/elements";

export const PaymentWrapperStyled = styled.div`
  padding: 20px;

  ${CurrencyErrorMsg} {
    bottom: 10px;
  }
`;

export const PaymentHeader = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-bottom: 20px;
  padding: 40px 0 10px;
  position: relative;

  ${CivilIcon} {
    left: calc(50% - 25px);
    position: absolute;
    top: 5px;
  }
`;

export const PaymentBackBtn = styled.button`
  background-color: transparent;
  border: none;
  color: ${colors.accent.CIVIL_GRAY_2};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  left: 0;
  line-height: 17px;
  position: absolute;
  top: 5px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

export const PaymentAmountWrapper = styled.div`
  align-items: center;
  color: ${colors.accent.CIVIL_GRAY_1};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  justify-content: center;
  left: 0;
  line-height: 18px;
`;

export const PaymentAmount = styled.div`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  margin-left: 10px;
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

export const PaymentOptionDescription = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 18px;
  margin: 6px 0 25px;

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

  input {
    display: none;
  }

  input:checked + button {
    border: 2px solid ${colors.accent.CIVIL_BLUE};
  }
`;

export const PaymentsRadioBtn = styled.button`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 4px;
  padding: 15px;

  &:hover {
    border: 2px solid ${colors.accent.CIVIL_BLUE};
  }
`;
