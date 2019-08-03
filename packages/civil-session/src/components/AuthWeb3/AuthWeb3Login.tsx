import * as React from "react";
import styled from "styled-components";
import { Dropdown, MetaMaskFrontIcon } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";

import { authLoginEthMutation } from "../../utils/queries";

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

export interface AuthWeb3LoginProps {
  authSignupURL?: string;
  onAuthenticated?(address: EthAddress): void;
  onAuthenticationContinue?(isNewUser?: boolean, redirectUrl?: string): void;
}

export interface AuthLoginDropdownProps {
  target?: JSX.Element;
}

export const AuthWeb3Login: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return (
    <>
      <StyledAuthHeader>Sign in to Civil</StyledAuthHeader>
      <StyledAuthLogin>
        <StyledCardTransactionButtonContainer>
          <AuthWeb3
            authMutation={authLoginEthMutation}
            messagePrefix="Log in to Civil"
            buttonText={ethereumLoginButtonContent}
            onAuthenticationContinue={props.onAuthenticationContinue}
            {...props}
          />
        </StyledCardTransactionButtonContainer>

        <StyledAuthAltOption>
          Not a Civil member? <a href={props.authSignupURL}>Sign up to join</a>
        </StyledAuthAltOption>
      </StyledAuthLogin>
    </>
  );
};

export const AuthWeb3LoginDropdown: React.FunctionComponent<AuthWeb3LoginProps & AuthLoginDropdownProps> = props => {
  const target = props.target || <>Login</>;
  return (
    <Dropdown target={target}>
      <div>
        <StyledAuthHeader>Sign in to Civil</StyledAuthHeader>
        <AuthWeb3Login onAuthenticationContinue={props.onAuthenticationContinue} />
      </div>
    </Dropdown>
  );
};
