import * as React from "react";
import { AccountVerifyToken } from "@joincivil/components";

export interface AuthVerifyTokenProps {
  isNewUser: boolean;
  onAuthenticationContinue(isNewUser: boolean): void;
}

export const AuthVerifyToken: React.SFC<AuthVerifyTokenProps> = props => {
  return (
    <>
      <AccountVerifyToken
        isNewUser={false}
        onAuthenticationContinue={isNewUser => props.onAuthenticationContinue(isNewUser)}
      />
    </>
  );
};
