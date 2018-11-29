import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, ButtonProps } from "../Button";

import { NavArrowProps } from "./types";

export const NavContainer = styled.div`
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999999;
`;

export const NavOuter = styled.div`
  align-items: center;
  background-color: ${colors.primary.BLACK};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_1};
  color: ${colors.basic.WHITE};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 500;
  justify-content: space-between;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 15px 25px;
  position: relative;
  * {
    box-sizing: border-box;
  }

  ${mediaQueries.MOBILE} {
    justify-content: center;
  }
`;

export const NavLogo = styled.div`
  height: 21px;
  width: 72px;
`;

export const NavInner = styled.div`
  align-items: center;
  display: flex;
  & a {
    color: ${colors.basic.WHITE};
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: ${colors.accent.CIVIL_GRAY_2};
    }
  }
`;

export const NavAccent = styled.span`
  margin: 0 15px;
  &,
  & a {
    color: ${colors.accent.CIVIL_TEAL};
  }
`;

export const NavUser = styled.div`
  align-items: center;
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_1};
  cursor: pointer;
  display: flex;
  font-family: ${fonts.SERIF};
  height: 30px;
  justify-content: space-between;
  margin-left: 15px;
  padding-left: 15px
  width: 250px;

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const CvlContainer = styled.div`
  align-items: center;
  display: flex;
`;

export const UserCvlBalance = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  margin-left: 10px;
`;

export const UserCvlVotingBalance = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
`;

export const AvatarContainer = styled.div`
  align-items: center;
  display: flex;
  width: 60px;
`;

export const UserAvatar = styled.figure`
  background-color: ${colors.accent.CIVIL_TEAL};
  border: 2px solid ${colors.basic.WHITE};
  border-radius: 50%;
  height: 36px;
  margin: 0 8px 0 0;
  width: 36px;
`;

export const Arrow: StyledComponentClass<NavArrowProps, "div"> = styled<NavArrowProps, "div">("div")`
  border-bottom: 2px solid ${colors.basic.WHITE};
  border-left: 2px solid ${colors.basic.WHITE};
  height: 8px;
  transform: ${props => (props.isOpen ? "rotate(135deg)" : "rotate(-45deg)")};
  transition: transform 0.25s;
  width: 8px;
`;

export const LogInButton: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  margin-left: 10px;
`;

export const StyledNavDrawer = styled.div`
  background-color: ${colors.primary.BLACK};
  bottom: 0;
  min-height: 100%;
  position: fixed;
  overflow-y: scroll;
  padding-bottom: 100px;
  top: 62px;
  right: 0;
  width: 275px;
  z-index: 1;
  * {
    box-sizing: border-box;
  }

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const NavDrawerSection = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_1};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 25px;
`;

export const NavDrawerSectionHeader = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.92px;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

export const NavDrawerRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const NavDrawerRowLabel = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
`;

export const NavDrawerRowInfo = styled.div`
  text-align: right;
  width: 75%;
`;

export const NavDrawerPill = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 12px;
  color: ${colors.basic.WHITE};
  font-size: 14px;
  font-weight: 200;
  min-width: 28px;
  padding: 5px 8px;
  text-align: center;
`;

export const NavDrawerCvlBalance = styled.div`
  color: ${colors.basic.WHITE};
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
`;

export const UserAddress = styled.span`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.MONOSPACE};
  font-size: 16px;
  font-weight: 800;
  line-height: 26px;
  word-wrap: break-word;
`;

export const NavDrawerBuyCvlBtn = styled(Button)`
  font-weight: 600;
  margin-top: 20px;
  padding: 15px;
  text-align: center;
  width: 100%;
`;

export const CopyButton = styled(Button)`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 10px;
  padding: 5px;
`;

export const StyledNavMenuContainer = styled.div`
  align-items: center;
  display: flex;

  & > a {
    margin: 0 15px;
  }

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const StyledNavMenuResponsiveButton = styled.div`
  display: none;

  ${mediaQueries.MOBILE} {
    display: block;
    left: 0;
    position: absolute;
  }
`;

export const StyledNavMenuResponsiveContainer = styled.div`
  display: none;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const StyledMobileNavMenu = styled.div`
  background-color: ${colors.primary.BLACK};
  box-sizing: border-box;
  display: none;
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  position: fixed;
  overflow-y: scroll;
  padding: 0 45px 10px;
  top: 52px;
  left: 0;
  width: 100%;
  z-index: 1;
  * {
    box-sizing: border-box;
  }

  ${mediaQueries.MOBILE} {
    display: block;
  }

  & a {
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
    color: ${colors.basic.WHITE};
    display: block;
    margin: 0;
    padding: 15px 0;
    text-decoration: none;
    transition: color 0.2s;
    width: 100%;
    &:last-of-type {
      border-bottom: none;
    }
    &:hover {
      color: ${colors.accent.CIVIL_GRAY_2};
    }
  }
`;

export const StyledVisibleIfLoggedInLink = styled.span`
  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const DropDownContain = styled.div`
  padding: 6px 12px;
  position: relative;
  &:hover > div {
    display: block;
  }

  ${mediaQueries.MOBILE} {
    border-top: 1px solid ${colors.accent.CIVIL_GRAY_2};
    padding: 15px 0;
  }
`;

export const DropDownLabel = styled.span`
  align-items: center;
  display: flex;

  ${mediaQueries.MOBILE} {
    color: ${colors.accent.CIVIL_GRAY_2};
    display: block;
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
    padding-bottom: 15px;
  }
`;

export const DropDownArrow = styled.div`
  border-bottom: 2px solid ${colors.basic.WHITE};
  border-left: 2px solid ${colors.basic.WHITE};
  height: 8px;
  margin: 0 0 3px 5px;
  transform: rotate(-45deg);
  width: 8px;

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const DropDownLinks = styled.div`
  background-color: ${colors.primary.BLACK};
  display: none;
  left: 0;
  padding: 16px 16px 11px;
  position: absolute;
  top: 25px;

  ${mediaQueries.MOBILE} {
    display: block;
    padding: 0 0 0 16px;
    position: relative;
    top: 0;
  }

  & > a {
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
    display: block;
    margin: 0;
    padding: 15px 0;
    width: 100%;
    &:last-of-type {
      border-bottom: none;
    }
  }
`;
