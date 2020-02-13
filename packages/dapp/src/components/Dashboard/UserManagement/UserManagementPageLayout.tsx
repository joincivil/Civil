import * as React from "react";
import styled from "styled-components/macro";
import { colors, mediaQueries } from "@joincivil/elements";

const UserManagementPageHeader = styled.div`
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

const UserManagementPageContent = styled.div`
  margin: 0 auto 50px;
  max-width: 980px;
  width: 100%;
`;

export interface UserManagementPageLayoutProps {
  header: React.ReactElement;
  children: any;
}

export const UserManagementPageLayout: React.FunctionComponent<UserManagementPageLayoutProps> = props => {
  return (
    <>
      <UserManagementPageHeader>{props.header}</UserManagementPageHeader>
      <UserManagementPageContent>{props.children}</UserManagementPageContent>
    </>
  );
};
