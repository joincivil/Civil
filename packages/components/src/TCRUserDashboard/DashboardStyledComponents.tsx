import * as React from "react";
import styled from "styled-components";
import { StyledTab, TabComponentProps } from "../Tabs";
import { LoadingMessage } from "../LoadingMessage";
import { Button, InvertedButton } from "../Button";
import { Dropdown, DropdownGroup, InputBase, InputIcon, DropdownItem } from "../input";
import { colors, fonts, mediaQueries } from "@joincivil/elements";

export const DashboardStylesNoticeContainer = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

export const StyledUserActivity = styled.div`
  background-color: transparent;
  flex-grow: 1;
  max-width: 800px;
  padding-right: 50px;
  ${mediaQueries.MOBILE} {
    padding: 0;
    max-width: 100%;
  }
`;

export const StyledUserActivityContent = styled.div`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: none;
`;

export const StyledDashboardTabsContainer = styled.div`
  background: ${colors.accent.CIVIL_GRAY_4};
`;

export const StyledDashboardTab = styled.li`
  color: ${(props: TabComponentProps) => (props.isActive ? colors.primary.CIVIL_BLUE_1 : colors.primary.CIVIL_GRAY_1)};
  border-bottom: ${(props: TabComponentProps) =>
    props.isActive ? "3px solid " + colors.primary.CIVIL_BLUE_1 : "none"};
  cursor: pointer;
  font-size: 18px;
  font-weight: ${(props: TabComponentProps) => (props.isActive ? "bold" : "normal")};
  line-height: 21px;
  white-space: nowrap;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 62px;
`;

export const StyledSubTabCount = styled.span`
  display: inline-block;
  border-radius: 31px;
  font-size: 12px;
  line-height: 15px;
  margin-left: 6px;
  padding: 3px 10px;
`;

export const StyledDashboardSubTab = styled(StyledTab)`
  white-space: nowrap;

  & ${StyledSubTabCount} {
    background-color: ${(props: TabComponentProps) =>
      props.isActive ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_GRAY_3};
  }
`;

export interface StyledDashboardActivityDescriptionProps {
  noBorder?: boolean;
}

export const StyledDashboardActivityDescription = styled.div<StyledDashboardActivityDescriptionProps>`
  ${props =>
    props.noBorder
      ? ""
      : `
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  `} font-size: 21px;
  font-weight: 300;
  line-height: 28px;
  letter-spacing: -0.14px;
  padding: 36px 24px;
`;

export const StyledUserInfo = styled.div`
  width: 333px;
  ${mediaQueries.MOBILE} {
    width: 100%;
  }
`;

export const StyledUserProfile = styled.div`
  width: 333px;
  ${mediaQueries.MOBILE} {
    width: 100%;
  }
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 22px;
`;

export const StyledAvatarContainer = styled.div`
  width: 76px;
  height: 76px;
  margin-right: 15px;
  position: relative;
  clip-path: circle(38px at center);
`;

export const StyledUserAvatar = styled.img`
  width: 76px;
  height: 76px;
  position: absolute;
  z-index: 999;
`;

export const StyledEditAvatar = styled.figure`
  width: 76px;
  height: 20px;
  position: absolute;
  top: 40px;
  left: -40px;
  background-color: #3e3e3e;
  opacity: 0.5;
  z-index: 10000;
`;

export const StyledEditSpan = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 76px;
  height: 20px;
  position: absolute;
  top: 55px;
  left: 0px;
  font-size: 14px;
  line-height: 17px;
  font-family: ${fonts.SANS_SERIF_BOLD};
  font-weight: 700;
  letter-spacing: 0.22px;
  color: ${colors.basic.WHITE};
  z-index: 20000;
  cursor: pointer;
`;

export const StyledUserNoAvatar = styled.div`
  display: flex;
  justify-content: space-around;
  width: 76px;
  height: 76px;
  align-items: center;
  background-color: #ef6b4a;
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.basic.WHITE};
  text-transform: uppercase;
  font-size: 50px;
`;

export const StyledUserHandleText = styled.span`
  font-size: 19px;
  font-weight: 600;
  height: 23px;
  letter-spacing: -0.04px;
  line-height: 23px;
  max-width: 242px;
  text-overflow: ellipsis;
`;

export const StyledUserEmailText = styled.span`
  font-size: 16px;
  font-weight: 400;
  height: 23px;
  letter-spacing: -0.04px;
  line-height: 23px;
`;

export const StyledUserSetEmailText = styled.span`
  font-size: 12px;
  font-weight: 300;
  height: 23px;
  letter-spacing: -0.04px;
  line-height: 23px;
  color: ${colors.accent.CIVIL_BLUE};
  cursor: pointer;
`;

export const StyledChangeUserEmailText = styled.span`
  font-size: 12px;
  font-weight: 300;
  height: 23px;
  letter-spacing: -0.04px;
  line-height: 23px;
  margin-left: 2px;
  color: ${colors.accent.CIVIL_BLUE};
  cursor: pointer;
`;

export const StyledChangeUserAvatarText = styled.span`
  font-size: 12px;
  font-weight: 300;
  height: 23px;
  letter-spacing: -0.04px;
  line-height: 23px;
  color: ${colors.accent.CIVIL_BLUE};
`;

export const StyledUserEmailContainer = styled.div`
  flex-direction: row;
`;

export const StyledUserHandleAndEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 76px;
`;

export const StyledUserInfoSectionLabel = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.93px;
  line-height: 15px;
  text-transform: uppercase;
`;

export const StyledUserInfoSectionValue = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  text-align: right;

  & strong {
    display: block;
    font-size: 18px;
    font-weight: bold;
    line-height: 21px;
  }
`;

export const StyledUserInfoSection = styled.div`
  display: flex;
  margin: 24px 0;
  min-height: 30px;
  justify-content: space-between;

  ${StyledUserInfoSectionLabel} {
    width: 40%;
  }
`;

export const StyledUserInfoButtonSection = styled.div`
  margin: 24px 0;

  & ${Button}, & ${InvertedButton} {
    margin: 0 0 19px;
    padding: 14px 0;
    text-align: center;
    text-transform: none;
    width: 100%;
  }
`;

// '32' == 20% in hexadecimal
export const StyledUserAddress = styled.div`
  border-bottom: 1px solid ${colors.basic.WHITE}32;
  font-size: 16px;
  font-family: ${fonts.MONOSPACE};
  line-height: 26px;
  padding: 0 0 24px;
  margin: 15px 0;
`;

// Activity Items
export const StyledDashboardActivityItem = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  display: flex;
  padding: 25px 0;
  margin: 0 25px;
  justify-content: space-between;
`;

export const StyledItemCheckboxContainer = styled.div`
  margin: 0 23px 0 0;
  padding: 15px 0 0;
  width: 20px;
`;

export const StyledDashboardActivityItemIcon = styled.div`
  margin-right: 16px;
  width: 50px;
`;

export const StyledDashboardActivityItemDetails = styled.div`
  flex-grow: 1;
  font-size: 14px;
  line-height: 22px;
  margin-right: 30px;
`;

export const StyledDashboardActivityItemAction = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  text-align: right;
  min-width: 30%;

  ${InvertedButton} {
    display: block;
    margin: 0 0 27px;
    white-space: nowrap;
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
    font-weight: bold;
    font-size: 14px;
    line-height: 14px;
    white-space: nowrap;
  }
`;

export const StyledDashboardActivityItemTitle = styled.h4`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-weight: 800;
  font-size: 18px;
  line-height: 21px;
  margin: 0 0 10px;
`;

export const StyledDashboardActivityItemSubTitle = styled.h4`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-weight: 800;
  font-size: 18px;
  line-height: 21px;
  margin: 10px 0;
`;

export const StyledDashbaordActvityItemSectionOuter = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledChallengeSummarySection = styled.div`
  flex-grow: 1;
`;

export const StyledDashbaordActvityItemSection = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  background: ${colors.accent.CIVIL_GRAY_5};
  box-shadow: inset 0 -1px 0 0 ${colors.accent.CIVIL_GRAY_4};
  padding: 10px 24px 21px;
`;

export const StyledDashbaordActvityItemHeader = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 33px;
  margin: 0 0 8px;
`;

export const StyledDashbaordActvityItemSectionInner = styled.div`
  padding-left: 23px;
`;

export const StyledChallengeIDKicker = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  margin: 0 0 3px;
  text-transform: uppercase;
`;

export const StyledNewsroomName = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 33px;
  margin: 0;
`;

export const StyledNumTokensContainer = styled.div`
  color: ${colors.accent.CIVIL_BLUE};
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  padding: 15px 0 0;
  text-align: right;
`;

// Transfer Tokens

export const StyledTransferTokenTitle = styled.div`
  font-family: ${fonts.SANS_SERIF};
  text-align: center;
  margin: 0 0 40px;
  padding: 20px;
  flex-grow: 1;

  h3 {
    font-size: 20px;
    font-weight: bold;
    line-height: 32px;
    margin: 0 0 10px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 16px;
    line-height: 26px;
    margin: 0;
  }
`;

export const StyledTransferTokenForm = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 400;
  margin: 0 auto 45px;
  padding: 35px;
`;

export const StyledTransferTokenFormGroup = styled.div`
  margin: 0 auto;
  max-width: 460px;

  ${Dropdown} {
    border: 1px solid ${colors.accent.CIVIL_GRAY_3};
    border-radius: 3px;
    font-size: 15px;
    margin-top: 5px;

    & > div:nth-child(2) > div {
      border-top: none;
      box-shadow: none;
      left: -1px;
      top: -1px;
      width: calc(100% + 2px);
      max-width: unset;

      :before,
      :after {
        display: none;
      }
    }

    ${DropdownGroup} {
      li {
        border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
        display: flex;
        justify-content: space-between;
      }
    }

    ${DropdownItem} {
      padding: 0;

      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 17px 50px 17px 15px;
        width: 100%;
      }
    }
  }

  ${InputBase} {
    margin-bottom: 3px;
    position: relative;

    > input,
    > textarea {
      border: 1px solid ${colors.accent.CIVIL_GRAY_3};
      border-radius: 3px;
      padding: 15px;
    }

    > input:focus,
    > textarea:focus {
      border: 1px solid ${colors.accent.CIVIL_BLUE};
    }
  }

  label {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
  }

  ${InputIcon} {
    background-color: ${colors.basic.WHITE};
    left: calc(100% - 50px);
    position: absolute;
    top: 42px;
    z-index: 2;
  }
`;

export const StyledTransferTokenFormElement = styled.div`
  margin-bottom: 25px;
`;

export const StyledInputLabel = styled.label`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 14px;
`;

export const StyledTransferTokenTip = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  line-height: 18px;
`;

export const StyledTransferTokenDropdown = styled.div`
  padding: 17px 50px 17px 15px;
  position: relative;
`;

export const StyledTransferTokenBalance = styled.div`
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  width: 100%;
`;

export const StyledDropdownArrow = styled.div`
  align-items: center;
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_3};
  display: flex;
  justify-content: center;
  padding: 12px 15px 12px 14px;
  position: absolute;
  right: 0;
  top: calc(50% - 14px);
`;

export const StyledFromBalance = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 3px;
  margin-top: 5px;
  padding: 17px 15px;
`;

// Newsroom tab
export const StyledDashboardNewsroom = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  padding: 25px 0;
  margin: 0 25px;

  p {
    font-size: 14px;
    line-height: 20px;
  }
`;

export const StyledDashboardNewsroomName = styled.div`
  color: ${colors.primary.BLACK};
  font-size: 24px;
  line-height: 29px;
`;

export const StyledDashboardNewsroomSection = styled.div`
  margin: 0 0 26px;

  & ~ & {
    border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
    padding: 14px 0 0;
  }
`;

export const StyledDashboardNewsroomHdr = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 18px;
  line-height: 33px;
  margin-bottom: 15px;
`;

export const StyledDashboardNewsroomSubHdr = styled.div`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 25px;
`;

export const StyledDashboardNewsroomTerHdr = styled.p`
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  margin: 30px 0 10px;
`;

export const StyledDashboardNewsroomSectionContentRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledDashboardNewsroomLinks = styled.div`
  text-align: right;

  a {
    display: block;
    font-size: 13px;
    letter-spacing: 0.2px;
    line-height: 14px;
    margin: 0 0 20px;
  }
`;

export const StyledDashboardNewsroomBorder = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 10px 0 20px;
`;

export const StyledWarningText = styled.span`
  color: ${colors.accent.CIVIL_RED};

  & svg {
    margin: 0 2px -3px 0;
  }
`;

export const StyledDashboardNewsroomTokensContainer = styled.div`
  text-align: left;
  width: 30%;
`;

export const StyledDashboardNewsroomTokensLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 20px;
  margin: 7px 0 0;
`;

export const StyledCVLLabel = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 12px;
  font-weight: bold;
  letter-spacing: -0.07px;
  line-height: 15px;
`;

// No Content
export const StyledDashboardNoContent = styled.div`
  margin: 0 auto;
  padding: 60px 0 60px;
  text-align: center;
  flex-grow: 1;
  width: 740px;
  ${mediaQueries.MOBILE} {
    width: 100%;
  }
`;

export const StyledDashboardNoContentHdr = styled.div`
  color: ${colors.primary.CIVIL_GRAY_0};
  font-size: 21px;
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 33px;
  margin: 17px 0 2px;
`;

export const StyledDashboardNoContentCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_0};
  font-size: 16px;
  line-height: 30px;
  margin: 0 0 24px;
`;

export const StyledDashboardNoContentButtonContainer = styled.div`
  ${InvertedButton} {
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0.2px;
    line-height: 14px;
    padding: 14px 0;
    text-transform: none;
    width: 236px;
  }
`;

// @ts-ignore: Looks like `React.FunctionComponent` type (which `LoadingMessage` is) doesn't play nicely with `styled` typings
export const StyledDashboardLoadingMessage = styled(LoadingMessage)`
  padding-top: 0;
  p {
    margin-top: 18px;
  }
`;

export const StyledEmbedCode = styled.pre`
  background: ${colors.accent.CIVIL_GRAY_5};
  margin-bottom: 10px;
  padding: 8px;
  white-space: pre-wrap;
  width: 100%;
  word-break: break-word;
`;
