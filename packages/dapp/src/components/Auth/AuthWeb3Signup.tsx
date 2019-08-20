import * as React from "react";
import gql from "graphql-tag";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { MetaMaskFrontIcon, AuthFooterContainer, WalletOnboardingV2, CardClickable } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import { urlConstants as links } from "@joincivil/utils";
import { hasInjectedProvider } from "@joincivil/ethapi";

import { routes } from "../../constants";
import { StyledPageContentWithPadding } from "../utility/styledComponents";
import { StyledAuthAltOption, StyledAuthHeader, StyledAuthHeaderCopy } from "./authStyledComponents";
import AuthButtonContent, { StyledCardTransactionButtonContainer } from "./AuthButtonContent";
import AuthWeb3 from "./AuthWeb3";

const StyledAuthSignup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  max-width: 390px;
`;

const StyledAuthFooterContainer = styled(AuthFooterContainer)`
  max-width: 390px;
`;

const ethereumSignupButtonContent: JSX.Element = (
  <AuthButtonContent
    image={<MetaMaskFrontIcon height="36px" width="36px" />}
    header="Sign up with Ethereum"
    content="Use any Ethereum wallet like MetaMask to sign up."
  />
);

const showWalletOnboardingButtonContent: JSX.Element = (
  <AuthButtonContent
    image={<MetaMaskFrontIcon height="36px" width="36px" />}
    header="Sign up with Ethereum"
    content="Install MetaMask browser extension to create an account."
  />
);

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

const AuthWeb3SignupButtonComponent: React.FunctionComponent<AuthWeb3SignUpProps> = props => {
  return (
    <StyledCardTransactionButtonContainer>
      <AuthWeb3
        authMutation={authSignupEthMutation}
        messagePrefix="Sign up with Civil"
        buttonText={ethereumSignupButtonContent}
        onAuthenticationContinue={props.onAuthenticationContinue}
      />
    </StyledCardTransactionButtonContainer>
  );
};

interface ShowWalletOnboardingButtonComponentProps {
  onClick(): void;
}

const ShowWalletOnboardingButtonComponent: React.FunctionComponent<
  ShowWalletOnboardingButtonComponentProps
> = props => {
  return (
    <StyledCardTransactionButtonContainer>
      <CardClickable onClick={props.onClick}>{showWalletOnboardingButtonContent}</CardClickable>
    </StyledCardTransactionButtonContainer>
  );
};

interface AuthWeb3SignupComponentProps {
  showWalletOnboarding(): void;
}

const AuthWeb3SignupComponent: React.FunctionComponent<AuthWeb3SignUpProps & AuthWeb3SignupComponentProps> = props => {
  return (
    <StyledAuthSignup>
      {(() => {
        if (!hasInjectedProvider()) {
          return <ShowWalletOnboardingButtonComponent onClick={props.showWalletOnboarding} />;
        }
        return <AuthWeb3SignupButtonComponent onAuthenticationContinue={props.onAuthenticationContinue} />;
      })()}

      <StyledAuthAltOption>
        Already a Civil member? <a href={routes.AUTH_LOGIN_WEB3}>Sign in</a>
      </StyledAuthAltOption>
    </StyledAuthSignup>
  );
};

const AuthWeb3SignupPage: React.FunctionComponent<AuthWeb3SignUpProps> = props => {
  const [isWalletOnboardingVisible, updateShowWalletOnboarding] = React.useState(false);

  const showWalletOnboarding = () => {
    updateShowWalletOnboarding(true);
  };

  return (
    <StyledPageContentWithPadding centerContent={true}>
      <Helmet title={`Sign up - The Civil Registry`} />
      <div>
        {(() => {
          if (isWalletOnboardingVisible) {
            return <WalletOnboardingV2 />;
          }
          return (
            <>
              <StyledAuthHeader>Sign in to Civil</StyledAuthHeader>
              <StyledAuthHeaderCopy>Sign up to create an account</StyledAuthHeaderCopy>
              <AuthWeb3SignupComponent
                onAuthenticationContinue={props.onAuthenticationContinue}
                showWalletOnboarding={showWalletOnboarding}
              />
              <StyledAuthFooterContainer>
                By signing up with MetaMask or other Ethereum wallets, you accept Civil’s{" "}
                <a href={links.TERMS}>Terms of Use</a> and <a href={links.PRIVACY_POLICY}>Privacy Policy</a>.
              </StyledAuthFooterContainer>
            </>
          );
        })()}
      </div>
    </StyledPageContentWithPadding>
  );
};

export default React.memo(AuthWeb3SignupPage);
