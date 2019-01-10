import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, ButtonProps } from "../Button";

export const TokenAccountOuter = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 20px 20px 50px;
  width: 100%;
`;

export const TokenAccountInner = styled.div`
  width: 1200px;
`;

export const TokenBtns: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  border-radius: 1px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.3px;
  padding: 15px 45px;
  text-transform: none;
`;

export const FlexColumns = styled.div`
  display: flex;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const FlexColumnsPrimary = styled.div`
  margin-right: 30px;
  width: calc(100% - 380px);

  ${mediaQueries.MOBILE} {
    margin-right: 0;
    width: auto;
  }
`;

export const FlexColumnsPrimaryModule = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  background-color: ${colors.basic.WHITE};
  margin-bottom: 30px;
  padding: 30px 0;
`;

export const FlexColumnsSecondary = styled.div`
  width: 350px;

  ${mediaQueries.MOBILE} {
    width: auto;
  }
`;

export const FlexColumnsSecondaryModule = styled.div`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 30px;
  padding: 20px 30px;

  h3 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 18px;
    line-height: 28px;
    margin: 0 0 25px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 16px;
    line-height: 26px;

    a {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const TokenHeaderOuter = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 30px 10px;
  text-align: center;
  width: 100%;
`;

export const TokenHeader = styled.h2`
  color: ${colors.primary.BLACK};
  font-size: 27px;
  line-height: 39px;
  margin-bottom: 25px;
`;

export const TokenSetup = styled.p`
  color: ${colors.primary.BLACK};
  font-size: 24px;
  line-height: 29px;
  margin-bottom: 60px;
`;

export const TokenRequirement = styled.div`
  margin: 0 30px 0 50px;
  padding: 5px 20px 60px 35px;
  position: relative;

  h3 {
    font-family: ${fonts.SANS_SERIF};
    font-size: 19px;
    line-height: 32px;
    margin: 0 0 5px;
  }

  p {
    font-family: ${fonts.SANS_SERIF};
    font-size: 16px;
    line-height: 26px;
    margin: 0 0 30px;
  }
`;

export const TokenRequirementIcon = styled.div`
  align-items: center;
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_BLUE};
  border-radius: 50%;
  display: flex;
  height: 38px;
  justify-content: center;
  left: -21px;
  position: absolute;
  top: 0;
  width: 38px;
  z-index: 1;
`;

export const TokenRequirementFooter = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  justify-content: center;
  padding: 35px 30px 15px;
`;
