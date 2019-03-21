import styled, { StyledComponentClass } from "styled-components";
import * as React from "react";
import { Link } from "react-router-dom";
import { HollowGreenCheck, NorthEastArrow, LockOpenIcon } from "../icons";
import { colors } from "../styleConstants";
import { FAQ_BASE_URL, urlConstants as links } from "@joincivil/utils";

// Signup/Connect wallet section

export const TokenWelcomeHeaderText: React.SFC = props => (
  <>
    <h2>Hello, you’re about to become a Civil member</h2>
    <p>Let’s get you set up to use, buy or sell Civil tokens</p>
  </>
);

export const TokenBuySellHeaderText: React.SFC = props => <h2>Buy or Sell Civil Tokens</h2>;

export const TokenConnectWalletText: React.SFC = props => (
  <>
    <h3>Connect your cryptocurrency wallet</h3>
    <p>Use your wallet to safely store your cryptocurrencies like Ether (ETH) and Civil tokens (CVL)</p>
  </>
);

export const TokenConnectWalletCompletedText: React.SFC = props => (
  <h3>
    <HollowGreenCheck />Wallet Connected
  </h3>
);

export const TokenMustBuyEth: React.SFC = props => (
  <>
    To complete your membership contribution and receive Civil tokens (CVL), you must use Ether (ETH). Then you will be
    able to exchange ETH for CVL.{" "}
    <a href="https://blog.joincivil.com/how-to-purchase-eth-an-explainer-725bd90cfaaa" target="_blank">
      Learn how to buy ETH here.
    </a>
  </>
);

// TODO(jorgelo): Is this text okay?
export const TokenConnectWalletBtnText: React.SFC = props => <>Connect your wallet</>;

// TODO(jorgelo): Find the real text here.
export const TokenAuthText: React.SFC = props => (
  <>
    <h3>Sign up or Log in to your Civil account</h3>
    <p>Create a Civil account with your email address or log in to your existing account.</p>
  </>
);

// TODO(jorgelo): Is this text okay?
export const TokenAuthBtnText: React.SFC = props => <>Sign up or Log in</>;

// Tutorial section

export const TokenVerifySectionText: React.SFC = props => (
  <>
    <h3>Take the Civil Tutorial</h3>
    <p>
      Before you can use, buy or sell Civil tokens, you must complete a tutorial to ensure you understand how to use
      Civil tokens and how the Civil Registry works.
    </p>
  </>
);

export const TokenQuizSectionText: React.SFC = props => (
  <>
    <h3>Civil Tutorial</h3>
    <p>
      Complete a walkthrough and answer a series of questions about Civil and how to use Civil tokens (CVL). This is a
      standard procedure to help inform you of best practices with purchasing and using tokens.
    </p>
    <p>
      It will take about 30 minutes to complete if you're a novice. If at any point you answer incorrectly, don’t worry.
      You will be able to answer the questions again.
    </p>
  </>
);

export const TokenQuizBtnText: React.SFC = props => <>Start the Civil Tutorial</>;

export const TokenQuizCompletedText: React.SFC = props => (
  <h3>
    <HollowGreenCheck />Civil Tutorial Completed
  </h3>
);

// Buy section

export const TokenBuyTextDisabled: React.SFC = props => (
  <p>Once you’ve completed the Civil tutorial, you will be eligible to use, share or buy Civil tokens.</p>
);

export const TokenBuyBtnDisabledText: React.SFC = props => <>Buy CVL</>;

export const TokenBuyFoundationBtnText: React.SFC = props => <>Buy CVL from Civil Media Company in Airswap</>;

export const TokenBuyExchangeBtnText: React.SFC = props => <>Buy CVL on the open market in Airswap</>;

export const TokenBuyText: React.SFC = props => (
  <>
    <p>
      To buy Civil tokens (CVL), you must buy Ether (ETH) and then you will be able to buy CVL. You can’t use USD or
      local currencies to directly buy a Civil token – currencies need to be converted into ETH first.
    </p>
    <span>
      Please note, if you are a first-time ETH purchaser, it may take a few days to get ETH in your wallet. Learn more
      about ETH below.
    </span>
  </>
);

export const TokenAirswapFoundationText: React.SFC = props => (
  <>
    <h3>Contribute to the Civil Foundation</h3>
    <p>
      Buy Civil tokens from The Civil Media Company and 100% net proceeds goes to the Civil Foundation for supporting
      worthy journalism.{" "}
      <a href="https://medium.com/@kinsleyd/5e0ccdc918cc" target="_blank">
        Learn about our transparent pricing.
      </a>
    </p>
  </>
);

export const TokenAirswapExchangeText: React.SFC = props => (
  <>
    <h3>Buy Civil tokens on the open market</h3>
    <p>
      The Civil community can buy and sell Civil tokens between each other without a middle man, sometimes resulting in
      a lower price than offered by The Civil Media Company. Tokens bought on the open market perform the exact same
      utility as those purchased directly from The Civil Media Company, however none of the proceeds go to the Civil
      Foundation. Instead, the funds go to a third-party buyer.
    </p>
  </>
);

export const TokenAirswapExchangeTermsOfSaleTextContainer = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: ${colors.primary.CIVIL_GRAY_2};
`;

export const TokenAirswapExchangeTermsOfSaleText: React.SFC = props => (
  <TokenAirswapExchangeTermsOfSaleTextContainer>
    By clicking buy to purchase Civil tokens, you agree to the{" "}
    <a href="https://civil.co/terms-of-sale/" target="_blank">
      Terms of Sale.
    </a>
  </TokenAirswapExchangeTermsOfSaleTextContainer>
);

export const TokenOrText: React.SFC = props => <p>or</p>;

export const TokenBuyCompleteText: React.SFC = props => (
  <>
    <h3>Thanks for your purchase!</h3>
    <p>Your CVL will be deposited to your wallet address.</p>
    <p>
      Please check the{" "}
      <Link to="/dashboard/tasks/transfer-voting-tokens" target="_blank">
        Dashboard
      </Link>{" "}
      to see your purchased CVL in the Available Balance.<br />To learn how to add Civil tokens in your MetaMask wallet,{" "}
      <a href={FAQ_BASE_URL} target="_blank">
        go to our FAQ <NorthEastArrow color={colors.accent.CIVIL_BLUE} />
      </a>
    </p>
  </>
);

// Sell section

export const TokenSellInstructionsText: React.SFC = props => (
  <p>
    To sell Civil tokens (CVL), you must exchange them for Ether (ETH) and then you will be able to sell ETH for USD or
    local currencies at an exchange like Coinbase. You can’t sell Civil tokens directly for USD or local currencies –
    currencies need to be converted into ETH first.
  </p>
);

export const TokenSellAirswapText: React.SFC = props => <h3>Sell Civil tokens in Airswap</h3>;

export const TokenUnlockSellText: React.SFC = props => (
  <p>
    You must unlock your tokens to remove the restrictions to sell. Once your tokens are unlocked, you will be eligible
    to sell them here.
  </p>
);

export const TokenSellCompleteText: React.SFC = props => (
  <>
    <h3>Your sell was successful! </h3>
    <p>Your ETH will be deposited to your wallet address.</p>
    <p>
      Please check the{" "}
      <Link to="/dashboard/tasks/transfer-voting-tokens" target="_blank">
        Dashboard
      </Link>{" "}
      to see your CVL balance in the Available Balance. To learn how to sell ETH for USD,{" "}
      <a href={FAQ_BASE_URL} target="_blank">
        go to our FAQ <NorthEastArrow color={colors.accent.CIVIL_BLUE} />
      </a>.
    </p>
  </>
);

export const TokenUnlockText: React.SFC = props => (
  <>
    <h4>
      <LockOpenIcon />Unlock Tokens
    </h4>
    <p>
      All first-time token purchasers must unlock their tokens by participating in community votes and the general
      oversight of Civil. This is to prevent speculators from affecting the price of Civil tokens. Learn more in the FAQ
      below.
    </p>
    <p>
      Unlocking your tokens is straightforward, and you only have to do this once. Simply{" "}
      <b>transfer at least 50 percent of your purchased tokens into the voting balance</b>. And that’s it.
    </p>
  </>
);

export const TokenUnlockBtnText: React.SFC = props => <>Unlock My Tokens</>;

// FAQ section

export const TokenETHFAQQuestion1Text: React.SFC = props => <h3>What is Ethereum, ETH and gas?</h3>;

export const TokenETHFAQQuestion2Text: React.SFC = props => <h3>Why do I need ETH?</h3>;

export const TokenETHFAQQuestion3Text: React.SFC = props => <h3>How do I buy ETH?</h3>;

export const TokenETHFAQQuestion4Text: React.SFC = props => <h3>How long does it take to buy ETH?</h3>;

export const TokenETHFAQQuestion5Text: React.SFC = props => <h3>What is Airswap?</h3>;

export const TokenETHFAQQuestion6Text: React.SFC = props => (
  <h3>Why do I need to unlock my Civil tokens before I can sell them?</h3>
);

export const TokenDonateToCivilFoundationText: React.SFC = () => (
  <>
    <h3>Donate to the Civil Foundation</h3>
    <p>Want to support this project, but don’t want to buy Civil tokens? </p>
  </>
);

export const TokenETHFAQQuestion7Text: React.SFC = props => <h3>How do I unlock my tokens?</h3>;

export const TokenQuestionsHeaderText: React.SFC = props => <h3>Ask Questions</h3>;

export const TokenFAQText: React.SFC = props => (
  <>
    <p>
      For support inquiries, send email to <a href={"mailto:" + `${links.EMAIL_SUPPORT}`}>{links.EMAIL_SUPPORT}</a>
    </p>
    <p>
      Read our{" "}
      <a href={FAQ_BASE_URL} target="_blank">
        Frequently Asked Questions (FAQ)
      </a>{" "}
      for general help
    </p>
  </>
);
