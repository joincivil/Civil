import * as React from "react";
import styled from "styled-components/macro";
import { colors, BorderlessButton } from "@joincivil/elements";
import { UserManagementNotification } from "../UserManagement";

const UserManagementSectionStyled = styled.div`
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

const UserManagementSectionHeader = styled.div`
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

export interface UserManagementSectionProps {
  showNotification?: boolean;
  notificationText?: React.ReactElement;
  header: React.ReactElement;
  children: any;
}

export const UserManagementSection: React.FunctionComponent<UserManagementSectionProps> = props => {
  const [shouldShowNotification, setShouldShowNotification] = React.useState(props.showNotification || false);
  return (
    <UserManagementSectionStyled>
      {shouldShowNotification && (
        <UserManagementNotification
          text={props.notificationText || ""}
          handleClose={() => setShouldShowNotification(false)}
        />
      )}
      <UserManagementSectionHeader>{props.header}</UserManagementSectionHeader>
      {props.children}
    </UserManagementSectionStyled>
  );
};
