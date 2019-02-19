import * as React from "react";
import {
  AccountEmailAuth,
  AuthApplicationEnum,
  PageHeadingCentered,
  PageHeadingTextCentered,
  AuthPageFooterLink,
  AuthFooterTerms,
} from "@joincivil/components";
import { Link } from "react-router-dom";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthLogin: React.SFC<AuthLoginProps> = props => {
  return (
    <>
      <PageHeadingCentered>Sign in with email</PageHeadingCentered>
      <PageHeadingTextCentered>
        Enter the address associated with your account, and we'll send a magic link to your inbox.
      </PageHeadingTextCentered>

      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
      />

      <AuthPageFooterLink>
        <Link to="/auth/signup">Don't have an acount?</Link>
      </AuthPageFooterLink>
      <AuthFooterTerms />
    </>
  );
};
