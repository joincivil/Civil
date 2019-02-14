import * as React from "react";
import { AccountEmailAuth } from "@joincivil/components";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export const AuthLogin: React.SFC<AuthLoginProps> = props => {
  return (
    <>
      <AccountEmailAuth isNewUser={false} onEmailSend={props.onEmailSend} />
    </>
  );
};
