import gql from "graphql-tag";
import * as React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Dropdown, MetaMaskFrontIcon } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";

import { routes } from "../../constants";
import { StyledPageContentWithPadding } from "../utility/styledComponents";
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
          {...props}
        />
      </StyledCardTransactionButtonContainer>

      <StyledAuthAltOption>
        Not a Civil member? <a href={routes.AUTH_SIGNUP_WEB3}>Sign up to join</a>
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
    <StyledPageContentWithPadding centerContent={true}>
      <Helmet title={`Login - The Civil Registry`} />
      <div>
        <StyledAuthHeader>Sign in to Civil</StyledAuthHeader>
        <AuthWeb3LoginComponent onSignupContinue={props.onSignupContinue} />
      </div>
    </StyledPageContentWithPadding>
  );
};

export default AuthWeb3LoginPage;
