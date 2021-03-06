import * as React from "react";
import { TokenFAQCollapse, FlexColumnsPrimaryModule, TokenFAQImg } from "./TokensStyledComponents";
import {
  TokenETHFAQQuestion1Text,
  TokenETHFAQQuestion2Text,
  TokenETHFAQQuestion3Text,
  TokenETHFAQQuestion4Text,
  TokenETHFAQQuestion5Text,
} from "./TokensTextComponents";
import { Collapsable } from "../Collapsable";
import metamaskEthAmount from "../images/img-metamask-eth-amount@2x.png";

export const UserTokenAccountFaq: React.FunctionComponent = props => {
  return (
    <FlexColumnsPrimaryModule>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion1Text />} open={false}>
          <TokenFAQImg>
            <div>
              <p>
                Ether (ETH) is the cryptocurrency for the Ethereum blockchain. Gas is the transaction cost of performing
                actions like adding content, or buying Civil tokens. Gas costs are variable. Like any currency, Ether
                (ETH) fluctuates in value with the market.
              </p>
              <p>
                You will have to pay gas in Ether (ETH), which you can purchase via MetaMask and a cryptocurrency
                exchange such as Coinbase.
              </p>
            </div>
            <img src={metamaskEthAmount} />
          </TokenFAQImg>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion2Text />} open={false}>
          <p>
            When you perform actions like buying or selling tokens, you need to pay the cost of that computing effort.
            That payment is calculated in gas. Think about it like paying for a stamp on an envelope or paying for the
            shipping costs of sending a package. Gas can only be paid for with ETH.
          </p>
          <p>ETH is used to also purchase Civil tokens (CVL) from an exchange or from Civil.</p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion3Text />} open={false}>
          <p>
            To complete your membership contribution and receive Civil tokens (CVL), you must buy Ether (ETH). Then you
            will be able to exchange ETH for CVL. Unfortunately at this time, you can’t use USD or local currencies to
            directly buy Civil tokens. You must first convert local currencies into ETH using an exchange like Coinbase
            or Gemini. You will need to have your debit card or bank account details handy, as well as your passport to{" "}
            <a
              href="https://support.coinbase.com/customer/en/portal/articles/1220621-identity-verification?b_id=13521"
              target="_blank"
            >
              verify your identity
            </a>
            Don't worry, both Coinbase and Gemini are regulated and in compliance with all applicable laws in each
            jurisdiction in which they operate. Once you fund your token wallet via{" "}
            <a href="https://www.coinbase.com/signup" target="_new">
              Coinbase
            </a>{" "}
            or{" "}
            <a href="https://exchange.gemini.com/register/check-location" target="_blank">
              Gemini{" "}
            </a>{" "}
            (), you can return to Civil where we will walk you through how to complete your membership contribution. We
            know this can be confusing. For more information, read this blog post or contact us at{" "}
            <a href="mailto:support@civil.co">support@civil.co</a>.
          </p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion4Text />} open={false}>
          <p>
            If you purchase Ether (ETH) in Coinbase using your Bank Account, Coinbase uses a ACH (Automated Clearing
            House, which is governed by the Federal Reserve) bank transfer system for U.S. customers, and it can take
            3-5 business days for funds to transfer from your bank.
          </p>
          <p>Buying ETH with a debit or certain credit cards is instant, once your account is verified on Coinbase.</p>
          <p>
            It can possibly take up 30 days with your first transaction for the Ether (ETH) to appear in your wallet.
          </p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion5Text />} open={false}>
          <p>
            AirSwap is a secure decentralized, peer-to-peer token trading network built on the Ethereum blockchain. It
            is an independent entity. Airswap does not charge any of its own fees on each trade. You only have to pay a
            Gas fee for each transaction on Ethereum. You can learn more about Airswap{" "}
            <a href="https://www.airswap.io/" target="_blank">
              here
            </a>
            .
          </p>
          <p>
            You’ll be able to purchase Civil tokens (CVL) using Ethereum (ETH) in Airswap. Airswap will open its own
            interface to allow you to use ETH to buy CVL. You will need to use a wallet such as Metamask to connect and
            buy those tokens. Since Airswap is based on a trading network, the prices of Civil tokens (CVL) are based on
            the current market rate and can fluctuate.
          </p>
        </Collapsable>
      </TokenFAQCollapse>
    </FlexColumnsPrimaryModule>
  );
};
