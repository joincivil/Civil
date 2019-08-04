import * as React from "react";
import styled from "styled-components";
import { MetaMaskFrontIcon, AuthFooterContainer, WalletOnboardingV2, CardClickable } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import { hasInjectedProvider } from "@joincivil/ethapi";
import { urlConstants as links } from "@joincivil/utils";

import { authSignupEthMutation } from "../../utils/queries";

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

export interface AuthWeb3SignUpProps {
  authLoginURL?: string;
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
    <>
      <StyledAuthHeader>Sign in to Civil</StyledAuthHeader>
      <StyledAuthHeaderCopy>Sign up to create an account</StyledAuthHeaderCopy>
      <StyledAuthSignup>
        {(() => {
          if (!hasInjectedProvider()) {
            return <ShowWalletOnboardingButtonComponent onClick={props.showWalletOnboarding} />;
          }
          return <AuthWeb3SignupButtonComponent onAuthenticationContinue={props.onAuthenticationContinue} />;
        })()}

        <StyledAuthAltOption>
          Already a Civil member? <a href={props.authLoginURL}>Sign in</a>
        </StyledAuthAltOption>
      </StyledAuthSignup>
      <StyledAuthFooterContainer>
        By signing up with MetaMask or other Ethereum wallets, you accept Civil’s <a href={links.TERMS}>Terms of Use</a>{" "}
        and <a href={links.PRIVACY_POLICY}>Privacy Policy</a>.
      </StyledAuthFooterContainer>
    </>
  );
};

export const AuthWeb3Signup: React.FunctionComponent<AuthWeb3SignUpProps> = props => {
  const [isWalletOnboardingVisible, updateShowWalletOnboarding] = React.useState(false);

  const showWalletOnboarding = () => {
    updateShowWalletOnboarding(true);
  };

  if (isWalletOnboardingVisible) {
    return <WalletOnboardingV2 />;
  }
  return (
    <>
      <AuthWeb3SignupComponent
        onAuthenticationContinue={props.onAuthenticationContinue}
        showWalletOnboarding={showWalletOnboarding}
      />
    </>
  );
};
