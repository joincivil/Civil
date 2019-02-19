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
  metaMaskSignImgSrc,
  Collapsable,
  HollowGreenCheck,
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
  onOnboardingComplete?(): void;
  onContinue?(): void;
}

export interface WalletOnboardingV2State {
  justSaved?: boolean; // @TODO/toby Remove
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
const ProfileWalletAddress = styled.div`
  font-family: ${fonts.MONOSPACE};
  margin-bottom: 12px;
`;

const ArrowWrap = styled.span`
  margin-left: 1px;
  path {
    fill: ${colors.accent.CIVIL_BLUE};
  }
`;

const WalletLabel = styled.p`
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
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
const InstructionsButtonWrap = styled.div`
  margin-top: 24px;
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
const GetMetaMaskMoreHelp = styled(SmallParagraph)`
  text-align: left;
`;

const ContinueButtonWrap = styled.div`
  margin-top: 48px;
  margin-bottom: 80px;
`;


const ConnectedCheck = styled(HollowGreenCheck)`
  margin-right: 5px;
  vertical-align: bottom;
`;
const ConnectedWalletAddressWrap = styled.div`
  display: inline-block;
  margin: 24px auto 12px;
  text-align: left;
`;
const ConnectedWalletAddress = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_6};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  font-family: ${fonts.MONOSPACE};
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 12px;
  padding: 16px;
`;
const WarningWrap = styled.p`
  background-color: ${colors.accent.CIVIL_RED_ULTRA_FADED};
  border: 1px solid ${colors.accent.CIVIL_RED_FADED};
  border-radius: 4px;
  padding: 12px;

  ${NoteText} {
    display: inline-block;
    max-width: 520px;
  }
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
              <InstructionsButtonWrap>
                <MetaMaskLogoButton onClick={() => this.props.enable()}>Open MetaMask</MetaMaskLogoButton>
              </InstructionsButtonWrap>
            </InstructionsText>
            <InstructionsImage src={metaMaskConnectImgSrc} />
          </InstructionsWrapper>

          <SmallestParagraph>
            If you do not see the MetaMask popup, please click the <MetaMaskIcon /> icon in your browser address bar.
          </SmallestParagraph>

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

          {this.renderFaqEtc()}
        </Wrapper>
      );
    } else if (this.props.metamaskWalletAddress) {
      if (this.props.requireAuth && !this.props.profileWalletAddress) {
        return (
          <Wrapper>
            <SectionTitle>Log in to Civil with your crypto wallet</SectionTitle>
            <IntroText>
              Almost there! To set up your Civil account, you need to authenticate your account with a signature. This is similar to signing in with a password. It verifies your account with your crypto wallet.
            </IntroText>

            <InstructionsWrapper>
              <InstructionsText>
                <p>
                  MetaMask will open a new window, and will require you to sign a message.
                </p>
                <InstructionsButtonWrap>
                  <AccountEthAuth civil={this.props.civil!} onAuthenticated={this.props.onOnboardingComplete} buttonOnly={true} />
                </InstructionsButtonWrap>
              </InstructionsText>
              <InstructionsImage src={metaMaskSignImgSrc} />
            </InstructionsWrapper>

            {this.renderFaqEtc()}
          </Wrapper>
        );
      } else if (this.props.requireAuth && this.props.metamaskWalletAddress !== this.props.profileWalletAddress) {
        return (
          <Wrapper>
            <SectionTitle>Log in to Civil with your crypto wallet</SectionTitle>
            <IntroText>
              The wallet address saved in your profile does not match your current MetaMask wallet address. Please update your profile, or switch MetaMask to use the wallet that is saved to your profile.
            </IntroText>

            <WalletLabel>Profile wallet address</WalletLabel>
            <ProfileWalletAddress>{this.props.profileWalletAddress}</ProfileWalletAddress>{" "}
            <WalletLabel>Connected MetaMask wallet address</WalletLabel>
            <WalletAddress address={this.props.metamaskWalletAddress} />{" "}

            <InstructionsWrapper>
              <InstructionsText>
                <p>
                  Open MetaMask to sign a message to authenticate your MetaMask address and save it to your profile.
                </p>
                <InstructionsButtonWrap>
                  <AccountEthAuth civil={this.props.civil!} onAuthenticated={this.props.onOnboardingComplete} buttonOnly={true} buttonText={"Update Profile"} />
                </InstructionsButtonWrap>
              </InstructionsText>
              <InstructionsImage src={metaMaskSignImgSrc} />
            </InstructionsWrapper>

            {this.renderFaqEtc()}
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            <SectionTitle>
              <ConnectedCheck width={32} height={32} />
              Wallet Connected
            </SectionTitle>
            <IntroText>Your crypto wallet is connected. Your public wallet address will be linked to your email address on the Civil network so you can log in using your wallet.</IntroText>

            <ConnectedWalletAddressWrap>
              <WalletLabel>Public Wallet Address</WalletLabel>
              <ConnectedWalletAddress>{this.props.metamaskWalletAddress}</ConnectedWalletAddress>
            </ConnectedWalletAddressWrap>

            <WarningWrap>
              <NoteText>Make sure you've backed up and saved your MetaMask login and account details, such as your seed phrase, username and password in a safe place. We can’t help you restore or regain access if you lose it.</NoteText>
            </WarningWrap>

            {this.props.onContinue && (
              <ContinueButtonWrap>
                <Button size={buttonSizes.MEDIUM_WIDE} onClick={this.props.onContinue}>
                  Continue
                </Button>
              </ContinueButtonWrap>
            )}

            {this.renderFaqEtc(false)}
          </Wrapper>
        );
      }
    } else {
      return null;
    }
  }

  private renderFaqEtc = (showDisabledButton = true): JSX.Element => {
    return (
      <>
        {showDisabledButton && (
          <ContinueButtonWrap>
            {/*@TODO/toby change button style*/}
            <LargeishButton size={buttonSizes.MEDIUM_WIDE} disabled={true}>
              Continue
            </LargeishButton>
          </ContinueButtonWrap>
        )}

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
}
