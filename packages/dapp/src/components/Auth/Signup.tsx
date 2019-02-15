import * as React from "react";
import { AccountEmailAuth, AuthApplicationEnum } from "@joincivil/components";

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
    </>
  );
};
