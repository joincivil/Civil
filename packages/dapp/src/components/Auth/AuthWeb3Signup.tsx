import * as React from "react";
import gql from "graphql-tag";
import { Helmet } from "react-helmet";
import { EthAddress } from "@joincivil/core";
import AuthWeb3 from "./AuthWeb3";

const authSignupEthMutation = gql`
  mutation($input: UserSignatureInput!) {
    authWeb3: authSignupEth(input: $input) {
      token
      refreshToken
      uid
    }
  }
`;

export interface AuthWeb3SignUpProps {
  onAuthenticated?(address: EthAddress): void;
  onAuthenticationContinue?(isNewUser?: boolean, redirectUrl?: string): void;
}

const AuthWeb3Signup: React.FunctionComponent<AuthWeb3SignUpProps> = props => {
  const header = <>Sign up for Civil with your crypto wallet</>;
  return (
    <>
      <Helmet title={`Sign up - The Civil Registry`} />
      <AuthWeb3
        authMutation={authSignupEthMutation}
        messagePrefix="Sign up with Civil"
        header={header}
        buttonText="Sign up with MetaMask"
        {...props}
      />
    </>
  );
};

export default AuthWeb3Signup;
