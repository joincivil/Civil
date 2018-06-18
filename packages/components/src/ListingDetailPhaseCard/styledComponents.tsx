import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StyledListingDetailPhaseCardContainer = styled.div`
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  padding: 30px 40px 50px;
  width: 485px;
`;

export const StyledListingDetailPhaseCardSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 23px 0 26px;
  text-align: left;

  &:nth-child(1) {
    border-top: 0;
  }
`;

export const StyledPhaseDisplayName = styled.h3`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.5px;
  line-height: 29px;
  margin: 0 0 24px;
`;

export const StyledListingDetailPhaseCardHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

export const MetaItemValue = styled.div`
  font-size: 24px;
  line-height: 29px;
`;
export const MetaItemValueAccent = MetaItemValue.extend`
  color: ${colors.primary.CIVIL_BLUE_1};
`;
export const MetaItemLabel = styled.div`
  font-size: 14px;
  line-height: 17px;
`;
export const CTACopy = styled.p`
  font-size: 18px;
  font-weight: bold;
  line-height: 33px;

  & a {
    text-decoration: none;
  }
`;
export const FormCopy = styled.p`
  font-size: 16px;
  line-height: 26px;
  margin: 0 0 10px;
`;
