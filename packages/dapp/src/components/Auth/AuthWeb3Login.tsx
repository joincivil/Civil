import gql from "graphql-tag";
import * as React from "react";
import styled from "styled-components";
import { Dropdown, MetaMaskFrontIcon, Modal } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";

import AuthButtonContent, { StyledCardTransactionButtonContainer } from "./AuthButtonContent";
import { StyledAuthAltOption, StyledAuthHeader } from "./authStyledComponents";
import AuthWeb3 from "./AuthWeb3";

const StyledAuthLogin = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  max-width: 311px;
`;

const ethereumLoginButtonContent: JSX.Element = (
  <AuthButtonContent
    image={<MetaMaskFrontIcon height="36px" width="36px" />}
    header="Log in with Ethereum"
    content="Use any Ethereum wallet like MetaMask to log in."
  />
);

const authLoginEthMutation = gql`
  mutation($input: UserSignatureInput!) {
    authWeb3: authLoginEth(input: $input) {
      token
      refreshToken
      uid
    }
  }
`;

export interface AuthWeb3LoginProps {
  onAuthenticated?(address: EthAddress): void;
  onSignupContinue?(): void;
  onOuterClicked?(): void;
  onSignUpClicked?(): void;
}

export interface AuthLoginDropdownProps {
  target?: JSX.Element;
}

export const AuthWeb3LoginComponent: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return (
    <StyledAuthLogin>
      <StyledCardTransactionButtonContainer>
        <AuthWeb3
          authMutation={authLoginEthMutation}
          messagePrefix="Log in to Civil"
          buttonText={ethereumLoginButtonContent}
          onSignupContinue={props.onSignupContinue}
        />
      </StyledCardTransactionButtonContainer>

      <StyledAuthAltOption>
        Not a Civil member?{" "}
        <a
          onClick={() => {
            console.log("on click!");
            if (props.onSignUpClicked) {
              console.log("did click");
              props.onSignUpClicked();
            }
          }}
        >
          Sign up to join
        </a>
      </StyledAuthAltOption>
    </StyledAuthLogin>
  );
};

export const AuthWeb3LoginDropdown: React.FunctionComponent<AuthWeb3LoginProps & AuthLoginDropdownProps> = props => {
  const target = props.target || <>Login</>;
  return (
    <Dropdown target={target}>
      <div>
        <StyledAuthHeader>Sign in to Civil</StyledAuthHeader>
        <AuthWeb3LoginComponent onSignupContinue={props.onSignupContinue} />
      </div>
    </Dropdown>
  );
};

const AuthWeb3LoginPage: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return (
    <Modal width={558} onOuterClicked={props.onOuterClicked}>
      <div>
        <StyledAuthHeader>Sign in to Civil</StyledAuthHeader>
        <AuthWeb3LoginComponent {...props} />
      </div>
    </Modal>
  );
};

export default AuthWeb3LoginPage;
