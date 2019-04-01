import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AccountEmailSent, AuthWrapper } from "@joincivil/components";

export interface AuthCheckEmailProps extends Partial<RouteComponentProps> {
  isNewUser: boolean;
  emailAddress: string;
  onSendAgain(): void;
}

export const AuthCheckEmail: React.FunctionComponent<AuthCheckEmailProps> = props => {
  const { isNewUser, emailAddress, onSendAgain } = props;

  // TODO(jorgelo): Maybe redirect if emailAddress is not set

  return (
    <>
      <AuthWrapper>
        <AccountEmailSent
          isNewUser={isNewUser}
          emailAddress={emailAddress || "no email set"} // The default keeps the page from breaking.
          onSendAgain={onSendAgain}
        />
      </AuthWrapper>
    </>
  );
};
