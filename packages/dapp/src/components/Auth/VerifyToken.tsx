import * as React from "react";
import { AccountVerifyToken, AuthWrapper } from "@joincivil/components";

export interface AuthVerifyTokenProps {
  isNewUser: boolean;
  onAuthenticationContinue(isNewUser: boolean): void;
}

export const AuthVerifyToken: React.SFC<AuthVerifyTokenProps> = props => {
  return (
    <AuthWrapper>
      <AccountVerifyToken
        isNewUser={false}
        onAuthenticationContinue={(isNewUser: boolean) => props.onAuthenticationContinue(isNewUser)}
      />
    </AuthWrapper>
  );
};
