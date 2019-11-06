import * as React from "react";
import styled from "styled-components";
import { CollapsibleContainerProps } from "./CollapsibleContainer";
import { colors, fonts, mediaQueries } from "../styleConstants";

export const StyledCollapsibleContainerCount = styled.span`
  display: inline-block;
  border-radius: 31px;
  font-size: 12px;
  line-height: 15px;
  margin-left: 6px;
  padding: 3px 10px;
`;

/* Primary CollapsibleContainer styles used on the Dashboard page */
export const StyledCollapsibleContainerNav = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  height: 76px;
  margin: 0 auto 50px;
  width: 100%;

  & > ul {
    justify-content: center;
  }

  ${mediaQueries.MOBILE} {
    height: auto;
    margin-bottom: 30px;
    position: relative;

    & > ul {
      display: block;
      justify-content: left;
    }
  }
`;

// export const StyledNav = styled.nav`
//   border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_3};
// `;

export interface StyledResponsiveCollapsibleContainersToggleButtonProps {
  isOpen?: boolean;
}

export const StyledResponsiveCollapsibleContainersToggleButton = styled.div`

  display: block;
  position: absolute;
  right: 16px;
  top: 16px;
  transform: ${(props: StyledResponsiveCollapsibleContainersToggleButtonProps) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  z-index: 2;

  & svg {
    width: 16px;
    height: 26px;
  }
`;

export const StyledCollapsibleContainerHeader = styled.div`
  border-bottom: ${(props: CollapsibleContainerProps) =>
    props.isOpen ? "2px solid " + colors.accent.CIVIL_BLUE : "2px solid transparent"};
  color: ${(props: CollapsibleContainerProps) => (props.isOpen ? colors.primary.BLACK : colors.accent.CIVIL_GRAY_2)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  letter-spacing: -0.12px;
  margin-right: 0px;
  padding: 25px 0 15px;
  text-align: center;
  text-decoration: none;
  transition: background-color 500ms, border 500ms, color 500ms;

  ${mediaQueries.HOVER} {
    &:hover {
      border-bottom: 2px solid ${colors.accent.CIVIL_BLUE};
      color: ${colors.primary.BLACK};
    }
  }

  position: relative;
`;
