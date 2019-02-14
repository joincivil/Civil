import * as React from "react";
import { AccountEthAuth } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";

export interface AuthEthProps {
  onAuthentication(): void;
}

export const AuthEth: React.SFC<AuthEthProps> = props => {
  return (
    <>
      <AccountEthAuth
        civil={getCivil()}
        onAuthenticated={() => {
          props.onAuthentication();
        }}
      />
    </>
  );
};
