import * as React from "react";
import { urlConstants as links } from "@joincivil/utils";
import { ErrorIcon, HollowGreenCheck, NorthEastArrow, colors } from "@joincivil/elements";
import { ClipLoader } from "../ClipLoader";
import {
  PaymentWarning,
  PaymentGhostBtn,
  PaymentEdit,
  PaymentAdjustedNotice,
  PaymentAdjustedNoticeFtr,
  PaymentNotice,
} from "./PaymentsStyledComponents";
import { CreditCardMin } from "./types";

export const SendPaymentHdrText: React.FunctionComponent = props => <h2>Send a Boost</h2>;

export const SendPaymentHdrEmbedText: React.FunctionComponent<PaymentTextProps> = props => (
  <h2>Send a Boost to {props.newsroomName}</h2>
);

export const PaymentToNewsroomsTipText: React.FunctionComponent = props => (
  <>Your Boost goes directly to the newsroom.</>
);

export const EnterCustomAmountText: React.FunctionComponent = props => <>Or enter a custom amount</>;

export const PublicizeUserText: React.FunctionComponent = props => <>Hide my username from everyone but the newsroom</>;

export const SelectPaymentAmountText: React.FunctionComponent = props => <>Select how much you would like to Boost</>;

export const SelectPaymentMethodText: React.FunctionComponent = props => <>Select how you'd like to pay</>;

export const ExpressPayText: React.FunctionComponent = props => <label>Express payment</label>;

export const PaymentInfoText: React.FunctionComponent = props => (
  <>
    <span>Payment Information</span>
    Boosts procceds are funded using Debit/Credit Cards or ETH. Civil does not collect any fees on Boosts.
  </>
);

export const PayWithCardText: React.FunctionComponent = props => <>Pay with Card</>;

export const PayWithAppleText: React.FunctionComponent = props => <>Pay with Apple Pay</>;

export const PayWithGoogleText: React.FunctionComponent = props => <>Pay with Google Pay</>;

export interface PayOnCivilTextProps {
  postId: string;
}

export const PayAppleGoogleOnCivilText: React.FunctionComponent<PayOnCivilTextProps> = props => (
  <>
    <p>Want to pay with Apple Pay or Google Pay?</p>
    <a href={"/storyfeed/" + props.postId + "/payment"} target="_blank">
      Send your Boost on Civil <NorthEastArrow color={colors.accent.CIVIL_BLUE} />
    </a>
  </>
);

export const PaymentStripeNoticeText: React.FunctionComponent = props => (
  <>Proceeds of the Boost go directly to the newsroom minus Stripe processing fees. Refunds are not possible.</>
);

export const PayWithEthText: React.FunctionComponent = props => <>Pay with ETH</>;

export const PaymentEthNoticeText: React.FunctionComponent = props => (
  <>There are small transaction fees added by the Ethereum network. Refunds are not possible.</>
);

export interface PaymentEmailPrepopulatedTextProps {
  email: string;
}
export const PaymentEmailPrepopulatedText: React.FunctionComponent<PaymentEmailPrepopulatedTextProps> = props => (
  <PaymentNotice>Your payment receipt will be sent to {props.email}</PaymentNotice>
);

export interface PaymentAmountTextProps {
  handleEditAmount(): void;
}

export const PayWithCardMinimumText: React.FunctionComponent<PaymentAmountTextProps> = props => (
  <PaymentAdjustedNotice>
    <p>
      <span>The Boost minimum for cards is {"$" + CreditCardMin + ".00"}.</span>
      Boosts amount will be increased to {"$" + CreditCardMin + ".00"} if you pay with a card. Select ETH for smaller
      amounts. <a onClick={() => props.handleEditAmount()}>You can edit your Boost</a> amount or continue.
    </p>
  </PaymentAdjustedNotice>
);

export const PayWithCardMinimumAdjustedText: React.FunctionComponent = props => (
  <PaymentAdjustedNotice>
    <p>
      <span>The Boost minimum for cards is {"$" + CreditCardMin + ".00"}.</span>
      Your new Boost amount will be increased to {"$" + CreditCardMin + ".00"} when you complete your Boost. This is due
      to Credit Card processing fees. You can select ETH for smaller amounts.
    </p>
    <PaymentAdjustedNoticeFtr>
      Adjusted <span>{"$" + CreditCardMin + ".00"}</span>
    </PaymentAdjustedNoticeFtr>
  </PaymentAdjustedNotice>
);

export interface PaymentUpdatedTextProps {
  etherToSpend?: number;
  usdToSpend?: number;
}

export const PaymentUpdatedByEthText: React.FunctionComponent<PaymentUpdatedTextProps> = props => (
  <PaymentAdjustedNotice>
    <p>
      <span>Your Boost amount was updated.</span>
      Your new Boost amount will be {props.etherToSpend} ETH &asymp; ${props.usdToSpend} when you complete your Boost.
    </p>
    <PaymentAdjustedNoticeFtr>
      Adjusted <span>${props.usdToSpend}</span>
    </PaymentAdjustedNoticeFtr>
  </PaymentAdjustedNotice>
);

export interface PaymentSelectTextProps {
  handleEditPaymentType(): void;
}

export const PaymentEditText: React.FunctionComponent<PaymentSelectTextProps> = props => (
  <PaymentEdit>
    Payment
    <PaymentGhostBtn onClick={props.handleEditPaymentType}>Edit</PaymentGhostBtn>
  </PaymentEdit>
);

export const ConnectWalletWarningText: React.FunctionComponent = props => (
  <PaymentWarning redText={true}>
    <ErrorIcon height={15} width={15} /> You need a digital wallet to continue.
  </PaymentWarning>
);

export const EnoughETHInWalletText: React.FunctionComponent = props => (
  <PaymentWarning>
    <HollowGreenCheck height={15} width={15} /> You have enough ETH in your connected wallet.
  </PaymentWarning>
);

export const NotEnoughETHInWalletText: React.FunctionComponent = props => (
  <PaymentWarning>
    <ErrorIcon height={15} width={15} /> You don't have enough ETH in your connected wallet. You can update your Boost
    or purchase more ETH in your wallet.
  </PaymentWarning>
);

export const PaymentEmailConfirmationText: React.FunctionComponent = props => (
  <p>We’ll be sending you a confirmation email of your completed transaction.</p>
);

export const PaymentTermsText: React.FunctionComponent = props => (
  <>
    By sending a Boost, you agree to Civil’s{" "}
    <a href={links.TERMS} target="_blank">
      Terms of Use
    </a>{" "}
    and{" "}
    <a href={links.PRIVACY_POLICY} target="_blank">
      Privacy Policy
    </a>
    . Depending on your selection, your email may be visible to the newsroom.
  </>
);

export const PaymentInProgressText: React.FunctionComponent = props => (
  <>
    <p>Your wallet has popped up a new window. Confirm the transaction in your wallet to complete the payment.</p>
    <ClipLoader />
  </>
);

export interface PaymentTextProps {
  newsroomName: string;
  etherToSpend?: number;
  usdToSpend?: number;
  userSubmittedEmail?: boolean;
}

export const PaymentSuccessText: React.FunctionComponent<PaymentTextProps> = props => (
  <>
    <h2>Boost payment successful!</h2>
    <p>Thank you for being a contributor.</p>
    <p>
      {props.newsroomName} has received your Boost of{" "}
      {props.etherToSpend ? (
        <>
          {props.etherToSpend + " ETH"} &asymp; {"$" + props.usdToSpend}
        </>
      ) : (
        <>${props.usdToSpend}</>
      )}
      . {props.userSubmittedEmail && <>You’ll receive an email with your Boost details.</>}
    </p>
  </>
);

export const PaymentErrorText: React.FunctionComponent = props => <>Your transaction failed. Please try again.</>;

export const WhyEthInfoText: React.FunctionComponent = props => (
  <>
    <h2>Why ETH?</h2>
    <p>100% of your ETH will go right into the newsroom’s wallet. This way, the Newsroom gets your full support.</p>
    <p>
      You’ll have to use Ethereum cryptocurrency (ETH) in a digital wallet like MetaMask in order to continue. Currently
      it’s not possible to use other cryptocurrencies, dollars or other fiat currencies.
    </p>
    <p>
      There is a very small network transaction cost for sending Ethereum out of your wallet, usually it’s a matter of a
      few cents. This cost goes to the Ethereum miners who perform the computational work for your content to be
      included on the Ethereum blockchain.
    </p>
  </>
);

export const WhatIsEthInfoText: React.FunctionComponent = props => (
  <>
    <h2>What is ETH?</h2>
    <p>Ether (ETH) is the cryptocurrency for the Ethereum blockchain. You’ll be paying in ETH to tip a newsroom.</p>
    <p>
      You can purchase or exchange for ETH using a cryptocurrency exchange such as Coinbase or Gemini and fund a digital
      wallet such as MetaMask. Don’t worry, both Coinbase and Gemini are regulated and in compliance with all applicable
      laws in each jurisdiction in which they operate. Buying ETH with a debit or certain credit cards is instant, once
      your account is verified.
    </p>
    <p>
      Each transaction includes a small transaction cost, called gas, which is usually a few cents. These fees go to the
      Ethereum miners who perform the computational work for your content to be included on the Ethereum blockchain.
    </p>
  </>
);

export const CanUseCVLInfoText: React.FunctionComponent = props => (
  <>
    <h2>Can I use CVL to tip a newsroom?</h2>
    <p>
      Civil tokens (CVL) are intended as a governance token to be used on the Civil Registry. You can use them to
      participate in and contribute to Civil’s community. Civil tokens unlock specific activities on the Civil platform,
      including launching a newsroom on the Registry, challenging and voting for/against Newsrooms for ethics violations
      or appealing the outcome of a community vote to the Civil Council.
    </p>
    <p>
      <a target="_blank" href={links.FAQ_CVL_TOKENS}>
        Learn more about Civil tokens
      </a>
    </p>
  </>
);
