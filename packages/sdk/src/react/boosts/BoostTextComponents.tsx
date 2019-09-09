import * as React from "react";
import { ModalHeading, ClipLoader, ErrorIcon, CopyURL, TokenWalletIcon, HollowGreenCheck } from "@joincivil/components";
import {
  BoostButton,
  BoostLinkBtn,
  BoostPayWallet,
  BoostPayWalletMobile,
  BoostWarningLabel,
  BoostWalletOptions,
  BoostCopyAddress,
  BoostModalHeader,
  BoostModalContent,
  BoostNotification,
  NoBoostsTextStyled,
} from "./BoostStyledComponents";
import { urlConstants } from "../urlConstants";

export const NoBoostsText: React.FunctionComponent = props => (
  <NoBoostsTextStyled>There are no Boosts at this time.</NoBoostsTextStyled>
);

export const PaymentLabelCardText: React.FunctionComponent = props => <>Pay with card</>;

export const PaymentLabelEthText: React.FunctionComponent = props => <>Pay using ETH</>;

export const WhyEthModalText: React.FunctionComponent = props => (
  <>
    <ModalHeading>Why ETH?</ModalHeading>
    <BoostModalContent>
      100% of your ETH will go right into the newsroom’s wallet. This way, the Newsroom gets your full support.
    </BoostModalContent>
    <BoostModalContent>
      You’ll have to use Ethereum cryptocurrency (ETH) in a digital wallet like MetaMask in order to continue. Currently
      it’s not possible to use other cryptocurrencies, dollars or other fiat currencies.
    </BoostModalContent>
    <BoostModalContent>
      There is a very small network transaction cost for sending Ethereum out of your wallet, usually it’s a matter of a
      few cents. This cost goes to the Ethereum miners who perform the computational work for your content to be
      included on the Ethereum blockchain.
    </BoostModalContent>
    <BoostModalContent>
      <a target="_blank" href={urlConstants.FAQ_BOOST_SUPPORTERS}>
        Learn more about how to get ETH and support Boosts on our FAQ.
      </a>
    </BoostModalContent>
  </>
);

export const WhatIsEthModalText: React.FunctionComponent = props => (
  <>
    <ModalHeading>What is ETH?</ModalHeading>
    <BoostModalContent>
      Ether (ETH) is the cryptocurrency for the Ethereum blockchain. You’ll be paying in ETH to support and pay Boosts.
    </BoostModalContent>
    <BoostModalContent>
      You can purchase or exchange for ETH using a cryptocurrency exchange such as Coinbase or Gemini and fund a digital
      wallet such as MetaMask. Don’t worry, both Coinbase and Gemini are regulated and in compliance with all applicable
      laws in each jurisdiction in which they operate. Buying ETH with a debit or certain credit cards is instant, once
      your account is verified.
    </BoostModalContent>
    <BoostModalContent>
      Each transaction includes a small transaction cost, called gas, which is usually a few cents. These fees go to the
      Ethereum miners who perform the computational work for your content to be included on the Ethereum blockchain.
    </BoostModalContent>
    <BoostModalContent>
      <a target="_blank" href={urlConstants.FAQ_BOOST_SUPPORTERS}>
        Learn more about how to get ETH and support Boosts on our FAQ.
      </a>
    </BoostModalContent>
  </>
);

export const BoostMobileWalletModalText: React.FunctionComponent = props => (
  <>
    <BoostModalHeader>
      <TokenWalletIcon width={48} height={42} />A Web3 enabled browser and secure digital wallet required.
    </BoostModalHeader>
    <BoostModalContent textAlign="center">
      In order to support a Civil Boosts, please install a secure cryptocurrency wallet such as{" "}
      <a href="https://www.coinbase.com/mobile" target="_blank">
        Coinbase Wallet
      </a>
      {/*or
      <a href="https://alphawallet.com/" target="_blank">
        Alpha Wallet
      </a>*/}. If you'd like
      help getting a wallet, take a look at our{" "}
      <a target="_blank" href={urlConstants.FAQ_WALLETS}>
        FAQ Guide
      </a>
      .
    </BoostModalContent>
    <BoostWalletOptions>
      <BoostLinkBtn href={"https://www.coinbase.com/mobile"} target="_blank">
        Coinbase Wallet
      </BoostLinkBtn>
      {/*<BoostLinkBtn href={"https://alphawallet.com/"} target="_blank">
        Alpha Wallet
      </BoostLinkBtn>*/}
    </BoostWalletOptions>
    <BoostCopyAddress>
      <span>Already use a wallet?</span>
      <CopyURL copyText={"Copy the URL to open in your own wallet"} />
    </BoostCopyAddress>
  </>
);

export const CanUseCVLText: React.FunctionComponent = props => (
  <>
    <ModalHeading>Can I use CVL to support a Boost?</ModalHeading>
    <BoostModalContent>
      Civil tokens (CVL) are intended as a governance token to be used on the Civil Registry. You can use them to
      participate in and contribute to Civil’s community. Civil tokens unlock specific activities on the Civil platform,
      including launching a newsroom on the Registry, challenging and voting for/against Newsrooms for ethics violations
      or appealing the outcome of a community vote to the Civil Council.
    </BoostModalContent>
    <BoostModalContent>
      <a target="_blank" href={urlConstants.FAQ_CVL_TOKENS}>
        Learn more about Civil tokens
      </a>
    </BoostModalContent>
  </>
);

export const PaymentInfoText: React.FunctionComponent = props => (
  <>
    <h3>Payment Information</h3>
    <p>
      If the project does not meet its goals, your payment method will be still charged when the Boost ends. All
      procceds of the Boost go directly to the newsroom.
    </p>
  </>
);

export const PaymentFAQText: React.FunctionComponent = props => (
  <>
    <h3>Frequently Asked Questions</h3>
    <a target="_blank" href={urlConstants.FAQ_BOOST_HOW_TO_SUPPORT}>
      How do I support a Boost?
    </a>
    <a target="_blank" href={urlConstants.FAQ_BOOST_WHEN_CHARGED}>
      When is my payment charged?
    </a>
    <a target="_blank" href={urlConstants.FAQ_BOOST_CHARGED_IF_BOOST_FAILS}>
      Am I still charged even if the Boost does not hit its target date?
    </a>
    <a target="_blank" href={urlConstants.FAQ_BOOST_WHAT_PAYMENT_DATA}>
      What information can others see about my payment?
    </a>
  </>
);

export const PaymentConfirmTransactionText: React.FunctionComponent = props => (
  <>
    <h3>Let's Boost</h3>
    <p>Your wallet has popped up a new window. Confirm the transaction in your wallet to complete the Boost.</p>
  </>
);

export interface BoostPaymentTextProps {
  newsroomName?: string;
  etherToSpend?: number;
  usdToSpend?: number;
  boostURL?: string;
  handlePaymentSuccess?(): void;
  hideModal?(): void;
}

export const PaymentSuccessText: React.FunctionComponent = props => <ModalHeading>Payment Successful!</ModalHeading>;

export const PaymentErrorText: React.FunctionComponent = props => (
  <>
    <ModalHeading>Payment Failed</ModalHeading>
    <BoostModalContent textAlign={"center"}>Your transaction failed. Please try again.</BoostModalContent>
  </>
);

export const PaymentEthConfirmationText: React.FunctionComponent<BoostPaymentTextProps> = props => (
  <>
    <p>
      Thank you! {props.newsroomName} has received your Boost of {props.etherToSpend} ETH (${props.usdToSpend} USD)
    </p>
  </>
);

export const PaymentCardConfirmationText: React.FunctionComponent<BoostPaymentTextProps> = props => (
  <>
    <p>
      Thank you! {props.newsroomName} has received your Boost of ${props.usdToSpend} USD
    </p>
  </>
);

export const PaymentShareText: React.FunctionComponent<BoostPaymentTextProps> = props => (
  <>
    <p>
      Tell your friends about your Boost! <a href={props.boostURL}>Share a link to the Boost</a>
    </p>
  </>
);

export const PaymentInProgressModalText: React.FunctionComponent = props => (
  <>
    <PaymentConfirmTransactionText />
    <ClipLoader />
  </>
);

export const PaymentSuccessModalText: React.FunctionComponent<BoostPaymentTextProps> = props => {
  return (
    <>
      <PaymentSuccessText />
      <PaymentEthConfirmationText
        newsroomName={props.newsroomName}
        usdToSpend={props.usdToSpend}
        etherToSpend={props.etherToSpend}
      />
      {/* commenting out till share is figured out <PaymentShareText boostURL={props.boostURL} /> */}
      <BoostButton onClick={props.handlePaymentSuccess}>Done</BoostButton>
    </>
  );
};

export const PaymentErrorModalText: React.FunctionComponent<BoostPaymentTextProps> = props => {
  const handleOnClick = (event: any): void => {
    if (props.hideModal) {
      props.hideModal();
    }
  };

  return (
    <>
      <PaymentErrorText />
      <BoostButton onClick={handleOnClick}>Dismiss</BoostButton>
    </>
  );
};

export const PaymentSuccessCardModalText: React.FunctionComponent<BoostPaymentTextProps> = props => {
  return (
    <>
      <PaymentSuccessText />
      <PaymentCardConfirmationText newsroomName={props.newsroomName} usdToSpend={props.usdToSpend} />
      <BoostButton onClick={props.handlePaymentSuccess}>Done</BoostButton>
    </>
  );
};

export const BoostPayWalletText: React.FunctionComponent = props => (
  <>
    <BoostPayWallet>
      You will be paying using a wallet such as{" "}
      <a href="https://metamask.io/" target="_blank">
        MetaMask
      </a>
    </BoostPayWallet>

    <BoostPayWalletMobile>
      You will be paying using your wallet such as{" "}
      <a href="https://www.coinbase.com/mobile" target="_blank">
        Coinbase Wallet
      </a>{" "}
      or{" "}
      <a href="https://alphawallet.com/" target="_blank">
        Alpha Wallet
      </a>
    </BoostPayWalletMobile>
  </>
);

export const BoostConnectWalletWarningText: React.FunctionComponent = props => (
  <BoostWarningLabel>
    <ErrorIcon height={15} width={15} /> You need a digital wallet to continue.
  </BoostWarningLabel>
);

export const BoostPaymentSuccess: React.FunctionComponent = props => (
  <BoostNotification>
    <HollowGreenCheck /> You supported this Boost
  </BoostNotification>
);
