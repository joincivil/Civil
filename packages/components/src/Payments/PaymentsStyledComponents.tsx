import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, InvertedButton } from "../Button";

export const PaymentOptionDescription = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 18px;
  margin: 10px 0;

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

export const PaymentNotice = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  line-height: 22px;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PaymentTerms = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 12px;
  line-height: 22px;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PaymentsUserInfoForm = styled.div`
  margin-bottom: 50px;
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
  margin-bottom: 50px;
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
  overflow: scroll;
  position: relative;
  max-width: 500px;
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

export const LearnMore = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 5px;
  font-size: 14px;
  line-height: 19px;
  padding: 15px;

  ${mediaQueries.MOBILE} {
    background-color: ${colors.accent.CIVIL_YELLOW_VERY_FADED};
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
  }
`;
