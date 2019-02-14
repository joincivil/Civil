import * as React from "react";
import { AccountEmailSent } from "@joincivil/components";

export interface AuthCheckEmailProps {
  isNewUser: boolean;
}

export const AuthCheckEmail: React.SFC<AuthCheckEmailProps> = props => {
  return (
    <>
      <AccountEmailSent isNewUser={props.isNewUser} />
    </>
  );
};
