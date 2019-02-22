import * as React from "react";
import {
  AccountEmailAuth,
  AuthApplicationEnum,
  AuthPageFooterLink,
  AuthWrapper,
  AuthTextCreateAccount,
} from "@joincivil/components";
import { Link } from "react-router-dom";

export interface AuthSignupProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthSignup: React.SFC<AuthSignupProps> = props => {
  return (
    <AuthWrapper>
      <AuthTextCreateAccount />

      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={true}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
      />

      <AuthPageFooterLink>
        <Link to="/auth/login">Already have an account?</Link>
      </AuthPageFooterLink>
    </AuthWrapper>
  );
};