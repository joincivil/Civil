import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../../styleConstants";
import * as checkEmailImage from "../../images/auth/img-check-email@2x.png";
import { PageHeadingTextCenteredSmall } from "../../Heading";
import { Link } from "react-router-dom";

export const CheckboxContainer = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0;
`;

export const CheckboxSection = styled.li`
  margin-bottom: 10px;
`;

export const CheckboxLabel = styled.span`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: 400 12px/20px ${fonts.SANS_SERIF};
  padding-left: 7px;
`;

export const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

export const CheckEmailLetterIcon = styled.div`
  width: 108px;
  height: 108px;
  background-image: url(${checkEmailImage});
  background-size: cover;
  margin: 30px 0;
`;

export const CenterWrapper: React.SFC = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div>{children}</div>
  </div>
);

export const CheckEmailWrapper = styled.ul``;

export const CheckEmailSection: React.SFC = props => (
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
  /* TODO(jorgelo): Should we make this responsive? */
  width: 700px;
`;

export const AuthOuterWrapper: React.SFC = ({ children }) => (
  <CenterWrapper>
    <AuthOuterWrapperContainer>
      <CenterWrapper>{children}</CenterWrapper>
    </AuthOuterWrapperContainer>
  </CenterWrapper>
);

export const AuthWrapper: React.SFC = ({ children }) => (
  <AuthOuterWrapper>
    <AuthInnerWrapper>{children}</AuthInnerWrapper>
    <AuthFooterTerms />
  </AuthOuterWrapper>
);

export const AuthInnerWrapper = styled.div`
  margin: 0 115px;
  margin-top: 71px;
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

export const AuthFooterTerms = () => (
  <AuthFooterContainer>
    <PageHeadingTextCenteredSmall>
      By joining Civil, you will become part of a community of high quality news publishers. Your content will be
      featured alongside other Civil newsroom and enjoy all the privileges of the Civil community.
    </PageHeadingTextCenteredSmall>
    <BenefitsLink>
      {/* // TODO(jorgelo): Where will this link? */}
      <Link to={"https://civil.co"} target="_new">
        Read more about those benefits.
      </Link>
    </BenefitsLink>
  </AuthFooterContainer>
);
