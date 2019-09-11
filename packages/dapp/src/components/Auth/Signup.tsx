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

const AuthSignup: React.FunctionComponent<AuthSignupProps> = props => {
  console.log("Signup.tsx 1");
  return (
    <AuthWrapper>
      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={true}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
        headerComponent={<AuthTextCreateAccount />}
        loginPath="/auth/login"
        signupPath="/auth/signup"
      />

      <AuthPageFooterLink>
        <Link to="/auth/login">Already have an account?</Link>
      </AuthPageFooterLink>
    </AuthWrapper>
  );
};

export default AuthSignup;
