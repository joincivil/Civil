import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const CurrencyConverterContain = styled.div`
  align-items: flex-end;
  display: flex;
  font-family: ${fonts.SANS_SERIF};
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
  margin: 16px;
`;
