import * as React from "react";
import { EthAddress } from "@joincivil/typescript-types";

import AuthWeb3 from "./AuthWeb3";

export interface AuthWeb3LoginProps {
  onAuthenticated?(address: EthAddress): void;
  onSignUpContinue?(): void;
  onOuterClicked?(): void;
  onSignUpClicked?(): void;
  onLogInNoUserExists?(): void;
  onUserSelectSignUp?(): void;
}

export interface AuthLoginDropdownProps {
  target?: JSX.Element;
}

export const AuthWeb3LoginPage: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return (
    <AuthWeb3
      messagePrefix="Log in to Civil"
      onOuterClicked={props.onOuterClicked}
      onSignUpContinue={props.onSignUpContinue}
      onLogInNoUserExists={props.onLogInNoUserExists}
      onUserSelectSignUp={props.onUserSelectSignUp}
    />
  );
};

export default AuthWeb3LoginPage;
