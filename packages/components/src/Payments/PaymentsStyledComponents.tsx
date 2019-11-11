import * as React from "react";
import styled from "styled-components";
import { CurrencyErrorMsg } from "../CurrencyConverter";
import { InputBase, InputIcon, InvertedButton, colors, fonts, mediaQueries } from "@joincivil/elements";

export const PaymentWrapperStyled = styled.div`
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

export const PaymentAdjustedNotice = styled.div`
  background-color: rgba(255, 204, 0, 0.1);
  border-radius: 8px;
  color: ${colors.accent.CIVIL_GRAY_0};
  margin-bottom: 25px;
  padding: 15px 15px 12px;

  p {
    font-size: 13px;
    line-height: 18px;
    margin-top: 0;

    span {
      display: block;
      font-weight: 700;
    }
  }
`;

export const PaymentAdjustedNoticeFtr = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 17px;
  padding-top: 10px;
  text-align: right;

  span {
    color: ${colors.primary.BLACK};
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
  }
`;

export const PaymentFormWrapperStyled = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  font-family: ${fonts.SANS_SERIF};
  padding: 20px 15px;
  margin-bottom: 25px;
`;

export const PaymentHeaderBoostLabel = styled.span`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 17px;
  margin-right: 5px;
`;

export const PaymentHeaderAmount = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 18px;
  line-height: 22px;

  b {
    color: ${colors.primary.BLACK};
    font-weight: 700;
  }
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

export interface PaymentBtnProps {
  backgroundColor?: string;
}

export const PaymentBtn = styled.button`
  background-color: ${(props: PaymentBtnProps) =>
    props.backgroundColor ? props.backgroundColor : colors.accent.CIVIL_BLUE};
  border: none;
  border-radius: 3px;
  color: ${colors.basic.WHITE};
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  line-height: 19px;
  opacity: 1;
  padding: 10px 40px;
  transition: opacity 250ms;
  width: 100%;

  &:hover {
    opacity: 0.8;
  }
`;

export const PaymentInvertedBtn = styled(InvertedButton)`
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 19px;
  padding: 10px 40px;
  text-transform: none;
  width: 100%;
`;

export const PaymentTypeSelect = styled.div`
  padding-bottom: 40px;

  button {
    margin-bottom: 8px;
  }
`;

export const PaymentNotice = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 12px;
  line-height: 18px;
  margin: 0 0 15px;
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

export const PaymentInfoFlex = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
`;

export const PaymentSecure = styled.div`
  align-items: center;
  display: flex;
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 11px;
`;

export const PaymentTypeLabel = styled.div`
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  margin-bottom: 10px;
`;

export const PaymentAmountEth = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 20px;

  label {
    color: ${colors.accent.CIVIL_GRAY_1};
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.92px;
    margin-bottom: 2px;
    text-transform: uppercase;
  }

  span {
    color: ${colors.accent.CIVIL_GRAY_1};
  }
`;

export const PaymentInputLabel = styled.label`
  color: ${colors.accent.CIVIL_GRAY_1};
  display: block;
  font-size: 13px;
  line-height: 16px;
  margin-bottom: 5px;
`;

export interface PaymentWarningProps {
  redText?: boolean;
}

export const PaymentWarning = styled.div`
  color: ${(props: PaymentWarningProps) => (props.redText ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_1)};
  font-size: 13px;
  line-height: 22px;
  margin-bottom: 15px;

  svg {
    vertical-align: sub;
  }
`;

export interface PaymentModalProps {
  maxHeight: number;
}

export const PaymentModalContain = styled.div`
  font-family: ${fonts.SANS_SERIF};
  overflow: scroll;
  position: relative;
  max-height: ${(props: PaymentModalProps) => props.maxHeight + "px"};
  padding: 20px;
  width: 400px;

  ${mediaQueries.MOBILE_SMALL} {
    height: 100%;
    max-height: 100%;
    width: 100%;
  }
`;

export const PaymentModalCloseBtn = styled(InvertedButton)`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 50%;
  height: 32px;
  padding: 0;
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
  background-color: rgba(255, 204, 0, 0.1);
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

export const PaymentRadioBtnContain = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  margin-right: 4%;
  width: 22%;

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

export const PaymentRadioBtn = styled.button`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  height: 75px;
  padding: 10px;
  transition: border 0.2s ease;
  width: 100%;

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
    line-height: 22px;
    margin: 0 0 10px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 14px;
    line-height: 17px;
    margin: 0 0 15px;
    text-align: center;
  }
`;

export const PaymentGhostBtn = styled.button`
  background-color: ${colors.basic.WHITE};
  border: none;
  color: ${colors.accent.CIVIL_BLUE};
  cursor: pointer;
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 17px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const PaymentAmountUserInput = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0 30px;

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
  display: flex;
  margin: 20px 0;

  label {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-family: ${fonts.SANS_SERIF};
    font-size: 14px;
    margin-right: 8px;
  }
`;

export const PaymentLoginOrGuestWrapper = styled.div`
  padding: 20px;
`;

export const PaymentLoginOrGuestTitle = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  margin-bottom: 40px;
  text-align: center;
`;

export const PaymentLoginOrGuestOption = styled.div`
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

export const PaymentLoginOrGuestType = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  margin-bottom: 12px;
`;

export const PaymentLoginOrGuestDescription = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 16px;
  margin-bottom: 12px;
`;

export const PaymentInfoStyled = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 22px;
  padding: 20px 0;

  span {
    color: ${colors.primary.BLACK};
    display: block;
    font-weight: 700;
    margin: 0;
  }
`;

export const PaymentExpress = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_1};
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  padding: 20px 0 15px;
  text-align: center;
  width: 100%;

  label {
    line-height: 14px;
    margin-bottom: 10px;
  }
`;

export const PaymentOrBorder = styled.div`
  height: 1px;
  margin: 10px 10%;
  position: relative;
  width: 90%;

  &:after {
    content: "Or";
    left: calc(50% - 25px);
    position: absolute;
    text-align: center;
    top: calc(50% - 25px);
    width: 50px;
  }
`;

export const PaymentEdit = styled.div`
  align-items: center;
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const PaymentHide = styled.div`
  visibility: hidden;
`;
