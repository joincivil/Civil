import * as React from "react";

export const TokenWelcomeText: React.SFC = props => <>Hello and welcome!</>;

export const TokenSetupText: React.SFC = props => <>Let’s get you set up to use, buy and send CVL tokens.</>;

export const TokenConnectWalletText: React.SFC = props => (
  <>
    <h3>Sign up and connect your crypto wallet</h3>
    <p>Use your wallet to safely store your cryptocurrencies like ETH and CVL tokens.</p>
  </>
);

export const TokenConnectWalletCompletedText: React.SFC = props => <h3>Your crypto wallet is connected</h3>;

export const TokenConnectWalletBtnText: React.SFC = props => <>Sign up or Log in to your wallet</>;

export const TokenVerifySectionText: React.SFC = props => (
  <>
    <h3>Take the Civil Tutorial</h3>
    <p>
      Before you can use Civil tokens, you must complete a tutorial to ensure you understand how to use Civil tokens and
      how the Registry works.
    </p>
  </>
);

export const TokenQuizSectionText: React.SFC = props => (
  <>
    <h3>Civil Tutorial</h3>
    <p>
      Complete a walkthrough and answering a series of questions about Civil and how to use Civil tokens (CVL). This is
      a standard procedure to help inform you of best practices with purchasing and using tokens.
    </p>
    <p>
      It will take about 30 minutes to complete. If at any point you answer incorrectly, don’t worry. You will be able
      to answer the questions again.
    </p>
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
    <p>
      Verify for eligibility to buy CVL tokens from the Civil Media Company. This is required to prevent identity theft,
      money laundering, and business fraud.
    </p>
  </>
);

export const TokenVerifyBtnText: React.SFC = props => <>Verify for Eligibility</>;

export const TokenBuyTextDisabled: React.SFC = props => (
  <p>Once you’ve completed the above steps, you will be eligible to buy CVL tokens.</p>
);

export const TokenBuyBtnDisabledText: React.SFC = props => <>To Buy CVL, Sign up or Log in</>;

export const TokenBuyBtnText: React.SFC = props => <>Buy CVL in Airswap</>;

export const TokenBuyText: React.SFC = props => (
  <p>
    To buy CVL tokens, you must buy ETH and then you will be able to buy CVL from an exchange. You can’t use USD to
    directly buy a CVL token – currencies need to be converted into ETH first.
  </p>
);

export const TokenAirswapText: React.SFC = props => (
  <>
    <h3>Once you have ETH in your digital wallet, you will be able to buy CVL tokens from Airswap.</h3>
    <p>
      To buy tokens, you’ll be using Airswap which is an independent company. Airswap is a secure decentralized token
      exchange where you can buy and sell tokens on Ethereum blockchain. Airswap does not charge any of its own fees on
      each trade.
    </p>
  </>
);

export const TokenETHFAQQuestion1Text: React.SFC = props => <h3>Why do I need ETH?</h3>;

export const TokenETHFAQQuestion2Text: React.SFC = props => <h3>How do I buy ETH?</h3>;

export const TokenETHFAQQuestion3Text: React.SFC = props => <h3>How long does it take to buy ETH?</h3>;

export const TokenETHFAQQuestion4Text: React.SFC = props => <h3>What else will I need to use ETH for?</h3>;

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
