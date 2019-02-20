import * as React from "react";
import { AccountEthAuth, AuthWrapper } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";

export interface AuthEthProps {
  onAuthentication(): void;
}

export const AuthEth: React.SFC<AuthEthProps> = props => {
  return (
    <AuthWrapper>
      <AccountEthAuth
        civil={getCivil()}
        onAuthenticated={() => {
          props.onAuthentication();
        }}
      />
    </AuthWrapper>
  );
};
