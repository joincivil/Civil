import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AccountEmailSent, AuthWrapper } from "@joincivil/components";

export interface AuthCheckEmailProps extends Partial<RouteComponentProps> {
  isNewUser: boolean;
  emailAddress: string;
  onSendAgain(): void;
}

export const AuthCheckEmail: React.SFC<AuthCheckEmailProps> = props => {
  const { isNewUser, emailAddress, onSendAgain } = props;

  return (
    <>
      <AuthWrapper>
        <AccountEmailSent isNewUser={isNewUser} emailAddress={emailAddress} onSendAgain={onSendAgain} />
      </AuthWrapper>
    </>
  );
};