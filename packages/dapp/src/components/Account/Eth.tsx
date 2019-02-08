import * as React from "react";
import { AccountEthAuth } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";

export interface AccountEthProps {
  onAuthentication(): void;
}

export const AccountEth: React.SFC<AccountEthProps> = props => {
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
