import * as React from "react";
import { AccountVerifyToken, AuthWrapper } from "@joincivil/components";
import { RouteComponentProps, Redirect } from "react-router-dom";

export interface AuthVerifyTokenProps extends Partial<RouteComponentProps> {
  isNewUser: boolean;
  token?: string;
  onAuthenticationContinue(isNewUser: boolean): void;
  onTokenValidation(isNewUser: boolean): void;
}

export const AuthVerifyToken: React.SFC<AuthVerifyTokenProps> = ({
  token,
  onAuthenticationContinue,
  onTokenValidation,
  isNewUser,
}) => {
  if (!token) {
    const target = isNewUser ? "/auth/signup" : "/auth/login";

    return <Redirect to={target} />;
  }

  return (
    <AuthWrapper>
      <AccountVerifyToken
        isNewUser={isNewUser}
        token={token}
        onAuthenticationContinue={onAuthenticationContinue}
        onTokenValidation={onTokenValidation}
      />
    </AuthWrapper>
  );
};
