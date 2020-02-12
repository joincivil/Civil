import * as React from "react";
import { colors, fonts, mediaQueries, BorderlessButton } from "@joincivil/elements";
import styled from "styled-components/macro";
import { TabComponentProps } from "@joincivil/components";

export const AccountHeader = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 100px auto 50px;
  max-width: 980px;

  h1 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 32px;
    font-weight: bold;
    letter-spacing: -0.23px;
    margin: 0 0 20px;

    ${mediaQueries.MOBILE} {
      color: ${colors.primary.BLACK};
      font-size: 24px;
      line-height: 30px;
    }
  }
`;

export const AccountChangesSavedMessage = styled.div`
  background-color: rgba(36, 162, 73, 0.2);
  border-radius: 6px;
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 35px;
  padding: 10px 15px;
  position: relative;
  width: 100%;
`;

export const AccountMessegeClose = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 2px;
`;

export const AccountWrap = styled.div`
  margin: 0 auto 50px;
  max-width: 980px;
  width: 100%;
`;

export const AccountTabNav = styled.div`
  flex-shrink: 0;
  margin: 0 75px 0 0;
  width: 200px;

  & > ul {
    display: block;
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

export const AccountTabs = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_GRAY_6 : colors.basic.WHITE)};
  border-bottom: ${(props: TabComponentProps) =>
    props.isActive ? "1px solid" + colors.accent.CIVIL_PURPLE_1 : "1px solid transparent"};
  cursor: pointer;
  padding: 15px;
  text-decoration: none;
  transition: background-color 500ms, border 500ms;

  ${mediaQueries.HOVER} {
    &:hover {
      border-bottom: 1px solid ${colors.accent.CIVIL_PURPLE_1};
    }
  }
  &.active {
    border-bottom: 1px solid ${colors.accent.CIVIL_PURPLE_1};
  }
`;

export const AccountTabText = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;

  span {
    color: ${colors.accent.CIVIL_GRAY_2};
    display: block;
    font-size: 12px;
    font-weight: 400;
    height: 15px;
  }
`;

export const AccountSectionWrap = styled.div`
  width: 90%;
  min-width: 300px;

  ${BorderlessButton} {
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0.2px;
    line-height: 14px;
    margin: 0;
    padding: 0;
    text-transform: none;
  }
`;
export const AccountTransactionsSectionWrap = styled(AccountSectionWrap)`
  width: 100%;
`;

export const AccountSectionHeader = styled.div`
  h2 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 24px;
    font-weight: bold;
    line-height: 26px;
    margin: 0 0 15px;
  }

  p {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const AccountProfileTable = styled.table`
  margin-bottom: 20px;
  width: 100%;

  th {
    font-size: 14px;
    font-weight: 800;
    line-height: 17.5px;
    padding: 10px 0;
    text-align: left;
    width: 150px;
    vertical-align: top;
  }

  td {
    padding: 10px 0;
    text-align: left;
    vertical-align: top;
  }
`;

export const AccountPaymentSection = styled.div`
  margin-bottom: 50px;
`;

export const AccountPaymentSectionHeader = styled.div`
  h3 {
    font-size: 18px;
    font-weight: bold;
    line-height: 26px;
  }
`;

export const AccountPaymentTable = styled.table`
  margin-bottom: 20px;
  width: 100%;

  th {
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
    color: ${colors.accent.CIVIL_GRAY_2};
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
  }

  td {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 13px;
    line-height: 24px;
    text-align: left;

    b {
      font-weight: 600;
    }

    a {
      color: ${colors.accent.CIVIL_BLUE};
      font-weight: 600;
    }
  }
`;

export const AccountPaymentWallet = styled.div`
  margin-bottom: 20px;

  label {
    color: ${colors.accent.CIVIL_GRAY_2};
    font-size: 13px;
    line-height: 24px;
  }
`;

export const AccountPaymentWalletAddress = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.MONOSPACE};
  font-size: 14px;
  letter-spacing: -0.15px;
  line-height: 20px;
  margin-bottom: 10px;
`;

export const AccountPaymentWalletBalance = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 15px;
  line-height: 22px;
`;

export const AccountAvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 125px;
`;

export const AccountAvatarImgContainer = styled.div`
  clip-path: circle(62px at center);
  height: 125px;
  margin-bottom: 10px;
  position: relative;
  width: 125px;
`;

export const AccountAvatarImg = styled.img`
  height: 125px;
  position: absolute;
  width: 125px;
  z-index: 999;
`;

export const AccountNoAvatar = styled.div`
  align-items: center;
  background-color: #ef6b4a;
  color: ${colors.basic.WHITE};
  display: flex;
  font-size: 50px;
  height: 125px;
  justify-content: space-around;
  text-transform: uppercase;
  width: 125px;
`;

export const AccountUserInfoText = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 14px;
  margin-right: 10px;
`;

export const AccountTransactionsTable = styled(AccountPaymentTable)`
  tr:nth-child(2n) {
    background: ${colors.accent.CIVIL_GRAY_5};
  }
  td {
    padding: 2px 4px;
    svg {
      position: relative;
      top: 2px;
    }
  }
`;
export const NoWrapTd = styled.td`
  white-space: nowrap;
`;
