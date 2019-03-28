import * as React from "react";
import styled from "styled-components";
import {
  colors,
  OBSectionHeader,
  OBSectionDescription,
  OBNoteText,
  OBCollapsable,
  OBCollapsableHeader,
  OBSmallParagraph,
  OBSmallList,
  Notice,
  NoticeTypes,
  NorthEastArrow,
} from "@joincivil/components";

const EthNotice = styled(Notice)`
  background: ${colors.accent.CIVIL_RED_ULTRA_FADED};
  font-size: 13px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 24px 0;
`;

const GrantNote = styled(OBNoteText)`
  display: block;
  text-align: center;
`;

const GetMoreInfo = styled(OBSmallParagraph)`
  margin-top: 32px;
  text-align: left;
`;
const ArrowWrap = styled.span`
  margin-left: 1px;
  path {
    fill: ${colors.accent.CIVIL_BLUE};
  }
`;

export class UnderstandingEth extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Understanding Ether (ETH)</OBSectionHeader>
        <OBSectionDescription>
          ETH is used to pay for gas fees to complete the transactions in your Newsroom Smart Contract, as well as to
          buy Civil tokens later in this process.
        </OBSectionDescription>

        <EthNotice type={NoticeTypes.ERROR}>
          You can continue to the next step to create your Newsroom Smart Contract, but without ETH your transaction
          will not go through. Please note, if you are a first-time purchaser, it may take a few days to get ETH in your
          wallet.
        </EthNotice>

        <GrantNote>
          If you received a Civil Foundation Grant, your grant covers your initial ETH transaction costs.
        </GrantNote>

        <OBCollapsable open={false} header={<OBCollapsableHeader>What is Ether (ETH)?</OBCollapsableHeader>}>
          <OBSmallParagraph>
            Ether (ETH) is the cryptocurrency that operate the Ethereum blockchain. You can purchase ETH via MetaMask
            plus a cryptocurrency exchange like Coinbase or Gemini.
          </OBSmallParagraph>
          <OBSmallParagraph>
            ETH is used to also purchase Civil tokens (CVL) from an exchange or from Civil.
          </OBSmallParagraph>
        </OBCollapsable>

        <OBCollapsable open={false} header={<OBCollapsableHeader>What is gas?</OBCollapsableHeader>}>
          <OBSmallParagraph>
            When you perform actions like buying or selling tokens, you need to pay the cost of that computing effort.
            That payment is calculated in gas. Think about it like paying for a stamp on an envelope or paying for the
            shipping costs of sending a package. Gas can only be paid for with ETH.
          </OBSmallParagraph>
        </OBCollapsable>

        <OBCollapsable open={false} header={<OBCollapsableHeader>How do I buy ETH?</OBCollapsableHeader>}>
          <OBSmallParagraph>
            To purchase Civil tokens (CVL) and execute the Ethereum transactions needed to complete your application,
            you must buy Ether (ETH). Then you will be able to exchange ETH for CVL. Unfortunately at this time, you
            can’t use USD or local currencies to directly buy Civil tokens. You must first convert local currencies into
            ETH using an exchange like Coinbase or Gemini. You will need to have your debit card or bank account details
            handy, as well as your passport to verify your identity. Don't worry, both Coinbase and Gemini are regulated
            and in compliance with all applicable laws in each jurisdiction in which they operate.
          </OBSmallParagraph>
          <OBSmallParagraph>
            Once you fund your token wallet via Coinbase or Gemini , you can return to Civil where we will walk you
            through how to complete your membership contribution. We know this can be confusing. For more information,
            read this blog post or contact us at support@civil.co
          </OBSmallParagraph>
          <OBSmallParagraph>—</OBSmallParagraph>
          <OBSmallParagraph>
            Once you select <strong>Deposit</strong> in MetaMask, you can select Coinbase and purchase ETH using USD.
          </OBSmallParagraph>
          <OBSmallParagraph>
            You will need to verify your identity and account on Coinbase if it’s your first time. Coinbase uses a ACH
            (Automated Clearing House, which is governed by the Federal Reserve) bank transfer system for U.S.
            customers, and it can take 3-5 business days for funds to transfer from your bank.
          </OBSmallParagraph>
          <OBSmallParagraph>
            Buying ETH with a debit or certain credit cards is instant, once your account is verified on Coinbase.
          </OBSmallParagraph>
        </OBCollapsable>

        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader>How long does it take to buy ETH?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            If you purchase Ether (ETH) in Coinbase using your bank account, Coinbase uses ACH. Automated Clearing
            House, which is governed by the Federal Reserve, is a bank transfer system for U.S. customers, and it can
            take 3-5 business days for funds to transfer from your bank.
          </OBSmallParagraph>
          <OBSmallParagraph>
            Buying ETH with a debit or certain credit cards is instant, once your account is verified on Coinbase.
          </OBSmallParagraph>
          <OBSmallParagraph>
            It can sometimes take up 30 days with your first transaction for the Ether (ETH) to appear in your wallet.
          </OBSmallParagraph>
        </OBCollapsable>

        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader>What else will I need to use ETH for?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            You will use Ether (ETH) for transactions on Civil. You’ll also use ETH to buy Civil tokens (CVL).
          </OBSmallParagraph>
          <OBSmallParagraph>List of all fees:</OBSmallParagraph>
          <OBSmallList>
            <li>
              {/*@TODO/tobek Get from parameterizer*/}
              Registration deposit: <em>5,000 CVL tokens</em>
            </li>
            <li>
              Gas fees for voting or applying on the registry: <em>varies based on Gas rates</em>
            </li>
            <li>
              Appeal, in the event your newsroom is successfully challenged and you need to appeal:{" "}
              <em>varies based on Application deposit</em>
            </li>
          </OBSmallList>
        </OBCollapsable>

        <GetMoreInfo>
          Need more info before you start using ETH?{" "}
          <a href="https://cvlconsensys.zendesk.com/hc/en-us/sections/360003849751-Funding-ETH-and-Gas" target="_blank">
            Learn more in our support area{" "}
            <ArrowWrap>
              <NorthEastArrow />
            </ArrowWrap>
          </a>
        </GetMoreInfo>
      </>
    );
  }
}
