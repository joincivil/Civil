import * as React from "react";
import { EthAddress } from "@joincivil/core";

import AuthWeb3 from "./AuthWeb3";

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
      onOuterClicked={props.onOuterClicked}
      onSignUpContinue={props.onSignUpContinue}
      onLogInNoUserExists={props.onLogInNoUserExists}
    />
  );
};

const AuthWeb3LoginPage: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return <AuthWeb3LoginComponent {...props} />;
};

export default AuthWeb3LoginPage;
