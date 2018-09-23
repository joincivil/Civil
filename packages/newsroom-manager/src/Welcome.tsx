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

        <p>Before getting started, here are the steps to set up your newsroom contract.</p>

        <p>
          First, you'll need an Ethereum wallet-enabled browser (<a
            href="https://www.google.com/chrome/"
            target="_blank"
          >
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
            Read this FAQ
          </a>{" "}
          to learn more.{" "}
        </p>

        <p>
          Then, you'll need to set up your newsroom contract. Have the following information ready before you begin:
        </p>

        <ol>
          <li>Your public wallet address - this will be pulled from MetaMask</li>
          <li>
            Funds in your wallet - you will need a small amount of Ether (ETH) to pay for{" "}
            <a href={this.props.helpUrl + "#TODO"} target="_blank">
              gas
            </a>{" "}
            fees.{" "}
          </li>
          <li>What you want to name your newsroom</li>
          <li>The public wallet addresses for your newsroom's co-officers and editors</li>
        </ol>

        <MoreDetails>
          For full details about the Civil Newsroom Manager,{" "}
          <a href={this.props.helpUrl} target="_blank">
            view more
          </a>.{" "}
        </MoreDetails>
      </>
    );
  }
}
