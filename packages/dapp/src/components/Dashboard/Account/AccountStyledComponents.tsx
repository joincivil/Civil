import * as React from "react";
import { colors, fonts } from "@joincivil/elements";
import styled from "styled-components/macro";

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
