import * as React from "react";
import { HollowGreenCheck } from "@joincivil/components";
import { BoostNotification, NoBoostsTextStyled, BoostPaymentShare } from "./BoostStyledComponents";
import { urlConstants } from "../urlConstants";
import { BoostShare } from "./BoostShare";

export const NoBoostsText: React.FunctionComponent = props => (
  <NoBoostsTextStyled>There are no Project Boosts at this time.</NoBoostsTextStyled>
);

export const PaymentInfoText: React.FunctionComponent = props => (
  <>
    <h3>Payment Information</h3>
    <p>
      If the project does not meet its goals, your payment method will be still charged when the Project Boost ends. All
      procceds of the Project Boost go directly to the newsroom.
    </p>
  </>
);

export const PaymentFAQText: React.FunctionComponent = props => (
  <>
    <h3>Frequently Asked Questions</h3>
    <a target="_blank" href={urlConstants.FAQ_BOOST_HOW_TO_SUPPORT}>
      How do I support a Project Boost?
    </a>
    <a target="_blank" href={urlConstants.FAQ_BOOST_WHEN_CHARGED}>
      When is my payment charged?
    </a>
    <a target="_blank" href={urlConstants.FAQ_BOOST_CHARGED_IF_BOOST_FAILS}>
      Am I still charged even if the Project Boost does not hit its target date?
    </a>
    <a target="_blank" href={urlConstants.FAQ_BOOST_WHAT_PAYMENT_DATA}>
      What information can others see about my payment?
    </a>
  </>
);

export interface BoostShareTextProps {
  newsroom: string;
  boostId: string;
  title: string;
}

export const PaymentShareText: React.FunctionComponent<BoostShareTextProps> = props => (
  <>
    <p>Tell your friends about your Boost!</p>
    <BoostPaymentShare>
      <BoostShare boostId={props.boostId} newsroom={props.newsroom} title={props.title} />
    </BoostPaymentShare>
  </>
);

export const BoostPaymentSuccess: React.FunctionComponent = props => (
  <BoostNotification>
    <HollowGreenCheck /> You supported this Project Boost
  </BoostNotification>
);
