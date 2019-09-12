import * as React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import {
  MetaMaskFrontIcon,
  AuthFooterContainer,
  WalletOnboardingV2,
  CardClickable,
  Modal,
} from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import { urlConstants as links } from "@joincivil/utils";
import { hasInjectedProvider } from "@joincivil/ethapi";

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
  onSignUpContinue?(): void;
  onOuterClicked?(): void;
  onLoginClicked?(): void;
  onSignUpUserAlreadyExists?(): void;
}

const AuthWeb3SignupButtonComponent: React.FunctionComponent<AuthWeb3SignUpProps> = props => {
  return (
    <StyledCardTransactionButtonContainer>
      <AuthWeb3
        authMutation={authSignupEthMutation}
        messagePrefix="Sign up with Civil"
        buttonText={ethereumSignupButtonContent}
        onSignUpContinue={props.onSignUpContinue}
        onSignUpUserAlreadyExists={props.onSignUpUserAlreadyExists}
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
        return (
          <AuthWeb3SignupButtonComponent
            onSignUpContinue={props.onSignUpContinue}
            onSignUpUserAlreadyExists={props.onSignUpUserAlreadyExists}
          />
        );
      })()}

      <StyledAuthAltOption>
        Already a Civil member?{" "}
        <a
          onClick={() => {
            if (props.onLoginClicked) {
              props.onLoginClicked();
            }
          }}
        >
          Sign in
        </a>
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
    <Modal width={558} onOuterClicked={props.onOuterClicked}>
      <div>
        {(() => {
          if (isWalletOnboardingVisible) {
            return <WalletOnboardingV2 />;
          }
          return (
            <>
              <StyledAuthHeader>Sign up for Civil</StyledAuthHeader>
              <StyledAuthHeaderCopy>Sign up to create an account</StyledAuthHeaderCopy>
              <AuthWeb3SignupComponent {...props} showWalletOnboarding={showWalletOnboarding} />
              <StyledAuthFooterContainer>
                By signing up with MetaMask or other Ethereum wallets, you accept Civil’s{" "}
                <a href={links.TERMS} target="_blank">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href={links.PRIVACY_POLICY} target="_blank">
                  Privacy Policy
                </a>
                .
              </StyledAuthFooterContainer>
            </>
          );
        })()}
      </div>
    </Modal>
  );
};

export default React.memo(AuthWeb3SignupPage);
