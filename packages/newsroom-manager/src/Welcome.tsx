import * as React from "react";
import styled from "styled-components";
import { ManagerHeading, MetaMaskSideIcon } from "@joincivil/components";

export interface WelcomeProps {
  helpUrl: string;
}

const IconWrap = styled.span`
  padding: 1px 3px 3px;
  border-radius: 2px;
  border: solid 1px #dddddd;
`;

const MoreDetails = styled.p`
  color: #72777c;
  && {
    font-size: 13px;
  }
`;

export class Welcome extends React.Component<WelcomeProps> {
  public render(): JSX.Element {
    return (
      <>
        <ManagerHeading>Welcome</ManagerHeading>

        <p>
          Before getting started setting up your newsroom and applying to the Civil Registry, you'll need to take the
          following steps.
        </p>

        <p>
          You'll need an Ethereum wallet-enabled browser (<a href="https://www.google.com/chrome/" target="_blank">
            Chrome
          </a>,{" "}
          <a href="https://brave.com/" target="_blank">
            Brave
          </a>, or{" "}
          <a href="https://www.mozilla.org/firefox/" target="_blank">
            Firefox
          </a>) with the{" "}
          <a href="https://metamask.io/" target="_blank">
            MetaMask
          </a>{" "}
          <IconWrap>
            <MetaMaskSideIcon />
          </IconWrap>{" "}
          extension installed.{" "}
          <a href={this.props.helpUrl} target="_blank">
            Read our guide
          </a>{" "}
          to learn more about browsers and wallets.{" "}
        </p>

        <p>Next, you'll create your newsroom smart contract. Have the following information ready before you begin:</p>

        <ol>
          <li>Your public wallet address - this will be pulled from MetaMask</li>
          <li>
            Funds in your wallet - you will need a small amount of Ether (ETH) to pay for{" "}
            <a href={this.props.helpUrl + "#TODO"} target="_blank">
              gas
            </a>{" "}
            fees.{" "}
          </li>
          <li>Your newsroom name</li>
          <li>The public wallet addresses for your newsroom's officers and editors that you want to include</li>
        </ol>

        <p>
          You’ll be able to use Civil’s blockchain signing and publishing tools once your newsroom smart contract is
          created. After that, you will complete your Newsroom Application by applying to the Civil Registry. You will
          create your charter, sign the Civil Constitution and deposit CVL tokens.
        </p>

        <MoreDetails>
          For full details about the Civil Newsroom Manager,{" "}
          <a href={this.props.helpUrl} target="_blank">
            visit our FAQ
          </a>.{" "}
        </MoreDetails>
      </>
    );
  }
}
