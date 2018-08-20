import * as React from "react";
import { EthAddress } from "@joincivil/core";
import { NorthEastArrow, Button, buttonSizes } from "./";
import styled from "styled-components";

export interface WalletOnboardingProps {
  noProvider?: boolean;
  walletLocked?: boolean;
  wrongNetwork?: boolean;
  requiredNetworkNiceName?: string;
  metamaskWalletAddress?: EthAddress;
  profileWalletAddress?: EthAddress;
  saveAddressToProfile?(): Promise<void>;
}

const Wrapper = styled.div`
  margin: 32px 0;
  padding: 8px 24px 0;
  background: white;
  border: solid 1px #e5e5e5;
  color: #5f5f5f;

  &:after {
    content: "";
    display: table;
    clear: both;
  }
`;

const LargeishButton = Button.extend`
  box-sizing: border-box;
  height: 42px;
`;
// fix vertical alignment on anchor tag:
const LargeishLinkButton = LargeishButton.extend`
  padding-top: 11px;
`;

const WalletAddress = styled.span`
  display: inline-block;
  margin: 0 0 10px 10px;
  padding: 5px 10px;
  border: 1px solid #dddddd;
`;

const ArrowWrap = styled.span`
  margin-left: 1px;
  path {
    fill: white;
  }
`;

export class WalletOnboarding extends React.Component<WalletOnboardingProps> {
  public render(): JSX.Element | null {
    if (this.props.noProvider) {
      return (
        <Wrapper>
          <h2>It looks like you aren’t logged in to your wallet</h2>
          <p>
            New to this, or don't have a wallet? Having a wallet is mandatory and we recommend{" "}
            <a href="https://metamask.io/" target="_blank">
              MetaMask
            </a>{" "}
            to set up and fund your wallet.{" "}
            <a href="/wp-admin/admin.php?page=civil-newsroom-protocol-help#TODO" target="_blank">
              Read this FAQ
            </a>.
          </p>
          <p>
            MetaMask will create a wallet address and you’ll be able to buy Ether (ETH) with your bank or credit card,
            to cover fees. Processing times can vary (up to 7 days) and we recommend having $50 USD to start.
          </p>
          <p>
            You will use your MetaMask wallet to set up and manage your contract, as well as sign and index posts to the
            Ethereum blockchain. Make sure you've backed up your{" "}
            <a href="/wp-admin/admin.php?page=civil-newsroom-protocol-help#TODO" target="_blank">
              seed phrase
            </a>{" "}
            from MetaMask in a safe place.
          </p>

          <h2>Set up MetaMask wallet</h2>
          <div style={{ display: "inline-block" }}>
            <p>
              <LargeishLinkButton size={buttonSizes.MEDIUM_WIDE} href="https://metamask.io/" target="_blank">
                Open MetaMask.io{" "}
                <ArrowWrap>
                  <NorthEastArrow />
                </ArrowWrap>
              </LargeishLinkButton>
            </p>
            <p>
              Once done,{" "}
              <a href="javascript:void(0)" onClick={() => window.location.reload()}>
                refresh this page
              </a>
            </p>
          </div>
          <div style={{ display: "inline-block", float: "right", textAlign: "center", maxWidth: "240px" }}>
            <p>Already have a wallet?</p>
            <p style={{ color: "#72777c" }}>
              Make sure you are logged in to your wallet on the Rinkeby Test Network, and then{" "}
              <a href="javascript:void(0)" onClick={() => window.location.reload()}>
                refresh this page
              </a>
            </p>.
          </div>
        </Wrapper>
      );
    } else if (this.props.walletLocked) {
      return (
        <Wrapper>
          <h2>Not logged in to wallet</h2>
          <p>
            Please log in to your wallet to continue setting up your newsroom contract.{" "}
            <a href="/wp-admin/admin.php?page=civil-newsroom-protocol-help#TODO" target="_blank">
              Help?
            </a>
          </p>
          <p>Once you are on logged in, refresh this page.</p>
          <p>
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} onClick={() => window.location.reload()}>
              Refresh
            </LargeishButton>
          </p>
        </Wrapper>
      );
    } else if (this.props.wrongNetwork) {
      return (
        <Wrapper>
          <h2>Change your network</h2>
          <p>
            Looks like you’re using an unsupported Ethereum network. Make sure you're using the {this.props.requiredNetworkNiceName}.{" "}
            <a href="/wp-admin/admin.php?page=civil-newsroom-protocol-help#TODO" target="_blank">
              Help?
            </a>
          </p>
          <p>Once you are on the correct network, refresh this page.</p>
          <p>
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} onClick={() => window.location.reload()}>
              Refresh
            </LargeishButton>
          </p>
        </Wrapper>
      );
    } else if (this.props.metamaskWalletAddress) {
      return (
        <Wrapper>
          <h2>Wallet Connected</h2>
          <p>Your wallet is connected. Now it’s time to set up your smart contract.</p>
          <p>
            Your Wallet Address is
            <WalletAddress>{this.props.metamaskWalletAddress}</WalletAddress>
          </p>
          {this.props.profileWalletAddress !== this.props.metamaskWalletAddress && this.props.saveAddressToProfile && (
            <>
              <p>
                Your MetaMask wallet address does not match your WordPress profile's wallet address, which is{" "}
                {this.props.profileWalletAddress || "not set"}.
              </p>
              {/*TODO loading state + success/error state?*/}
              <p>
                <Button size={buttonSizes.MEDIUM_WIDE} onClick={this.props.saveAddressToProfile}>
                  Save MetaMask address to my profile
                </Button>
              </p>
            </>
          )}
        </Wrapper>
      );
    } else {
      return null;
    }
  }
}
