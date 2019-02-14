import * as React from "react";
import { AccountEmailAuth, AuthApplicationEnum } from "@joincivil/components";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthLogin: React.SFC<AuthLoginProps> = props => {
  return (
    <>
      <AccountEmailAuth
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        onEmailSend={props.onEmailSend}
      />
    </>
  );
};
