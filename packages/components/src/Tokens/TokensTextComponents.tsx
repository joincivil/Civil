import * as React from "react";

export const TokenWelcomeText: React.SFC = props => <>Hello and welcome!</>;

export const TokenSetupText: React.SFC = props => <>Let’s get you set up to use, buy and send CVL tokens.</>;

export const TokenConnectWalletText: React.SFC = props => (
  <>
    <h3>Sign up and connect your crypto wallet</h3>
    <p>Use your wallet to safely store your cryptocurrencies like ETH and CVL tokens.</p>
  </>
);

export const TokenConnectWalletCompletedText: React.SFC = props => (
  <h3>Your crypto wallet is connected</h3>
);

export const TokenConnectWalletBtnText: React.SFC = props => <>Sign up or Log in to your wallet</>;

export const TokenVerifySectionText: React.SFC = props => (
  <>
    <h3>Let’s verify your eligibility</h3>
    <p>Before you can use, buy, and send CVL tokens, you must complete these verification requirements. These steps are
    required to ensure that all CVL token holders are legitimate users, learn about the Registry and how to use tokens.</p>
  </>
);

export const TokenQuizSectionText: React.SFC = props => (
  <>
    <h3>Take the Civil Tutorial</h3>
    <p>Complete this short walkthrough about storing and using CVL tokens on Civil. This is a standard procedure to help
    inform you of best practices with using tokens.</p>
  </>
);

export const TokenQuizBtnText: React.SFC = props => <>Start the Civil Tutorial</>;

export const TokenQuizCompletedText: React.SFC = props => (
  <>
    <h3>You’ve completed the Civil Tutorial</h3>
    <p>You are eligible to use your CVL tokens on Civil.</p>
  </>
);

export const TokenVerifyText: React.SFC = props => (
  <>
    <h3>Verify Your Identity</h3>
    <p>Verify for eligibility to buy CVL tokens from the Civil Media Company. This is required to prevent identity theft,
    money laundering, and business fraud.</p>
  </>
);

export const TokenVerifyBtnText: React.SFC = props => <>Verify for Eligibility</>;

export const TokenBuyText: React.SFC = props => (
  <p>Once you’ve completed the above steps, you will be eligible to buy CVL tokens.</p>
);

export const TokenBuyBtnText: React.SFC = props => <>To Buy CVL, Sign up or Log in</>;

export const TokenQuestionsHeaderText: React.SFC = props => <h3>Ask Questions</h3>;

export const TokenAskQuestionText: React.SFC = props => (
  <>
    <p>
      <a href="">Ask a question online</a>
    </p>
  </>
);

export const TokenFAQText: React.SFC = props => (
  <>
    <p>
      Read our <a href="">Frequently Asked Questions (FAQ)</a> for general help
    </p>
  </>
);
