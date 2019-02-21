import * as React from "react";
import { AccountEthAuth, AuthWrapper } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";

export interface AuthEthProps {
  onAuthentication(): void;
}

// TODO(jorgelo): Allow user to add their wallet ONLY after they are signed in .

export const AuthEth: React.SFC<AuthEthProps> = props => {
  return (
    <AuthWrapper>
      {/* TODO(jorgelo): Use Toby's new components */}
      <AccountEthAuth
        civil={getCivil()}
        onAuthenticated={() => {
          props.onAuthentication();
        }}
      />
    </AuthWrapper>
  );
};
