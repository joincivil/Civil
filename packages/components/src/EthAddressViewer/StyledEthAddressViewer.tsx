import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Button, InvertedButton } from "../Button";

import { colors, fonts, mediaQueries } from "../styleConstants";

export const StyledEthAddressViewer = styled.div`
  font-family: ${fonts.SANS_SERIF};
  margin: 0 0 30px;
`;

export const StyledDisplayName = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 21px;
  margin: 0 0 10px;
`;

export const StyledEthAddressContainer = styled.div`
  display: flex;

  ${mediaQueries.MOBILE} {
    display: block;
  }

  & > ${Button} {
    margin: 0 12px;
  }

  & > ${InvertedButton} {
    line-height: 28px;
  }

  ${mediaQueries.MOBILE} {
    display: block;

    & > ${Button} {
      margin: 10px 12px 0 0;
      line-height: 32px;
      width: 57%;
    }

    & > ${InvertedButton} {
      margin: 10px 0 0;
    }
  }
`;

export const StyledEthAddress = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.MONOSPACE};
  font-size: 14px;
  letter-spacing: -0.15px;
  line-height: 24px;
  padding: 11px 12px;
`;
