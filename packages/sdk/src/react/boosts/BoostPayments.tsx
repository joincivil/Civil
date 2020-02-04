import * as React from "react";
import styled from "styled-components";
import { Payments, colors, fonts, mediaQueries, ChevronAnchorLeft, RENDER_CONTEXT } from "@joincivil/components";
import { BoostTitle, BoostTextButton, BoostBack } from "./BoostStyledComponents";
import { PaymentFAQText } from "./BoostTextComponents";
import { EthAddress } from "@joincivil/typescript-types";

const BoostPaymentsWrapper = styled.div`
  margin: 0 auto 45px;
  max-width: 400px;
  padding: 45px 0 0;
  width: 100%;

  ${mediaQueries.MOBILE} {
    margin: 0 auto 30px;
    padding: 20px 15px;
  }

  ${props =>
    props.theme.renderContext === RENDER_CONTEXT.EMBED &&
    `
    && {
      margin-bottom: 0
    }
  `}
`;

const BoostHeaderWrap = styled.div`
  margin: 0 0 20px;
`;

const BoostHeader = styled.h2`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  line-height: 33px;
  font-weight: bold;
  margin: 0 0 25px;

  ${mediaQueries.MOBILE} {
    font-size: 16px;
    line-height: 26px;
    font-weight: normal;
    margin-bottom: 12px;
  }
`;

const BoostPayFooterSection = styled.div`
  margin: 20px 0 40px;

  ${mediaQueries.MOBILE} {
    margin-bottom: 16px;
  }

  h3 {
    font-size: 14px;
    line-height: 22px;
    font-weight: 700;
    margin: 0 0 10px;
  }

  a {
    display: block;
    font-size: 14px;
    line-height: 22px;
    margin: 0 0 10px;
    text-decoration: none;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }
  }
`;

export interface BoostPaymentsProps {
  isStripeConnected: boolean;
  stripeAccountID: string;
  paymentAddr: EthAddress;
  boostId: string;
  title: string;
  newsroomName: string;
  activeChallenge: boolean;
  history: any;
  handleBackToListing(): void;
  handlePaymentSuccess(): void;
}

export const BoostPayments: React.FunctionComponent<BoostPaymentsProps> = props => {
  const { history } = props;
  let usdToSpend = 0;
  if (history && history.location && history.location.state && history.location.state.usdToSpend) {
    usdToSpend = history.location.state.usdToSpend;
  }

  return (
    <BoostPaymentsWrapper>
      <BoostHeaderWrap>
        <BoostBack>
          <ChevronAnchorLeft component={BoostTextButton} onClick={() => props.handleBackToListing()}>
            Back to Boost info
          </ChevronAnchorLeft>
        </BoostBack>
        <BoostHeader>Complete your Boost payment</BoostHeader>
        <BoostTitle>{props.title}</BoostTitle>
      </BoostHeaderWrap>
      <Payments
        postId={props.boostId}
        usdToSpend={usdToSpend}
        newsroomName={props.newsroomName}
        activeChallenge={props.activeChallenge}
        paymentAddress={props.paymentAddr}
        isStripeConnected={props.isStripeConnected}
        stripeAccountID={props.stripeAccountID}
        handleClose={props.handlePaymentSuccess}
        boostType={"project"}
      />
      <BoostPayFooterSection>
        <PaymentFAQText />
      </BoostPayFooterSection>
    </BoostPaymentsWrapper>
  );
};
