import * as React from "react";

export const TokenWelcomeText: React.SFC = props => <>Hello and welcome!</>;

export const TokenSetupText: React.SFC = props => <>Let's get you setup to buy, and send CVL tokens.</>;

export const TokenConnectWalletHeaderText: React.SFC = props => <h3>Sign up and connect your crypto wallet</h3>;

export const TokenConnectWalletInfoText: React.SFC = props => (
  <p>Use your wallet to safely store your cryptocurrencies like ETH and CVL tokens.</p>
);

export const TokenConnectWalletBtnText: React.SFC = props => <>Sign up or Log in to your wallet</>;

export const TokenQuizHeaderText: React.SFC = props => <h3>Take the Civil Quiz</h3>;

export const TokenQuizInfoText: React.SFC = props => (
  <p>
    Complete this short walkthrough about storing and using CVL tokens on Civil. This is a standard procedure to help
    inform you of best practices with using tokens.
  </p>
);

export const TokenQuizBtnText: React.SFC = props => <>Take the Civil Quiz</>;

export const TokenVerifyHeaderText: React.SFC = props => <h3>Verify for eligibility</h3>;

export const TokenVerifyInfoText: React.SFC = props => (
  <p>
    Verify for eligibility to buy CVL tokens from the Civil Media Company. This is required to prevent identity theft,
    money laundering, and business fraud.
  </p>
);

export const TokenVerifyBtnText: React.SFC = props => <>Complete Your Eligibility</>;

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
