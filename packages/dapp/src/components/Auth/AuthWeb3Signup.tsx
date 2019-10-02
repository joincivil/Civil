import * as React from "react";
import { MetaMaskFrontIcon } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import AuthButtonContent from "./AuthButtonContent";
import AuthWeb3 from "./AuthWeb3";

const ethereumSignupButtonContent: JSX.Element = (
  <AuthButtonContent
    image={<MetaMaskFrontIcon height="36px" width="36px" />}
    header="Sign up with Ethereum"
    content="Use any Ethereum wallet like MetaMask to sign up."
  />
);

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
      buttonText={ethereumSignupButtonContent}
      onSignUpContinue={props.onSignUpContinue}
      onSignUpUserAlreadyExists={props.onSignUpUserAlreadyExists}
    />
  );
};

export default React.memo(AuthWeb3SignupPage);
