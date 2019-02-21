import * as React from "react";
import { AccountVerifyToken, AuthWrapper } from "@joincivil/components";
import { RouteComponentProps } from "react-router-dom";

export interface AuthVerifyTokenProps extends Partial<RouteComponentProps> {
  isNewUser: boolean;
  token: string;
  onAuthenticationContinue(isNewUser: boolean, redirectTo: string): void;
}

export const AuthVerifyToken: React.SFC<AuthVerifyTokenProps> = ({ token, onAuthenticationContinue, isNewUser }) => {
  return (
    <AuthWrapper>
      <AccountVerifyToken isNewUser={isNewUser} token={token} onAuthenticationContinue={onAuthenticationContinue} />
    </AuthWrapper>
  );
};
