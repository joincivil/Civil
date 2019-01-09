import * as React from "react";
import { SideModuleHeader } from "./TokensStyledComponents";

export const TokenWelcomeText: React.SFC = props => <>Hello and welcome!</>;

export const TokenSetupText: React.SFC = props => <>Let's get you setup to buy, and send CVL tokens.</>;

export const TokenCompleteStepsHelpText: React.SFC = props => (
  <>
    Please complete the steps below. If you need help, email <a href="mailto:support@civil.co">support@civil.co</a>{" "}
  </>
);

export const TokenConnectWalletHeaderText: React.SFC = props => <>Sign up and connect your digital wallet</>;

export const TokenConnectWalletInfoText: React.SFC = props => (
  <>Use your wallet to safely store your cryptocurrencies like ETH and CVL tokens.</>
);

export const TokenConnectWalletBtnText: React.SFC = props => <>Sign up or Log in to your wallet</>;

export const TokenQuizHeaderText: React.SFC = props => <>Take the Civil Quiz</>;

export const TokenQuizInfoText: React.SFC = props => (
  <>Learn how to safely and securely store and use CVL tokens on the platform, and then take a short quiz.</>
);

export const TokenQuizBtnText: React.SFC = props => <>Take the Civil Quiz</>;

export const TokenVerifyHeaderText: React.SFC = props => <>Verify for eligibility</>;

export const TokenVerifyInfoText: React.SFC = props => (
  <>
    Verify your identity for compliance requirements and risk evaluation. This is to help prevent identity theft, money
    laundering, and business fraud.
  </>
);

export const TokenVerifyBtnText: React.SFC = props => <>Complete Your Eligibility</>;

export const TokenBuyBtnText: React.SFC = props => <>To Buy CVL, Sign up or Log in</>;

export const TokenQuestionsHeaderText: React.SFC = props => <SideModuleHeader>Ask Questions</SideModuleHeader>;

export const TokenAskQuestionText: React.SFC = props => (
  <>
    <a href="">Ask a question online</a>
  </>
);

export const TokenFAQText: React.SFC = props => (
  <>
    Read our <a href="">Frequently Asked Questions (FAQ)</a> for general help
  </>
);
