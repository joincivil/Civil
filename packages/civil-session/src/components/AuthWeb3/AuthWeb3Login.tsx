import * as React from "react";
import gql from "graphql-tag";
import { EthAddress } from "@joincivil/core";
import AuthWeb3 from "./AuthWeb3";

import { authLoginEthMutation } from "../../utils/queries";

export interface AuthWeb3LoginProps {
  onAuthenticated?(address: EthAddress): void;
  onAuthenticationContinue?(isNewUser?: boolean, redirectUrl?: string): void;
}

const AuthWeb3Login: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  const header = <>Log into Civil with your crypto wallet</>;
  return (
    <>
      <Helmet title={`Login - The Civil Registry`} />
      <AuthWeb3
        authMutation={authLoginEthMutation}
        messagePrefix="Log in to Civil"
        header={header}
        buttonText="Login with MetaMask"
        {...props}
      />
    </>
  );
};

export default AuthWeb3Login;
