import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { StyledTab, TabComponentProps } from "../Tabs";
import { colors, fonts } from "../styleConstants";
import { Button, InvertedButton } from "../Button";
import { Dropdown, DropdownGroup, InputBase } from "../input";

export const StyledUserActivity = styled.div`
  background-color: transparent;
`;

export const StyledUserActivityContent = styled.h3`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: none;
  min-height: 400px;
`;

export const StyledDashboardTab = styled.li`
  color: ${(props: TabComponentProps) => (props.isActive ? colors.primary.BLACK : colors.primary.CIVIL_GRAY_1)};
  cursor: pointer;
  font-size: 18px;
  font-weight: ${(props: TabComponentProps) => (props.isActive ? "bold" : "normal")};
  line-height: 21px;
  margin: 0 12px 12px;
  white-space: nowrap;
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

export const StyledDashboardActivityDescription = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-size: 21px;
  font-weight: 300;
  line-height: 28px;
  letter-spacing: -0.14px;
  padding: 36px 24px;
`;

export const StyledUserInfo = styled.div`
  width: 277px;
`;

export const StyledUserInfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 0;

  & ${Button} {
    text-align: center;
    width: 100%;
  }
`;

// '80' is a hexidecimal number that equals  0.5 alpha
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
  font-size: 18px
  line-height: 21px;
  margin: 0 0 10px;
`;

export const StyledDashboardActivityItemSubTitle = styled.h4`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-weight: 800;
  font-size: 18px
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
  font-weight: 600
  line-height: 15px;
  margin: 0 0 3px;
  text-transform: uppercase;
`;

export const StyledNewsroomName = styled.div`
  font-size: 18px;
  font-weight: 600
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
  margin: 0 auto;
  max-width: 460px;

  ${Dropdown} {
    border: 1px solid ${colors.accent.CIVIL_GRAY_3};
    border-radius: 3px;
    font-size: 15px;
    margin-top 5px;
  }

  ${DropdownGroup} {
    > div:nth-child(2) {
      > div {
        left: 0;
        top: 10px;
        width: 100%;
        max-width: 100%;
      }
    }
  }

  ${InputBase} {
    margin-bottom: 3px;
  }

  label {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
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
  padding: 17px 45px 17px 15px;
  position: relative;
`;

export const StyledDropdownArrow = styled.div`
  align-items: center;
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_3}
  display: flex;
  justify-content: center;
  padding: 12px 15px 12px 14px;
  position: absolute;
  right: 0;
  top: calc(50% - 14px);
`;
