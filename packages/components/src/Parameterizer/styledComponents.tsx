import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StyledParameterizerContainer = styled.div`
  margin: 40px 0 0;
`;

export const StyledCreateProposalContainer = styled.div`
  background: ${colors.accent.CIVIL_GRAY_4};
  bottom: 0;
  border: 1px solid ${colors.accent.CIVIL_GRAY_3}
  font-family: ${fonts.SANS_SERIF};
  right: 0;
  top: 0;
  width: 634px;
`;

export const StyledChallengeProposalContainer = styled.div`
  background: ${colors.basic.WHITE};
  bottom: 0;
  border: 1px solid ${colors.accent.CIVIL_GRAY_3}
  font-family: ${fonts.SANS_SERIF};
  right: 0;
  top: 0;
  width: 634px;
`;

export const StyledCreateProposalOuter = styled.div`
  background: ${colors.basic.WHITE}9a; // 9a is hex for 60^
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  bottom 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;

  & ${StyledCreateProposalContainer},
  & ${StyledChallengeProposalContainer} {
    position: absolute;
  }
`;

export const StyledCreateProposalHeader = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  color: ${colors.basic.WHITE};
  font-size: 21px;
  font-weight: bold;
  letter-spacing: -0.45px;
  line-height: 25px;
  padding: 16px 40px;
  position: relative;
`;

export const StyledCreateProposalHeaderClose = styled.div`
  cursor: pointer;
  font-size: 21px;
  font-weight: bold;
  line-height: 21px;
  position: absolute;
  right: 14px;
  top: 11px;
`;

export const StyledCreateProposalContent = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 16px;
  line-height: 20px;
  padding: 24px 40px 40px;
`;

export const StyledSection = styled.div`
  margin: 0 0 19px;
`;

export const StyledMetaName = styled.div``;

export const StyledMetaValue = styled.div`
  font-weight: bold;
`;

export const MetaSingleLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 20px;

  & ${StyledMetaValue} {
    text-align: right;
  }
`;
