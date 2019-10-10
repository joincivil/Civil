import * as React from "react";
import { MetaMaskFrontIcon } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";

import AuthButtonContent from "./AuthButtonContent";
import AuthWeb3 from "./AuthWeb3";

const ethereumLoginButtonContent: JSX.Element = (
  <AuthButtonContent
    image={<MetaMaskFrontIcon height="36px" width="36px" />}
    header="Log in with Ethereum"
    content="Use any Ethereum wallet like MetaMask to log in."
  />
);

export interface AuthWeb3LoginProps {
  onAuthenticated?(address: EthAddress): void;
  onSignUpContinue?(): void;
  onOuterClicked?(): void;
  onSignUpClicked?(): void;
  onLogInNoUserExists?(): void;
}

export interface AuthLoginDropdownProps {
  target?: JSX.Element;
}

export const AuthWeb3LoginComponent: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return (
    <AuthWeb3
      messagePrefix="Log in to Civil"
      buttonText={ethereumLoginButtonContent}
      onSignUpContinue={props.onSignUpContinue}
      onLogInNoUserExists={props.onLogInNoUserExists}
    />
  );
};

const AuthWeb3LoginPage: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return <AuthWeb3LoginComponent {...props} />;
};

export default AuthWeb3LoginPage;
