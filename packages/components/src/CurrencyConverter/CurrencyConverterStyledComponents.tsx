import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const CurrencyConverterSection = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 20px 0 10px;
  text-align: left;
`;

export const CurrencyConverterContain = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;

  * {
    box-sizing: border-box;
  }
`;

export const CurrencyContain = styled.div`
  width: 285px;
`;

export const CurrencyLabel = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 14px;
  line-height: 32px;
`;

export const StyledCurrencyInputWithButton = styled.div`
  & > div {
    font-size: 15px;
    line-height: 24px;
    padding: 15px 20px;
  }

  input {
    line-height: 24px;
  }

  & > div > div + div {
    font-size: 14px;
    line-height: 17px;
  }
`;

export const CurrencyConvertedBox = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 3px;
  font-size: 15px;
  line-height: 24px;
  padding: 15px 53px 15px 20px;
  position: relative;
  width: 100%;
`;

export const CurrencyCode = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 17px;
  position: absolute;
  right: 20px;
  text-align: right;
  top: calc(50% - 8px);
`;

export const CurrencyIconContain = styled.div`
  margin: 52px 16px 0 16px;
`;

export const CurrencyCalcCVL = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
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
    margin: 0;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    margin: 0;
  }
`;

export const CurrencyErrorMsg = styled.div`
  padding-left: 22px;
  margin-top: 10px;
  position: relative;

  svg {
    left: 0;
    position: absolute;
    top: 1px;
  }

  p {
    color: ${colors.accent.CIVIL_RED};
    font-family: ${fonts.SANS_SERIF};
    font-size: 12px;
    line-height: 18px;
    margin: 0;
  }
`;
