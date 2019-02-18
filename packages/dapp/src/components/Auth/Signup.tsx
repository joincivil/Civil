import * as React from "react";
import {
  AccountEmailAuth,
  AuthApplicationEnum,
  PageSubHeadingCentered,
  PageHeadingCentered,
  PageFooterTextCentered,
} from "@joincivil/components";

import { Link } from "react-router-dom";

export interface AuthSignupProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthSignup: React.SFC<AuthSignupProps> = props => {
  return (
    <>
      <PageHeadingCentered>Login</PageHeadingCentered>
      <PageSubHeadingCentered>Let's get started</PageSubHeadingCentered>
      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={true}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
      />

      <PageFooterTextCentered>
        <Link to="/auth/login">Already have an account?</Link>
      </PageFooterTextCentered>
    </>
  );
};
