import * as React from "react";
import { AccountVerifyToken } from "@joincivil/components";

export interface AuthVerifyTokenProps {
  isNewUser: boolean;
}

export const AuthVerifyToken: React.SFC<AuthVerifyTokenProps> = props => {
  return (
    <>
      <AccountVerifyToken isNewUser={false} onAuthenticationContinue={this.handleOnAuthenticationContinue} />
    </>
  );
};
