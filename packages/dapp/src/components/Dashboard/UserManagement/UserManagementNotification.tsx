import * as React from "react";
import styled from "styled-components/macro";
import { colors, CloseXIcon } from "@joincivil/elements";

const UserManagementNotificationStyled = styled.div`
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

const UserManagementNotificationClose = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 2px;
`;

export interface UserManagementNotificationProps {
  text: string | React.ReactElement;
  handleClose(): void;
}

export const UserManagementNotification: React.FunctionComponent<UserManagementNotificationProps> = props => {
  return (
    <UserManagementNotificationStyled>
      {props.text}
      <UserManagementNotificationClose onClick={() => props.handleClose()}>
        <CloseXIcon color={colors.accent.CIVIL_GRAY_0} />
      </UserManagementNotificationClose>
    </UserManagementNotificationStyled>
  );
};
