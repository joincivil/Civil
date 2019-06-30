import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";

export const CurrencyConverterSection = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 20px 0 10px;
  text-align: left;
`;

export const CurrencyConverterContain = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  position: relative;

  * {
    box-sizing: border-box;
  }
`;

export const CurrencyContain = styled.div`
  max-width: 250px;
  padding-bottom: 35px;
  width: 45%;
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
    padding: 12px 15px;

    ${mediaQueries.MOBILE} {
      padding: 10px;
    }
  }

  input {
    line-height: 24px;
  }

  & > div > div + div {
    font-size: 14px;
    line-height: 17px;

    ${mediaQueries.MOBILE} {
      right: 28px;
    }
  }
`;

export const CurrencyConvertedBox = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 3px;
  font-size: 15px;
  line-height: 24px;
  padding: 12px 53px 12px 12px;
  position: relative;
  width: 100%;

  ${mediaQueries.MOBILE} {
    padding: 10px 53px 10px 10px;
  }
`;

export const CurrencyConvertedPrice = styled.div`
  overflow: hidden;
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
  margin: 16px 16px 53px;

  ${mediaQueries.MOBILE} {
    margin: 10px 10px 53px;
  }
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
  bottom: 10px;
  padding-left: 22px;
  position: absolute;
  width: 100%;

  ${mediaQueries.MOBILE} {
    bottom: 0;
  }

  svg {
    left: 0;
    position: absolute;
    top: 0;
  }

  p {
    color: ${colors.accent.CIVIL_RED};
    font-family: ${fonts.SANS_SERIF};
    font-size: 12px;
    line-height: 15px;
    margin: 0;
  }
`;
