import * as React from "react";
import { TokenFAQCollapse, FlexColumnsPrimaryModule } from "./TokensStyledComponents";
import {
  TokenETHFAQQuestion1Text,
  TokenETHFAQQuestion2Text,
  TokenETHFAQQuestion3Text,
  TokenETHFAQQuestion4Text,
  TokenETHFAQQuestion5Text,
  TokenETHFAQQuestion6Text,
  TokenETHFAQQuestion7Text,
  TokenETHFAQQuestion8Text,
} from "./TokensTextComponents";
import { Collapsable } from "../Collapsable";

export const UserTokenAccountFaq: React.StatelessComponent = props => {
  return (
    <FlexColumnsPrimaryModule>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion1Text />} open={false}>
          <p>
            Ether (ETH) is the cryptocurrency for the Ethereum blockchain. Gas is the transaction cost that you will
            have to pay in order for your information to be added to the Ethereum blockchain. Gas costs are variable.
            Ether (ETH) acts like any other currency where its value fluctuates with the market.
          </p>
          <p>
            You will have to pay gas in Ether (ETH), which you can purchase via MetaMask and a cryptocurrency exchange
            such as Coinbase.
          </p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion2Text />} open={false}>
          <p>
            When you confirm transactions, buy or send tokens, and send Ether (ETH) on the blockchain, you must pay for
            that computing effort. That payment is calculated in gas. Gas is paid in ETH. Think about it like paying for
            a stamp on an envelope or paying for the shipping costs of sending a package.
          </p>
          <p>ETH is used to also purchase Civil tokens (CVL) from an exchange or from Civil.</p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion3Text />} open={false}>
          <p>
            In order to have Ether (ETH), which you’ll need to have in your wallet in order to complete transactions in
            Civil, you’ll need to open an account at a crypto/fiat exchange such as{" "}
            <a href="https://www.coinbase.com/" target="_blank">
              Coinbase
            </a>{" "}
            or{" "}
            <a href="https://gemini.com/" target="_blank">
              Gemini
            </a>, and connect it to a bank account for transferring your funds. Once you’ve been approved in the
            exchange (which could take varying amounts of time), you can use U.S. dollars or other local currency to
            purchase ETH and fund your wallet. Currencies need to be converted into ETH.
          </p>
          <p>
            Some wallets let you purchase ETH directly, depending on where you live. If your wallet doesn’t let you buy
            currency, you will need to purchase ETH from an exchange, and then transfer the ETH from your exchange
            wallet to your crypto wallet.
          </p>
          <p>You can connect to Coinbase and purchase ETH directly in your MetaMask account.</p>
          <p>
            Once you select <b>Deposit</b> in MetaMask, you can select Coinbase and purchase ETH using USD.
          </p>
          <p>
            You will need to verify your identity and account on Coinbase if it’s your first time. Coinbase uses a ACH
            (Automated Clearing House, which is governed by the Federal Reserve) bank transfer system for U.S.
            customers, and it can take 3-5 business days for funds to transfer from your bank.
          </p>
          <p>Buying ETH with a debit or certain credit cards is instant, once your account is verified on Coinbase.</p>
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
          <p>You will use Ether (ETH) for transactions on Civil. You’ll also use ETH to buy Civil tokens (CVL).</p>
          <p>List of all fees:</p>
          <ul>
            <li>Registration deposit: $1,000 USD worth of CVL tokens (CVL)</li>
            <li>Gas fees for voting or applying on the registry: $1 USD of ETH a vote? (varies)</li>
            <li>
              Appeal, in the event your newsroom is successfully challenged and you need to appeal: 0,000 Civil tokens
              (CVL)
            </li>
          </ul>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion6Text />} open={false}>
          <p>
            AirSwap is a secure decentralized, peer-to-peer token trading network built on the Ethereum blockchain. It
            is an independent entity. Airswap does not charge any of its own fees on each trade. You only have to pay a
            Gas fee for each transaction on Ethereum. You can learn more about Airswap{" "}
            <a href="https://www.airswap.io/" target="_blank">
              here
            </a>.
          </p>
          <p>
            You’ll be able to purchase Civil tokens (CVL) using Ethereum (ETH) in Airswap. Airswap will open its own
            interface to allow you to use ETH to buy CVL. You will need to use a wallet such as Metamask to connect and
            buy those tokens. Since Airswap is based on a trading network, the prices of Civil tokens (CVL) are based on
            the current market rate and can fluctuate.
          </p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion7Text />} open={false}>
          <p>
            We believe that it is critical to ensure that only people who believe in Civil’s mission should possess
            Civil tokens. Speculators have the ability to effect the price of CVL (to both raise and lower), which
            decouples the value of the token from the actual work being done by real participants in the network. They
            become “free riders” - the community does the work of curating the newsrooms yet speculators get the upside.
          </p>
          <p>
            In order to mitigate this, we are enacting restrictions that prevent an owner from transferring tokens under
            certain conditions. We believe that this will drastically reduce the ability for tokens to be listed on
            exchanges.
          </p>
          <p>What are the restrictions?</p>
          <ul>
            <li>
              Everybody is allowed to receive tokens. There are only restrictions on SENDING tokens, but never on
              RECEIVING
            </li>
            <li>
              All token holders must complete the “Civil Tutorial” to do anything with their tokens. This ensures that
              you know how to safely hold your cryptocurrency and that you intend to use CVL for its intended purpose.
            </li>
            <li>
              After you complete the tutorial, you can interact with “core” Civil Smart Contracts, such as the Civil
              Registry, and you are allowed to send CVL to newsrooms on the Registry. However, your account is not yet
              “unlocked” so you cannot sell or transfer your CVL to anyone else.
            </li>
            <li>
              In order to “unlock” your tokens, you must be an active participant in the Civil economy. More details on
              the unlocking process are provided below.
            </li>
            <li>After your tokens are “unlocked” you are allowed to freely transfer or sell your CVL.</li>
          </ul>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion8Text />} open={false}>
          <p>Unlocking your tokens enable you to send and sell them.</p>
          <p>To unlock your tokens, make sure you’re first logged into your MetaMask account</p>
          <ul>
            <li>
              Navigate to your <b>Dashboard</b>, and then onto <b>Tasks</b>, and then to <b>Transfer Tokens</b>
            </li>
            <li>
              Transfer at least 50% of your <b>Available Balance</b> tokens into the <b>Voting Balance</b> and click{" "}
              <b>Transfer</b>
            </li>
          </ul>
          <p>That’s it! Your tokens are now unlocked. And you only have to do this once.</p>
        </Collapsable>
      </TokenFAQCollapse>
    </FlexColumnsPrimaryModule>
  );
};
