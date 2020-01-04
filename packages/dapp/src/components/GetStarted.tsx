import * as React from "react";
import * as qs from "querystring";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import { LoadingMessage, CivilContext, ICivilContext, Collapsable, Arrow } from "@joincivil/components";
import {
  Button,
  buttonSizes,
  colors,
  mediaQueries,
  AvatarGenericIcon,
  HollowGreenCheck,
  CircleLockIcon,
} from "@joincivil/elements";
import { routes } from "../constants";

const COLUMN_BREAK_QUERY = "@media only screen and (max-width: 900px)";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1000px;
  padding: 75px 25px 50px;
  width: 100%;

  ${mediaQueries.MOBILE} {
    padding: 50px 20px;
  }
  ${COLUMN_BREAK_QUERY} {
    flex-direction: column-reverse;
  }
  ${mediaQueries.MOBILE_SMALL} {
    padding: 50px 0;
  }
`;
const Info = styled.div`
  max-width: 360px;
  font-size: 15px;
  padding: 72px 0 0 24px;
  line-height: 24px;

  ${COLUMN_BREAK_QUERY} {
    margin: auto;
  }
  ${mediaQueries.MOBILE_SMALL} {
    max-width: calc(100% - 50px);
  }

  p {
    margin: 0 0 36px;
  }
`;
const InfoHeading = styled.div`
  position: relative;
  font-weight: 600;
`;
const InfoIconWrap = styled.div`
  position: absolute;
  left: -36px;
  svg circle {
    stroke-width: 2;
  }
`;
const MoreInfoContainer = styled.div`
  p {
    margin: 16px 0;
    font-size: 14px;
  }
  ${InfoHeading} {
    display: inline-block;
  }
  ${Arrow} {
    position: relative;
    display: inline-block;
    top: -2px;
    left: 5px;
  }
`;
const StyledHollowGreenCheck = styled(HollowGreenCheck)`
  width: 26px;
  height: 26px;
  position: relative;
  left: -1px;
`;
const StyledAvatarGenericIcon = styled(AvatarGenericIcon)`
  width: 24px;
  height: 24px;
`;
const StyledCircleLockIcon = styled(CircleLockIcon)`
  position: relative;
  width: 28px;
  height: 28px;
  left: -3px;
  top: -3px;
`;
const StyledButton = styled(Button)`
  width: 100%;
  padding: 20px 10px;
  font-weight: bold;
  text-transform: none;
  margin: 24px 0;
`;
const MoreInfo = styled.div`
  font-size: 13px;
  margin-top: 48px;
  padding-top: 18px;
  border-top: 1px solid rgb(233, 233, 234);
`;

const CTA = styled.div`
  max-width: 400px;
  flex-grow: 1;
  text-align: center;
  font-size: 14px;

  ${COLUMN_BREAK_QUERY} {
    margin: auto;
  }
  ${mediaQueries.MOBILE_SMALL} {
    max-width: none;
    width: 100%;
  }
`;
const CTAShadow = styled.div`
  border-radius: 8px;
  box-shadow: 0px 15px 35px 0px rgba(0, 0, 0, 0.09);
`;
const CTATop = styled.div`
  padding: 28px 24px 32px;
`;
const CTABottom = styled.div`
  padding: 32px 24px;
  background: rgb(250, 250, 251);
`;

const CTAHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.25px;
  line-height: 30px;
  margin-bottom: 24px;
`;
const CTASubhead = styled.div`
  font-size: 17px;
  letter-spacing: -0.04px;
  line-height: 25px;
`;
const CTASubheadWelcome = styled(CTASubhead)`
  font-weight: bold;
  margin-bottom: 16px;
`;
const CTANotice = styled.div`
  font-size: 13px;
`;

const GetStartedPage = () => {
  const context = React.useContext<ICivilContext>(CivilContext);
  if (!context || !context.auth) {
    return <LoadingMessage />;
  }
  if (context.currentUser) {
    // @TODO/tobek For logged-in users there's a flash of the page before redirect; there shouldn't be.
    return <Redirect to={routes.DASHBOARD_ROOT} />;
  }

  const qsParams = qs.parse(document.location.search.substr(1));
  return (
    <Wrapper>
      <Helmet title="Get Started - The Civil Registry" />
      <Info>
        <InfoHeading>
          <InfoIconWrap>
            <StyledHollowGreenCheck color={colors.accent.CIVIL_BLUE_VERY_FADED} />
          </InfoIconWrap>
          Sign up using a wallet
        </InfoHeading>
        <p>Use a wallet to quickly connect to Ethereum and create a Civil account.</p>
        <InfoHeading>
          <InfoIconWrap>
            <StyledAvatarGenericIcon color={colors.accent.CIVIL_BLUE_VERY_FADED} />
          </InfoIconWrap>
          Decentralized identity
        </InfoHeading>
        <p>Take your tokens, ETH transactions, and wallet address information with you.</p>
        <InfoHeading>
          <InfoIconWrap>
            <StyledCircleLockIcon color={colors.accent.CIVIL_BLUE_VERY_FADED} />
          </InfoIconWrap>
          Focus on security
        </InfoHeading>
        <p>
          Only you have access to your wallet. No one can sign any transactions without your consent and no one can lock
          your account or prevent you from making transactions.
        </p>

        <MoreInfoContainer>
          <Collapsable header={<InfoHeading>Learn more about wallets</InfoHeading>} open={false}>
            <p>
              Having a wallet on Civil is required. It’s how you connect to an account and add your newsroom to the
              Civil Registry. You can easily log in to Civil using MetaMask or Portis.
            </p>
            <p>
              When you set up a wallet, it will create a public wallet address that identifies you as an owner of your
              newsroom. This address is where you'll send and receive ETH to fund your wallet.
            </p>
            <p>
              You will use your wallet to set up and manage your Newsroom Smart Contract, manage your tokens, as well as
              sign transactions on the Ethereum blockchain.
            </p>
            <p>
              Please make sure you've backed up and saved your MetaMask phrase or Portis password to a safe place. You
              are the only one who knows it. We don’t know it and the wallet services don’t either. If you forget your
              password, we can’t help you regain access. This is the same thing that ensures no one can confiscate or
              lock your account for any reason. As they say, with great decentralized power comes great reponsibility.
            </p>
          </Collapsable>
        </MoreInfoContainer>

        <MoreInfo>
          Any other questions? <a href="#TODO/tobek">Visit our support area</a>
        </MoreInfo>
      </Info>
      <CTA>
        <CTAHeader>Create your Civil account</CTAHeader>
        <CTAShadow>
          <CTATop>
            <CTASubheadWelcome>Welcome{qsParams.name && " " + qsParams.name}!</CTASubheadWelcome>
            <CTASubhead>Let's get started creating your account.</CTASubhead>
            <StyledButton size={buttonSizes.MEDIUM_WIDE} onClick={() => context.auth.showWeb3Signup()}>
              Sign Up
            </StyledButton>
            <CTANotice>You'll be selecting a wallet to sign up.</CTANotice>
          </CTATop>
          <CTABottom>
            Already have an account?{" "}
            <a href="#" onClick={() => context.auth.showWeb3Login()}>
              Log in
            </a>
          </CTABottom>
        </CTAShadow>
      </CTA>
    </Wrapper>
  );
};

export default GetStartedPage;
