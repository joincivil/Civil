import * as React from "react";
import gql from "graphql-tag";
import { hasInjectedProvider } from "@joincivil/ethapi";
import { ethereumEnable, isWalletOnboarded, getApolloClient } from "@joincivil/utils";
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
  metaMaskNetworkSwitchImgUrl,
  metaMaskLoginImgUrl,
  metaMaskFrontLargeImgUrl,
  metaMaskConnectImgUrl,
  metaMaskSignImgUrl,
  HollowGreenCheck,
  OBSectionTitle,
  OBSectionDescription,
  OBSmallParagraph,
  OBSmallestParagraph,
  OBBorderedSection,
  OBBorderedSectionActive,
  OBCollapsableHeader,
  OBCollapsable,
  OBNoteContainer,
  OBNoteHeading,
  OBNoteText,
  AuthApplicationEnum,
} from "../";
import { AccountEthAuth } from "../Account/";
import styled from "styled-components";

export interface WalletOnboardingV2Props {
  civil?: Civil;
  wrongNetwork?: boolean;
  requiredNetworkNiceName?: string;
  metamaskWalletAddress?: EthAddress;
  profileWalletAddress?: EthAddress;
  helpUrl?: string;
  helpUrlBase?: string;
  authApplicationType?: AuthApplicationEnum;
  onOnboardingComplete?(): void;
}

export interface WalletOnboardingV2State {
  metamaskEnabled?: boolean;
  showWalletConnected?: boolean;
  onboarded?: boolean;
}

const sendNewsroomWelcomeEmailMutation = gql`
  mutation sendNewsroomWelcomeMutation {
    nrsignupSendWelcomeEmail
  }
`;

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

const IntroText = styled(OBSectionDescription)`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const InstructionsWrapper = styled(OBBorderedSection)`
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

const GetMetaMaskBox = styled(OBBorderedSectionActive)`
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
const GetMetaMaskMoreHelp = styled(OBSmallParagraph)`
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

  ${OBNoteText} {
    display: inline-block;
    max-width: 520px;
  }
`;

export class WalletOnboardingV2 extends React.Component<WalletOnboardingV2Props, WalletOnboardingV2State> {
  public static getDerivedStateFromProps(
    props: WalletOnboardingV2Props,
    state: WalletOnboardingV2State,
  ): WalletOnboardingV2State {
    return {
      ...state,
      onboarded: isWalletOnboarded(
        !!props.civil,
        props.metamaskWalletAddress,
        props.profileWalletAddress,
        props.wrongNetwork,
      ),
    };
  }

  constructor(props: WalletOnboardingV2Props) {
    super(props);
    this.state = {};
  }

  public async componentDidMount(): Promise<void> {
    this.setState({ metamaskEnabled: !!(await ethereumEnable()) });
  }

  public render(): JSX.Element | null {
    if (this.state.onboarded) {
      if (this.state.showWalletConnected || !this.props.children) {
        return this.renderConnected();
      } else {
        return <>{this.props.children}</>;
      }
    }

    if (!hasInjectedProvider()) {
      return this.renderNoProvider();
    } else if (!this.state.metamaskEnabled) {
      return this.renderNotEnabled();
    } else if (this.props.civil && this.state.metamaskEnabled && !this.props.metamaskWalletAddress) {
      return this.renderLocked();
    } else if (this.props.wrongNetwork) {
      return this.renderWrongNetwork();
    } else if (this.props.metamaskWalletAddress) {
      if (!this.props.profileWalletAddress) {
        return this.renderSaveAddress();
      } else if (this.props.metamaskWalletAddress !== this.props.profileWalletAddress) {
        return this.renderAddressMismatch();
      }
    }

    return null;
  }

  private renderNoProvider(): JSX.Element {
    return (
      <Wrapper>
        <OBSectionTitle>Connect your crypto wallet</OBSectionTitle>
        <IntroText>
          To log in to your Civil account and continue, you’ll need to use a secure crypto wallet. We recommend using
          MetaMask.
        </IntroText>
        <GetMetaMaskBox>
          <a href="https://metamask.io/" target="_blank">
            <GetMetaMaskImg src={metaMaskFrontLargeImgUrl} />
            <GetMetaMaskText>Get the MetaMask Browser Extension</GetMetaMaskText>
          </a>
        </GetMetaMaskBox>

        <OBSmallestParagraph>
          Once the extension is installed,{" "}
          <a href="javascript:void(0)" onClick={() => window.location.reload()}>
            refresh this page
          </a>
          .
        </OBSmallestParagraph>

        {this.renderFaqEtc()}
      </Wrapper>
    );
  }

  private renderNotEnabled(): JSX.Element {
    return (
      <Wrapper>
        <OBSectionTitle>Connect your crypto wallet</OBSectionTitle>
        <IntroText>
          Civil uses MetaMask to view your public wallet address and prompt you with Ethereum transactions, but first we
          need to connect with MetaMask. Please grant permission to Civil to view your wallet address.
        </IntroText>

        <InstructionsWrapper>
          <InstructionsText>
            <p>MetaMask will open a new window, and will ask you connect Civil to MetaMask to grant access.</p>
            <InstructionsButtonWrap>
              <MetaMaskLogoButton
                onClick={async () => {
                  this.setState({ metamaskEnabled: !!(await ethereumEnable()) });
                }}
              >
                Open MetaMask
              </MetaMaskLogoButton>
            </InstructionsButtonWrap>
          </InstructionsText>
          <InstructionsImage src={metaMaskConnectImgUrl} />
        </InstructionsWrapper>

        <OBSmallestParagraph>
          If you do not see the MetaMask popup, please click the <MetaMaskIcon /> icon in your browser address bar.
        </OBSmallestParagraph>

        {this.renderFaqEtc()}
      </Wrapper>
    );
  }

  private renderLocked(): JSX.Element {
    return (
      <Wrapper>
        <OBSectionTitle>Log in to your crypto wallet</OBSectionTitle>
        <IntroText>
          Please open the MetaMask extension and follow the instructions to log in to your crypto wallet. After you are
          logged in, you can continue.
        </IntroText>
        <InstructionsWrapper>
          <InstructionsText>
            <p>
              Open the MetaMask extension in your browser and follow the instructions to unlock and log into your
              wallet.
            </p>
          </InstructionsText>
          <InstructionsImage src={metaMaskLoginImgUrl} />
        </InstructionsWrapper>

        {this.renderFaqEtc()}
      </Wrapper>
    );
  }

  private renderWrongNetwork(): JSX.Element {
    return (
      <Wrapper>
        <OBSectionTitle>Log in to your crypto wallet</OBSectionTitle>
        <IntroText>
          Please open the MetaMask extension and follow the instructions to log in to your crypto wallet. After you are
          logged in, you can continue.
        </IntroText>

        <InstructionsWrapper>
          <InstructionsText>
            <p>
              Looks like you’re using an unsupported Ethereum network. Make sure you have the{" "}
              <strong>{this.props.requiredNetworkNiceName}</strong> selected.
            </p>
          </InstructionsText>
          <InstructionsImage src={metaMaskNetworkSwitchImgUrl} />
        </InstructionsWrapper>

        {this.renderFaqEtc()}
      </Wrapper>
    );
  }

  private renderSaveAddress(): JSX.Element {
    return (
      <Wrapper>
        <OBSectionTitle>Log in to Civil with your crypto wallet</OBSectionTitle>
        <IntroText>
          Almost there! To set up your Civil account, you need to authenticate your account with a signature. This is
          similar to signing in with a password. It verifies your account with your crypto wallet.
        </IntroText>

        <InstructionsWrapper>
          <InstructionsText>
            <p>MetaMask will open a new window, and will require you to sign a message.</p>
            <InstructionsButtonWrap>
              <AccountEthAuth
                civil={this.props.civil!}
                onAuthenticated={async () => this.ethAddressSaved(true)}
                buttonOnly={true}
              />
            </InstructionsButtonWrap>
          </InstructionsText>
          <InstructionsImage src={metaMaskSignImgUrl} />
        </InstructionsWrapper>

        {this.renderFaqEtc()}
      </Wrapper>
    );
  }

  private renderAddressMismatch(): JSX.Element {
    return (
      <Wrapper>
        <OBSectionTitle>Log in to Civil with your crypto wallet</OBSectionTitle>
        <IntroText>
          The wallet address saved in your profile does not match your current MetaMask wallet address. Please update
          your profile, or switch MetaMask to use the wallet that is saved to your profile.
        </IntroText>
        <WalletLabel>Profile wallet address</WalletLabel>
        <ProfileWalletAddress>{this.props.profileWalletAddress}</ProfileWalletAddress>{" "}
        <WalletLabel>Connected MetaMask wallet address</WalletLabel>
        <WalletAddress address={this.props.metamaskWalletAddress} />{" "}
        <InstructionsWrapper>
          <InstructionsText>
            <p>Open MetaMask to sign a message to authenticate your MetaMask address and save it to your profile.</p>
            <InstructionsButtonWrap>
              <AccountEthAuth
                civil={this.props.civil!}
                onAuthenticated={async () => this.ethAddressSaved()}
                buttonOnly={true}
                buttonText={"Update Profile"}
              />
            </InstructionsButtonWrap>
          </InstructionsText>
          <InstructionsImage src={metaMaskSignImgUrl} />
        </InstructionsWrapper>
        {this.renderFaqEtc()}
      </Wrapper>
    );
  }

  private renderConnected(): JSX.Element {
    return (
      <Wrapper>
        <OBSectionTitle>
          <ConnectedCheck width={32} height={32} />
          Wallet Connected
        </OBSectionTitle>
        <IntroText>
          Your crypto wallet is connected. Your public wallet address will be linked to your email address on the Civil
          network so you can log in using your wallet.
        </IntroText>

        <ConnectedWalletAddressWrap>
          <WalletLabel>Public Wallet Address</WalletLabel>
          <ConnectedWalletAddress>{this.props.metamaskWalletAddress}</ConnectedWalletAddress>
        </ConnectedWalletAddressWrap>

        <WarningWrap>
          <OBNoteText>
            Make sure you've backed up and saved your MetaMask login and account details, such as your seed phrase,
            username and password in a safe place. We can’t help you restore or regain access if you lose it.
          </OBNoteText>
        </WarningWrap>

        <ContinueButtonWrap>
          <Button width={220} size={buttonSizes.MEDIUM_WIDE} onClick={this.onboardingComplete}>
            Continue
          </Button>
        </ContinueButtonWrap>

        {this.renderFaqEtc(false)}
      </Wrapper>
    );
  }

  private renderFaqEtc = (showDisabledButton = true): JSX.Element => {
    return (
      <>
        {showDisabledButton && (
          <ContinueButtonWrap>
            <Button width={220} size={buttonSizes.MEDIUM_WIDE} disabled={true}>
              Continue
            </Button>
          </ContinueButtonWrap>
        )}

        <OBNoteContainer>
          <OBNoteHeading>Using a different wallet?</OBNoteHeading>
          <OBNoteText>
            Make sure it's unlocked
            {this.props.requiredNetworkNiceName && " and connected to the " + this.props.requiredNetworkNiceName}
            . You may need to refresh.
          </OBNoteText>
        </OBNoteContainer>

        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader> What is a cryptocurrency wallet?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            A cryptocurrency wallet is where you will store your CVL tokens and other crypto assets. It is also one of
            the main tools you'll need to log in to the Civil Registry and use the Civil plugin.
          </OBSmallParagraph>
          <OBSmallParagraph>
            Cryptocurrency wallets don’t store any actual money – they store the Public and Private Keys that provide
            access to those assets. You keep your cryptocurrency including ETH and CVL tokens in a wallet. When using
            your wallet on Civil, you use your wallet to pay for fees or transactions. Your wallet address also acts as
            your identity on the Ethereum blockchain.
          </OBSmallParagraph>
          <OBSmallParagraph>
            Consider it like your passport to the Civil economy. With your MetaMask wallet you will be able to store CVL
            tokens, apply, vote, engage on the Registry, and sign, index, archive content using the Publisher plugin.
          </OBSmallParagraph>
        </OBCollapsable>

        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader> Why do I need a cryptocurrency wallet?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            Having a wallet is required. We recommend{" "}
            <a href="https://metamask.io/" target="_blank">
              MetaMask
            </a>{" "}
            to log in and manage your transactions.
          </OBSmallParagraph>
          <OBSmallParagraph>
            You will also use your MetaMask wallet to set up and manage your Newsroom Smart Contract, manage your
            tokens, as well as sign and index posts to the Ethereum blockchain.
          </OBSmallParagraph>
          <OBSmallParagraph>
            After you've set up MetaMask, you'll receive a public wallet address. You'll need to fund your wallet with
            ETH. You can buy ETH with your bank or credit card on a variety of cryptocurrency exchanges.{" "}
            <strong>Note:</strong> Processing times can vary, and it can take up to 7 days for the ETH to be deposited
            in your wallet.
          </OBSmallParagraph>
          <OBSmallParagraph>
            Make sure you've backed up and saved your MetaMask login and seed phrase in a safe place. We can’t help you
            regain access if you lose it.
          </OBSmallParagraph>
        </OBCollapsable>

        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader> Need help setting up your wallet?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            Head over to our{" "}
            <a
              href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360016789691-How-do-I-set-up-my-MetaMask-wallet-"
              target="_blank"
            >
              FAQ guide
            </a>{" "}
            on how to install a MetaMask wallet.
          </OBSmallParagraph>
        </OBCollapsable>

        <GetMetaMaskMoreHelp>
          Need more info before you start using a crypto wallet?{" "}
          <a href="https://cvlconsensys.zendesk.com/hc/en-us/sections/360003838452-Wallets" target="_blank">
            Learn more in our support area{" "}
            <ArrowWrap>
              <NorthEastArrow />
            </ArrowWrap>
          </a>
        </GetMetaMaskMoreHelp>
      </>
    );
  };

  private ethAddressSaved = async (firstAddressSave?: boolean) => {
    this.setState({ showWalletConnected: true });

    if (firstAddressSave && this.props.authApplicationType === AuthApplicationEnum.NEWSROOM) {
      const client = getApolloClient();

      const { error } = await client.mutate({
        mutation: sendNewsroomWelcomeEmailMutation,
      });

      if (error) {
        console.error("Failed to send welcome email:", error);
      }
    }
  };

  private onboardingComplete = () => {
    this.setState({ showWalletConnected: false });
    if (this.props.onOnboardingComplete) {
      this.props.onOnboardingComplete();
    }
  };
}
