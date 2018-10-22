import * as React from "react";
import { EthAddress } from "@joincivil/core";
import {
  AddressWithMetaMaskIcon,
  NorthEastArrow,
  Button,
  buttonSizes,
  MetaMaskSideIcon,
  fonts,
  ManagerSectionHeading,
} from "./";
import styled from "styled-components";
import * as metaMaskNetworkSwitchUrl from "./images/img-metamask-networkswitch@2x.png";
import * as metaMaskLoginUrl from "./images/img-metamask-login@2x.png";

export interface WalletOnboardingProps {
  noProvider?: boolean;
  walletLocked?: boolean;
  wrongNetwork?: boolean;
  requiredNetworkNiceName?: string;
  metamaskWalletAddress?: EthAddress;
  profileWalletAddress?: EthAddress;
  profileUrl?: string;
  profileAddressSaving?: boolean;
  helpUrl?: string;
  helpUrlBase?: string;
  notEnabled?: boolean;
  enable(): void;
  saveAddressToProfile?(): Promise<void>;
}

const Wrapper = styled.div`
  margin: 32px 0;
  padding: 6px 24px 12px;
  background: white;
  border: solid 1px #e5e5e5;
  color: #5f5f5f;

  &:after {
    content: "";
    display: table;
    clear: both;
  }
`;

const LargeishButton = styled(Button)`
  box-sizing: border-box;
  height: 42px;
`;
// fix vertical alignment on anchor tag:
const LargeishLinkButton = styled(LargeishButton)`
  padding-top: 11px;
`;

const WalletAddress = styled(AddressWithMetaMaskIcon)`
  margin-bottom: 28px;
`;
const ProfileWalletAddress = styled.span`
  font-family: ${fonts.MONOSPACE};
`;

const ArrowWrap = styled.span`
  margin-left: 1px;
  path {
    fill: white;
  }
`;

const WalletAction = styled.div`
  display: inline-block;
  margin-left: 12px;
  padding-left: 15px;
  border-left: 1px solid #dddddd;
`;

const WalletLabel = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

const MetaMaskMockImage = styled.img`
  float: right;
  max-width: 255px;
  margin-bottom: -12px;
`;

export class WalletOnboarding extends React.Component<WalletOnboardingProps> {
  public render(): JSX.Element | null {
    if (this.props.noProvider) {
      return (
        <Wrapper>
          <ManagerSectionHeading>It looks like you aren’t logged in to your wallet</ManagerSectionHeading>
          <p>
            New to this, or don't have a wallet? Having a wallet is mandatory and we recommend{" "}
            <a href="https://metamask.io/" target="_blank">
              MetaMask
            </a>{" "}
            <MetaMaskSideIcon /> to set up and fund your wallet.{" "}
            <a href={this.props.helpUrl} target="_blank">
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
            <a
              href={
                this.props.helpUrlBase +
                "articles/360017414652-What-is-a-recovery-phrase-seed-and-why-is-it-important-to-secure-it-"
              }
              target="_blank"
            >
              seed phrase
            </a>{" "}
            from MetaMask in a safe place.
          </p>

          <div style={{ display: "inline-block" }}>
            <ManagerSectionHeading>MetaMask Wallet</ManagerSectionHeading>
            <p>
              <LargeishLinkButton size={buttonSizes.MEDIUM_WIDE} href="https://metamask.io/" target="_blank">
                Open MetaMask.io{" "}
                <ArrowWrap>
                  <NorthEastArrow />
                </ArrowWrap>
              </LargeishLinkButton>
            </p>
            <p>
              Once the extension is installed,{" "}
              <a href="javascript:void(0)" onClick={() => window.location.reload()}>
                refresh this page
              </a>
              .
            </p>
          </div>
          <div style={{ display: "inline-block", float: "right", maxWidth: "240px" }}>
            <p style={{ color: "#23282d", marginBottom: "-10px" }}>Already have a wallet?</p>
            <p style={{ color: "#72777c" }}>
              Make sure you have unlocked it and are connected to the {this.props.requiredNetworkNiceName}, and then{" "}
              <a href="javascript:void(0)" onClick={() => window.location.reload()}>
                refresh this page
              </a>
              .
            </p>
          </div>
        </Wrapper>
      );
    } else if (this.props.notEnabled) {
      return (
        <Wrapper>
          <ManagerSectionHeading>MetaMask not enabled</ManagerSectionHeading>
          <p>Press this button to enable metamask for this domain</p>
          <p>
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} onClick={() => this.props.enable()}>
              Enable
            </LargeishButton>
          </p>
        </Wrapper>
      );
    } else if (this.props.walletLocked) {
      return (
        <Wrapper>
          <MetaMaskMockImage src={metaMaskLoginUrl} />
          <ManagerSectionHeading>Not logged in to wallet</ManagerSectionHeading>
          <p>
            Please open the MetaMask extension and follow the instructions to log in to your wallet. After you are
            logged in, you can continue with your newsroom smart contract.{" "}
            <a href={this.props.helpUrl} target="_blank">
              Need help?
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
          <MetaMaskMockImage src={metaMaskNetworkSwitchUrl} />
          <ManagerSectionHeading>Change your network</ManagerSectionHeading>
          <p>
            Looks like you’re using an unsupported Ethereum network. Make sure you're using the{" "}
            {this.props.requiredNetworkNiceName}.{" "}
            <a
              href={this.props.helpUrlBase + "articles/360017414812-How-do-I-switch-networks-in-MetaMask-"}
              target="_blank"
            >
              Read this tutorial
            </a>{" "}
            to switch networks in MetaMask <MetaMaskSideIcon />
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
      if (!this.props.profileWalletAddress) {
        return (
          <Wrapper>
            <ManagerSectionHeading>Wallet Connected</ManagerSectionHeading>
            <p>Your wallet is connected. Now you can add your public wallet address to your WordPress user profile.</p>
            <WalletLabel>Your wallet address</WalletLabel>
            <WalletAddress address={this.props.metamaskWalletAddress} />{" "}
            <WalletAction>
              <Button
                size={buttonSizes.MEDIUM_WIDE}
                onClick={this.props.saveAddressToProfile}
                disabled={this.props.profileAddressSaving}
              >
                Save to Your Profile
              </Button>
            </WalletAction>
          </Wrapper>
        );
      } else if (this.props.metamaskWalletAddress !== this.props.profileWalletAddress) {
        return (
          <Wrapper>
            <ManagerSectionHeading>Wallet Connected</ManagerSectionHeading>
            <p style={{ color: "#f2524a" }}>
              Your WordPress user profile wallet address does not match your MetaMask wallet address
            </p>
            <WalletLabel>Profile wallet address</WalletLabel>
            <ProfileWalletAddress>{this.props.profileWalletAddress}</ProfileWalletAddress>{" "}
            <WalletLabel>Connected wallet address</WalletLabel>
            <WalletAddress address={this.props.metamaskWalletAddress} />{" "}
            <WalletAction>
              <Button
                size={buttonSizes.MEDIUM_WIDE}
                onClick={this.props.saveAddressToProfile}
                disabled={this.props.profileAddressSaving}
              >
                Update Profile Address
              </Button>
            </WalletAction>
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            <ManagerSectionHeading>Wallet Connected</ManagerSectionHeading>
            <WalletLabel>Your wallet address</WalletLabel>
            <WalletAddress address={this.props.metamaskWalletAddress} />{" "}
            <WalletAction>
              <a href={this.props.profileUrl}>Open Profile</a>
            </WalletAction>
          </Wrapper>
        );
      }
    } else {
      return null;
    }
  }
}
