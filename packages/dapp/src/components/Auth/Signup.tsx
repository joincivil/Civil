import * as React from "react";
import {
  AccountEmailAuth,
  AuthApplicationEnum,
  PageSubHeadingCentered,
  PageHeadingCentered,
  PageHeadingTextCentered,
  AuthPageFooterLink,
  AuthWrapper,
} from "@joincivil/components";
import { Link } from "react-router-dom";

export interface AuthSignupProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthSignup: React.SFC<AuthSignupProps> = props => {
  return (
    <>
      <AuthWrapper>
        <PageHeadingCentered>Create your Civil account</PageHeadingCentered>
        <PageHeadingTextCentered>
          First, please enter your email address. Your email is used to send account related updates from Civil.
        </PageHeadingTextCentered>
        <PageSubHeadingCentered>Let's get started</PageSubHeadingCentered>

        <AccountEmailAuth
          applicationType={AuthApplicationEnum.STOREFRONT}
          isNewUser={true}
          onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
        />

        <AuthPageFooterLink>
          <Link to="/auth/login">Already have an account?</Link>
        </AuthPageFooterLink>
      </AuthWrapper>
    </>
  );
};
