import * as React from "react";
import { AccountEmailAuth, AuthApplicationEnum } from "@joincivil/components";
import { Link } from "react-router-dom";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthLogin: React.SFC<AuthLoginProps> = props => {
  return (
    <>
      <h1>Sign in with email</h1>
      <h5>Enter the address associated with your account, and we'll send a magic link to your inbox.</h5>
      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
      />

      <Link to="/auth/signup">Meant to signup?</Link>
    </>
  );
};
