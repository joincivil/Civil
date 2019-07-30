import * as React from "react";
import gql from "graphql-tag";
import { Helmet } from "react-helmet";
import { EthAddress } from "@joincivil/core";
import AuthWeb3 from "./AuthWeb3";

import { StyledPageContentWithPadding } from "../utility/styledComponents";
import styled from "styled-components";
import { colors, MetaMaskFrontIcon } from "@joincivil/components";

const StyledAuthServiceIconContainer = styled.div`
  align-items: center;
  display: flex;
  background: ${colors.accent.CIVIL_GRAY_5};
  border-radius: 50%;
  height: 60px;
  justify-content: center;
  margin-right: 15px;
  width: 60px;
`;

const StyledAuthServiceBody = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
`;

const StyledAuthServiceHeader = styled.h4`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
  margin: 0 0 13px;
`;

const StyledEthereumAuthContent = styled.div`
  align-items: center;
  display: flex;
`;

const StyledCardTransactionButtonContainer = styled.div`
  width: 311px;

  &:hover {
    ${StyledAuthServiceHeader} {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

const ethereumLoginContent: JSX.Element = (
  <StyledEthereumAuthContent>
    <StyledAuthServiceIconContainer>
      <MetaMaskFrontIcon height="30px" width="30px" />
    </StyledAuthServiceIconContainer>

    <StyledAuthServiceBody>
      <StyledAuthServiceHeader>Log in with Ethereum</StyledAuthServiceHeader>
      Use any Ethereum wallet like MetaMask to log in.
    </StyledAuthServiceBody>
  </StyledEthereumAuthContent>
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
  onAuthenticationContinue?(isNewUser?: boolean, redirectUrl?: string): void;
}

const AuthWeb3Login: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return (
    <StyledPageContentWithPadding>
      <Helmet title={`Login - The Civil Registry`} />

      <StyledCardTransactionButtonContainer>
        <AuthWeb3
          authMutation={authLoginEthMutation}
          messagePrefix="Log in to Civil"
          buttonText={ethereumLoginContent}
          buttonOnly={true}
          {...props}
        />
      </StyledCardTransactionButtonContainer>
    </StyledPageContentWithPadding>
  );
};

export default AuthWeb3Login;
