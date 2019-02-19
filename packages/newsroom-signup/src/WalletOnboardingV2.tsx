import * as React from "react";
import { Civil, EthAddress } from "@joincivil/core";
import {
  colors,
  AddressWithMetaMaskIcon,
  NorthEastArrow,
  Button,
  buttonSizes,
  MetaMaskSideIcon,
  MetaMaskLogoButton,
  fonts,
  ManagerSectionHeading,
  AccountEthAuth,
  metaMaskNetworkSwitchImgSrc,
  metaMaskLoginImgSrc,
  metaMaskFrontLargeImgSrc,
  metaMaskConnectImgSrc,
  Collapsable,
} from "@joincivil/components";
import {
  SectionTitle,
  SectionDescription,
  BorderedSection,
  BorderedSectionActive,
  SmallParagraph,
  SmallestParagraph,
  CollapsableHeader,
  StyledCollapsable,
  NoteContainer,
  NoteHeading,
  NoteText,
} from "./styledComponents";
import styled from "styled-components";

export interface WalletOnboardingV2Props {
  civil?: Civil;
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
  requireAuth?: boolean;
  enable(): void;
  saveAddressToProfile?(): Promise<void>;
  onOnboardingComplete?(): void;
  onContinue?(): void;
}

export interface WalletOnboardingV2State {
  justSaved?: boolean;
}

const Wrapper = styled.div`
  text-align: center;
  margin: 63px 0 32px;
  padding: 6px 24px 12px;
  background: white;
  color: #5f5f5f;

  &:after {
    content: "";
    display: table;
    clear: both;
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

const LargeishButton = styled(Button)`
  box-sizing: border-box;
  height: 42px;
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
    fill: ${colors.accent.CIVIL_BLUE};
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

const MetaMaskIcon = styled(MetaMaskSideIcon)`
  position: relative;
  top: 3px;
`;

const MetaMaskMockImage = styled.img`
  float: right;
  max-width: 255px;
  margin-bottom: -12px;
`;

const IntroText = styled(SectionDescription)`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const InstructionsWrapper = styled(BorderedSection)`
  display: flex;
  justify-contents: space-between;
  margin: 32px auto 18px;
  max-width: 550px;
  padding: 24px 12px 0 24px;
`;
const InstructionsText = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 15px;
  line-height: 18px;
  margin-top: 20px;
  text-align: left;
`;
const InstructionsImage = styled.img`
  height: 240px;
  width: auto;
`;

const GetMetaMaskBox = styled(BorderedSectionActive)`
  margin: 24px auto 12px;
  max-width: 550px;
  padding: 24px;
`;
const GetMetaMaskImg = styled.img`
  width: 85px;
  height: auto;
  margin-bottom: 16px;
`;
const GetMetaMaskText = styled.div`
  color: ${colors.accent.CIVIL_BLUE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 17px;
  font-weight: bold;
  line-height: 22px;
`;
const GetMetaMaskButtonWrap = styled.div`
  margin-top: 32px;
  margin-bottom: 80px;
`;
const GetMetaMaskMoreHelp = styled(SmallParagraph)`
  text-align: left;
`;

export class WalletOnboardingV2 extends React.Component<WalletOnboardingV2Props, WalletOnboardingV2State> {
  constructor(props: WalletOnboardingV2Props) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element | null {
    if (this.props.noProvider) {
      return (
        <Wrapper>
          <SectionTitle>Connect your crypto wallet</SectionTitle>
          <IntroText>
            To log in into your Civil account and continue, you’ll need to use a secure crypto wallet. We recommend
            using MetaMask.
          </IntroText>
          <GetMetaMaskBox>
            <a href="https://metamask.io/" target="_blank">
              <GetMetaMaskImg src={metaMaskFrontLargeImgSrc} />
              <GetMetaMaskText>Get the MetaMask Browser Extension</GetMetaMaskText>
            </a>
          </GetMetaMaskBox>

          <SmallestParagraph>
            Once the extension is installed,{" "}
            <a href="javascript:void(0)" onClick={() => window.location.reload()}>
              refresh this page
            </a>
            .
          </SmallestParagraph>

          <GetMetaMaskButtonWrap>
            {/*@TODO/toby change button style*/}
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} disabled={true}>
              Continue
            </LargeishButton>
          </GetMetaMaskButtonWrap>

          {this.renderFaqEtc()}
        </Wrapper>
      );
    } else if (this.props.notEnabled) {
      return (
        <Wrapper>
          <SectionTitle>Connect your crypto wallet</SectionTitle>
          <IntroText>
            Civil uses MetaMask to view your public wallet address and prompt you with Ethereum transactions, but first
            we need to connect with MetaMask. Please grant permission to Civil to view your wallet address.
          </IntroText>

          <InstructionsWrapper>
            <InstructionsText>
              <p>MetaMask will open a new window, and will ask you connect Civil to MetaMask to grant access.</p>
              <MetaMaskLogoButton onClick={() => this.props.enable()}>Open MetaMask</MetaMaskLogoButton>
            </InstructionsText>
            <InstructionsImage src={metaMaskConnectImgSrc} />
          </InstructionsWrapper>

          <SmallestParagraph>
            If you do not see the MetaMask popup, please click the <MetaMaskIcon /> icon in your browser address bar.
          </SmallestParagraph>

          <GetMetaMaskButtonWrap>
            {/*@TODO/toby change button style*/}
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} disabled={true}>
              Continue
            </LargeishButton>
          </GetMetaMaskButtonWrap>

          {this.renderFaqEtc()}
        </Wrapper>
      );
    } else if (this.props.walletLocked) {
      return (
        <Wrapper>
          <SectionTitle>Log in to your crypto wallet</SectionTitle>
          <IntroText>
            Please open the MetaMask extension and follow the instructions to log in to your crypto wallet. After you
            are logged in, you can continue.
          </IntroText>
          <InstructionsWrapper>
            <InstructionsText>
              <p>
                Open the MetaMask extension in your browser and follow the instructions to unlock and log into your
                wallet.
              </p>
            </InstructionsText>
            <InstructionsImage src={metaMaskLoginImgSrc} />
          </InstructionsWrapper>

          <GetMetaMaskButtonWrap>
            {/*@TODO/toby change button style*/}
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} disabled={true}>
              Continue
            </LargeishButton>
          </GetMetaMaskButtonWrap>

          {this.renderFaqEtc()}
        </Wrapper>
      );
    } else if (this.props.wrongNetwork) {
      return (
        <Wrapper>
          <SectionTitle>Log in to your crypto wallet</SectionTitle>
          <IntroText>
            Please open the MetaMask extension and follow the instructions to log in to your crypto wallet. After you
            are logged in, you can continue.
          </IntroText>

          <InstructionsWrapper>
            <InstructionsText>
              <p>
                Looks like you’re using an unsupported Ethereum network. Make sure you have the{" "}
                <strong>{this.props.requiredNetworkNiceName}</strong> selected.
              </p>
            </InstructionsText>
            <InstructionsImage src={metaMaskNetworkSwitchImgSrc} />
          </InstructionsWrapper>

          <GetMetaMaskButtonWrap>
            {/*@TODO/toby change button style*/}
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} disabled={true}>
              Continue
            </LargeishButton>
          </GetMetaMaskButtonWrap>

          {this.renderFaqEtc()}
        </Wrapper>
      );
    } else if (this.props.metamaskWalletAddress) {
      if (this.props.saveAddressToProfile && !this.props.profileWalletAddress) {
        return (
          <Wrapper>
            <ManagerSectionHeading>Wallet Connected</ManagerSectionHeading>
            <p>Your wallet is connected. Now you can add your public wallet address to your WordPress user profile.</p>
            <WalletLabel>Your wallet address</WalletLabel>
            <WalletAddress address={this.props.metamaskWalletAddress} />{" "}
            <WalletAction>
              <Button
                size={buttonSizes.MEDIUM_WIDE}
                onClick={this.saveAddress}
                disabled={this.props.profileAddressSaving}
              >
                Save to Your Profile
              </Button>
            </WalletAction>
          </Wrapper>
        );
      } else if (
        this.props.saveAddressToProfile &&
        this.props.metamaskWalletAddress !== this.props.profileWalletAddress
      ) {
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
                onClick={this.saveAddress}
                disabled={this.props.profileAddressSaving}
              >
                Update Profile Address
              </Button>
            </WalletAction>
          </Wrapper>
        );
      } else if (this.props.requireAuth && !this.props.profileWalletAddress) {
        return (
          <Wrapper>
            <AccountEthAuth civil={this.props.civil!} onAuthenticated={this.props.onOnboardingComplete} />
          </Wrapper>
        );
      } else if (this.props.requireAuth && this.props.metamaskWalletAddress !== this.props.profileWalletAddress) {
        return (
          <Wrapper>
            <b>@TODO/toby Mismatch between MM address and profile address - update component copy.</b>
            <AccountEthAuth civil={this.props.civil!} onAuthenticated={this.props.onOnboardingComplete} />
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            <ManagerSectionHeading>Wallet Connected</ManagerSectionHeading>
            <WalletLabel>Your wallet address</WalletLabel>
            <WalletAddress address={this.props.metamaskWalletAddress} />{" "}
            {this.props.onContinue && (
              <div>
                <Button size={buttonSizes.MEDIUM_WIDE} onClick={this.props.onContinue}>
                  Continue
                </Button>
              </div>
            )}
          </Wrapper>
        );
      }
    } else {
      return null;
    }
  }

  private renderFaqEtc = (): JSX.Element => {
    return (
      <>
        <NoteContainer>
          <NoteHeading>Using a different wallet?</NoteHeading>
          <NoteText>
            Make sure it's unlocked
            {this.props.requiredNetworkNiceName && " and connected to the " + this.props.requiredNetworkNiceName}
            . You may need to refresh.
          </NoteText>
        </NoteContainer>

        <StyledCollapsable
          open={false}
          header={<CollapsableHeader> What is a cryptocurrency wallet?</CollapsableHeader>}
        >
          <SmallParagraph>
            A cryptocurrency wallet is where you will store your CVL tokens and other crypto assets. It is also one of
            the main tools you'll need to log in to the Civil Registry and use the Civil plugin.
          </SmallParagraph>
          <SmallParagraph>
            Cryptocurrency wallets don’t store any actual money  –  they store the Public and Private Keys that provide
            access to those assets. You keep your cryptocurrency including ETH and CVL tokens in a wallet. When using
            your wallet on Civil, you use your wallet to pay for fees or transactions. Your wallet address also acts as
            your identity on the Ethereum blockchain.
          </SmallParagraph>
          <SmallParagraph>
            Consider it like your passport to the Civil economy. With your MetaMask wallet you will be able to store CVL
            tokens, apply, vote, engage on the Registry, and sign, index, archive content using the Publisher plugin.
          </SmallParagraph>
        </StyledCollapsable>

        <StyledCollapsable
          open={false}
          header={<CollapsableHeader> Why do I need a cryptocurrency wallet?</CollapsableHeader>}
        >
          <SmallParagraph>
            Having a wallet is required. We recommend{" "}
            <a href="https://metamask.io/" target="_blank">
              MetaMask
            </a>{" "}
            to log in and manage your transactions.
          </SmallParagraph>
          <SmallParagraph>
            You will also use your MetaMask wallet to set up and manage your Newsroom Smart Contract, manage your
            tokens, as well as sign and index posts to the Ethereum blockchain.
          </SmallParagraph>
          <SmallParagraph>
            After you've set up MetaMask, you'll receive a public wallet address. You'll need to fund your wallet with
            ETH. You can buy ETH with your bank or credit card on a variety of cryptocurrency exchanges.{" "}
            <strong>Note:</strong> Processing times can vary, and it can take up to 7 days for the ETH to be deposited
            in your wallet.
          </SmallParagraph>
          <SmallParagraph>
            Make sure you've backed up and saved your MetaMask login and seed phrase in a safe place. We can’t help you
            regain access if you lose it.
          </SmallParagraph>
        </StyledCollapsable>

        <StyledCollapsable
          open={false}
          header={<CollapsableHeader> Need help setting up your wallet?</CollapsableHeader>}
        >
          <SmallParagraph>
            Head over to our{" "}
            <a href="#@TODO/toby FAQ link" target="_blank">
              FAQ guide
            </a>{" "}
            on how to install a MetaMask wallet.
          </SmallParagraph>
        </StyledCollapsable>

        <GetMetaMaskMoreHelp>
          Need more info before you start using a crypto wallet?{" "}
          <a href="#@TODO/toby FAQ link" target="_blank">
            Learn more in our support area{" "}
            <ArrowWrap>
              <NorthEastArrow />
            </ArrowWrap>
          </a>
        </GetMetaMaskMoreHelp>
      </>
    );
  };

  private saveAddress = async () => {
    if (!this.props.saveAddressToProfile) {
      return;
    }
    await this.props.saveAddressToProfile();
    this.setState({ justSaved: true });

    if (this.props.onOnboardingComplete) {
      this.props.onOnboardingComplete();
    }
  };
}
