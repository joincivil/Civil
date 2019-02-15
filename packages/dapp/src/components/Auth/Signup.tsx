import * as React from "react";
import { AccountEmailAuth, AuthApplicationEnum } from "@joincivil/components";
import { Link } from "react-router-dom";

export interface AuthSignupProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthSignup: React.SFC<AuthSignupProps> = props => {
  return (
    <>
      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={true}
        onEmailSend={props.onEmailSend}
      />

      <Link to="/auth/login">Already have an account?</Link>
    </>
  );
};
