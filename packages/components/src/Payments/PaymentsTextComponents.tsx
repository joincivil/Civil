import * as React from "react";
import { urlConstants as links } from "@joincivil/utils";
import { ClipLoader, ErrorIcon, TokenWalletIcon } from "../";
import { PaymentWarning } from "./PaymentsStyledComponents";

{
  /* TODO(sruddy) confirm final copy */
}

export const YourTipText: React.FunctionComponent = props => <>Your tip</>;

export const SelectTipMethodText: React.FunctionComponent = props => <>Select how you would like to tip</>;

export const PayWithCardText: React.FunctionComponent = props => <>Pay with card</>;

export const PayWithCardDescriptionText: React.FunctionComponent = props => (
  <>
    Continue with adding your payment information. Your payment information will be processed through{" "}
    <a href={links.STRIPE} target="_blank">
      Stripe
    </a>
    .
  </>
);

export const PayWithEthText: React.FunctionComponent = props => <>Pay with Eth</>;

export const PayWithEthDescriptionText: React.FunctionComponent = props => (
  <>
    You will be paying using a <a href={links.FAQ_WALLETS}>wallet</a>, such as{" "}
    <a href={links.METAMASK} target="_blank">
      MetaMask Wallet
    </a>
    .
  </>
);

export const PaymentEthNoticeText: React.FunctionComponent = props => (
  <>All proceeds go directly to the newsroom. Refunds are not possible.</>
);

export const PaymentEthTermsText: React.FunctionComponent = props => (
  <>
    By sending a tip, you agree to Civil’s{" "}
    <a href={links.TERMS} target="_blank">
      Terms of Use
    </a>{" "}
    and{" "}
    <a href={links.PRIVACY_POLICY} target="_blank">
      Privacy Policy
    </a>
    . Civil does not charge any fees for this transaction. There are small fees charged by the Ethereum network.
  </>
);

export const ConnectWalletWarningText: React.FunctionComponent = props => (
  <PaymentWarning>
    <ErrorIcon height={15} width={15} /> You need a digital wallet to continue.
  </PaymentWarning>
);

export const ConnectMobileWalletModalText: React.FunctionComponent = props => (
  <>
    <h2>
      <TokenWalletIcon width={48} height={42} />A Web3 enabled browser and secure digital wallet are required.
    </h2>
    <p>
      In order to tip a newsroom with ETH, please install a secure cryptocurrency wallet such as{" "}
      <a href="https://www.coinbase.com/mobile" target="_blank">
        Coinbase Wallet
      </a>
      If you'd like help getting a wallet, take a look at our{" "}
      <a target="_blank" href={links.FAQ_WALLETS}>
        FAQ Guide
      </a>
      .
    </p>
  </>
);

export const PaymentStripeNoticeText: React.FunctionComponent = props => (
  <>
    Once your tip is sent, we’ll send you a confirmation email of your completed transaction. All proceeds of the tips
    go directly to the newsroom minus Stripe processing fees. Refunds are not possible.
  </>
);

export const PaymentStripeTermsText: React.FunctionComponent = props => (
  <>
    By sending a tip, you agree to Civil’s{" "}
    <a href={links.TERMS} target="_blank">
      Terms of Use
    </a>{" "}
    and{" "}
    <a href={links.PRIVACY_POLICY} target="_blank">
      Privacy Policy
    </a>
    . Civil does not charge any fees for this transaction. There are small fees charged by Stripe.
  </>
);

export const PaymentInProgressText: React.FunctionComponent = props => (
  <>
    <p>Your wallet has popped up a new window. Confirm the transaction in your wallet to complete the Boost.</p>
    <ClipLoader />
  </>
);

export const PaymentSuccessText: React.FunctionComponent = props => <>Payment Successful!</>;

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
    <p>
      <a target="_blank" href={links.FAQ_BOOST_SUPPORTERS}>
        Learn more about how to get ETH and support Boosts on our FAQ.
      </a>
    </p>
  </>
);

export const WhatIsEthInfoText: React.FunctionComponent = props => (
  <>
    <h2>What is ETH?</h2>
    <p>
      Ether (ETH) is the cryptocurrency for the Ethereum blockchain. You’ll be paying in ETH to support and pay Boosts.
    </p>
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
    <p>
      <a target="_blank" href={links.FAQ_BOOST_SUPPORTERS}>
        Learn more about how to get ETH and support Boosts on our FAQ.
      </a>
    </p>
  </>
);

export const CanUseCVLInfoText: React.FunctionComponent = props => (
  <>
    <h2>Can I use CVL to support a Boost?</h2>
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
