import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries, QuestionToolTip, ChevronAnchorLeft } from "@joincivil/components";
import { BoostPayOptions } from "./BoostPayOptions";
import {
  BoostWrapper,
  BoostTitle,
  BoostSmallPrint,
  BoostTextButton,
  BoostBack,
  MobileStyle,
} from "../BoostStyledComponents";
import { EthAddress } from "@joincivil/core";

const BoostHeaderWrap = styled.div`
  margin: 0 0 0 20px;

  ${mediaQueries.MOBILE} {
    margin: 0;
  }
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

const BoostPayNewsroom = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 26px;
  font-weight: 200;
  margin-bottom: 20px;

  ${mediaQueries.MOBILE} {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const BoostAmount = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  margin-bottom: 20px;
`;

const BoostDetails = styled.div`
  margin: 0 0 50px;

  ${mediaQueries.MOBILE} {
    margin-bottom: 16px;

    ${BoostTitle},
    ${BoostPayNewsroom},
    ${BoostAmount} {
      display: none;
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
    <BoostWrapper open={true}>
      <BoostHeaderWrap>
        <BoostBack>
          <ChevronAnchorLeft component={BoostTextButton} onClick={() => props.handleBackToListing()}>
            Back to Boost info
          </ChevronAnchorLeft>
        </BoostBack>
        <BoostHeader>
          Complete your Boost payment
          <MobileStyle>
            {" "}
            of <b>${usdToSpend}</b> to <b>{props.newsroomName}</b>
          </MobileStyle>
        </BoostHeader>
        <BoostDetails>
          <BoostTitle>{props.title}</BoostTitle>
          <BoostPayNewsroom>{props.newsroomName}</BoostPayNewsroom>
          <BoostAmount>{"$" + usdToSpend}</BoostAmount>
          <BoostSmallPrint margin={"0 0 20px"}>
            All funds raised will go directly to the newsroom even if this goal is not met.
            <QuestionToolTip
              explainerText={
                "Any money you give goes directly to the newsroom. Civil does not take a cut of any funds raised."
              }
            />
          </BoostSmallPrint>
        </BoostDetails>
      </BoostHeaderWrap>
      <BoostPayOptions
        usdToSpend={usdToSpend}
        paymentAddr={props.paymentAddr}
        newsroomName={props.newsroomName}
        title={props.title}
        boostId={props.boostId}
        isStripeConnected={props.isStripeConnected}
        stripeAccountID={props.stripeAccountID}
        handleBackToListing={props.handleBackToListing}
        handlePaymentSuccess={() => props.handlePaymentSuccess()}
      />
    </BoostWrapper>
  );
};
