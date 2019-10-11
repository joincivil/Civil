import * as React from "react";
import { EthAddress } from "@joincivil/core";
import AuthWeb3 from "./AuthWeb3";

export interface AuthWeb3SignUpProps {
  onAuthenticated?(address: EthAddress): void;
  onSignUpContinue?(): void;
  onOuterClicked?(): void;
  onLoginClicked?(): void;
  onSignUpUserAlreadyExists?(): void;
}

const AuthWeb3SignupPage: React.FunctionComponent<AuthWeb3SignUpProps> = props => {
  return (
    <AuthWeb3
      messagePrefix="Sign up with Civil"
      onOuterClicked={props.onOuterClicked}
      onSignUpContinue={props.onSignUpContinue}
      onSignUpUserAlreadyExists={props.onSignUpUserAlreadyExists}
    />
  );
};

export default React.memo(AuthWeb3SignupPage);
