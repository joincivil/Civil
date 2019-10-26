import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries } from "../../styleConstants";
import checkEmailImage from "../../images/auth/img-check-email@2x.png";
import confirmedEmailImage from "../../images/auth/img-confirm-email@2x.png";
import iconError from "../../images/icons/ico-error-red@2x.png";
import { urlConstants as links } from "@joincivil/utils";

import {
  AuthTextFooter,
  AuthTextVerifyTokenConfirmed,
  AuthTextVerifyTokenVerifying,
  AuthTextVerifyTokenError,
  AuthTextEthAuthNext,
} from "./AuthTextComponents";
import { Button, buttonSizes } from "../..";

export const CheckboxContainer = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0;
  max-width: 300px;
`;

export const CheckboxSection = styled.li`
  margin-bottom: 10px;
`;

export const CheckboxLabel = styled.span`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: 400 15px/20px ${fonts.SANS_SERIF};
  padding-left: 7px;
  vertical-align: middle;
`;

export const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

export const SkipForNowButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  ${mediaQueries.MOBILE} {
    padding-top: 5px;
  }
`;

export const CheckEmailLetterIcon = styled.div`
  width: 108px;
  height: 108px;
  background-position: center center;
  background-image: url(${checkEmailImage});
  background-size: cover;
  margin: 30px 0;
`;

export const ConfirmedEmailLetterIcon = styled(CheckEmailLetterIcon)`
  background-image: url(${confirmedEmailImage});
`;

export const CenterWrapper: React.FunctionComponent = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div>{children}</div>
  </div>
);

export const CheckEmailSection = () => (
  <CenterWrapper>
    <CheckEmailLetterIcon />
  </CenterWrapper>
);

export const CenteredText = styled.div`
  text-align: center;
`;

export const FooterTextCentered = styled.div`
  text-align: center;
`;

export const AuthOuterWrapperContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 700px;

  ${mediaQueries.MOBILE} {
    width: 100%;
  }
`;

export const AuthOuterWrapper: React.FunctionComponent = ({ children }) => (
  <CenterWrapper>
    <AuthOuterWrapperContainer>
      <CenterWrapper>{children}</CenterWrapper>
    </AuthOuterWrapperContainer>
  </CenterWrapper>
);

export const AuthWrapper: React.FunctionComponent = ({ children }) => (
  <AuthOuterWrapper>
    <AuthInnerWrapper>{children}</AuthInnerWrapper>
    <AuthFooterTerms textEl={<AuthTextFooter />} />
  </AuthOuterWrapper>
);

export const AuthInnerWrapper = styled.div`
  margin: 71px 115px 0;

  ${mediaQueries.MOBILE} {
    margin: 71px 15px 0;
  }
`;

export const AuthPageFooterLink = styled.div`
  text-align: center;
  font-size: 12px;
  text-decoration: underline;
  padding-top: 60px;
`;

export const AuthFooterContainer = styled.div`
  border-top: 1px solid #d8d8d8;
  margin-top: 40px;
  padding-top: 20px;
`;

export const BenefitsLink = styled(AuthPageFooterLink)`
  padding: 0;
`;

export interface AuthFooterTermsProps {
  textEl: JSX.Element;
}
export const AuthFooterTerms: React.FunctionComponent<AuthFooterTermsProps> = ({ textEl }) => (
  <AuthFooterContainer>
    {textEl}
    <BenefitsLink>
      <a href={links.BECOME_A_MEMBER} target="_blank">
        Read more about those benefits.
      </a>
    </BenefitsLink>
  </AuthFooterContainer>
);

export interface AuthEmailVerifyProps {
  hasVerified: boolean;
  errorMessage: string | undefined;
  ethAuthNextExt?: boolean;
  onAuthenticationContinue(): void;
}

export const AuthEmailVerify = ({
  hasVerified,
  errorMessage,
  onAuthenticationContinue,
  ethAuthNextExt,
}: AuthEmailVerifyProps) => {
  if (errorMessage) {
    return <AuthTextVerifyTokenError errorMessage={errorMessage} />;
  }

  return (
    <>
      {hasVerified ? <AuthTextVerifyTokenConfirmed /> : <AuthTextVerifyTokenVerifying />}
      <CenterWrapper>
        <ConfirmedEmailLetterIcon />
      </CenterWrapper>
      {ethAuthNextExt && (
        <div style={{ marginBottom: 24 }}>
          <AuthTextEthAuthNext />
        </div>
      )}
      <CenterWrapper>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={onAuthenticationContinue}>
          Continue
        </Button>
      </CenterWrapper>
    </>
  );
};

export interface ConfirmEmailVerifyProps {
  hasVerified: boolean;
  errorMessage: string | undefined;
  ethAuthNextExt?: boolean;
  onEmailConfirmContinue(): void;
}

export const EmailConfirmVerify = ({
  hasVerified,
  errorMessage,
  onEmailConfirmContinue,
  ethAuthNextExt,
}: ConfirmEmailVerifyProps) => {
  if (errorMessage) {
    return <AuthTextVerifyTokenError errorMessage={errorMessage} />;
  }

  return (
    <>
      {hasVerified ? <AuthTextVerifyTokenConfirmed /> : <AuthTextVerifyTokenVerifying />}
      <CenterWrapper>
        <ConfirmedEmailLetterIcon />
      </CenterWrapper>
      {ethAuthNextExt && (
        <div style={{ marginBottom: 24 }}>
          <AuthTextEthAuthNext />
        </div>
      )}
      <CenterWrapper>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={onEmailConfirmContinue}>
          Continue
        </Button>
      </CenterWrapper>
    </>
  );
};

export const AuthErrorMessage = styled.div`
  border: 1px solid rgba(242, 82, 74, 0.56);
  border-radius: 4px;
  background-color: #fff7f8;

  background-position: 10px center;
  background-image: url(${iconError});
  background-size: 30px;
  background-repeat: no-repeat;

  color: #555555;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;

  /*  TODO(jorgelo): This is terrible, but the error message breaks out of the parent box. There has to be a better way. */
  margin: 0 -116px 17px -116px;

  padding: 18px 0;

  text-align: center;
`;
