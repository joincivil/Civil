import * as React from "react";
import {
  AccountEmailAuth,
  AuthApplicationEnum,
  AuthPageFooterLink,
  AuthWrapper,
  AuthTextSigninWithEmail,
} from "@joincivil/components";
import { Link } from "react-router-dom";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthLogin: React.FunctionComponent<AuthLoginProps> = props => {
  return (
    <AuthWrapper>
      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
        headerComponent={<AuthTextSigninWithEmail />}
        loginPath="/auth/login"
        signupPath="/auth/signup"
      />

      <AuthPageFooterLink>
        <Link to="/auth/signup">Don't have an account?</Link>
      </AuthPageFooterLink>
    </AuthWrapper>
  );
};
