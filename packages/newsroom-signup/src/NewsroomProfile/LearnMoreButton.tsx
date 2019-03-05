import * as React from "react";
import { BorderlessButton, InvertedButton, buttonSizes, Modal, fonts, colors } from "@joincivil/components";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: auto;
  margin-top: 55px;
  max-width: 850px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ContentWrapper = styled.div`
  width: 80%;
  margin-left: 15px;
`;

const Header = styled.h2`
  text-align: center;
  font-family: ${fonts.SANS_SERIF};
  font-size: 32px;
  font-weight: bold;
  letter-spacing: -0.67px;
  line-height: 30px;
  padding-bottom: 60px;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_3};
  margin-bottom: 20px;
`;

const SectionHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: bold;
  line-height: 32px;
`;

const Paragraph = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 36px;
`;

const Button = styled(BorderlessButton)`
  margin: auto;
  display: block;
`;

const LightButton = styled(BorderlessButton)`
  font-weight: 200;
  display: block;
`;

export interface LearnMoreButtonState {
  modalOpen: boolean;
}

export interface LearnMoreButtonProps {
  lightStyle?: boolean;
}

export class LearnMoreButton extends React.Component<LearnMoreButtonProps, LearnMoreButtonState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }
  public renderModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }
    return (
      <Modal fullScreen={true}>
        <Wrapper>
          <BorderlessButton onClick={this.close}>Back</BorderlessButton>
          <ContentWrapper>
            <Header>About applying to join Civil</Header>
            <Paragraph>
              In this section we'll take you through the steps to join the Civil network. But first, let’s start with a
              few key terms. In this section we'll take you through the steps to join the Civil network. But first,
              let’s start with a few key terms.
            </Paragraph>

            <SectionHeader>What is the Civil Registry</SectionHeader>
            <Paragraph>
              The Civil Registry is the online destination where prospective Civil Newsrooms apply to be part of the
              network.
            </Paragraph>
            <Paragraph>
              Newsrooms on the Civil Registry have been vetted by the community and deemed it as having a credible,
              journalistic practices as outlined in the{" "}
              <a href="https://civil.co/constitution/" target="_blank">
                Civil Constitution
              </a>.
            </Paragraph>

            <SectionHeader>Civil Tokens</SectionHeader>
            <Paragraph>
              Civil tokens (CVL) enable the "community-owned and operated" Civil model to work. A token is a piece of
              software, it’s not a physical coin. But it does have value and represents a piece of ownership in the
              network.
            </Paragraph>
            <Paragraph>
              For those that want to get more technical, CVL is a utility token based on the ERC20 protocol. It’s a
              value stored in a decentralized database that’s managed by Civil’s smart contracts, which allows the Civil
              platform to interact with the Civil token. CVL is the software that bridges Civil with the Ethereum
              blockchain.
            </Paragraph>

            <SectionHeader>Ether (ETH)</SectionHeader>
            <Paragraph>
              Ether (ETH) is different cryptocurrency than CVL but you will need some to to pay for certain actions on
              Civil like sending tokens. That takes a small amount of computing effort, called Gas, which must be paid
              for in ETH. When sending a transaction, you set a gas limit. You must set this limit carefully, because if
              you set it too low and the transaction fails as a result, you will lose the gas / ETH that you spent.
            </Paragraph>

            <SectionHeader>Applying to the Civil Registry</SectionHeader>
            <Paragraph>
              You will need to deposit $1,000.00 worth of CVL tokens with your application. This is to signal the
              seriousness of your intent to the community.
            </Paragraph>
            <Paragraph>
              Your application for the Newsroom will be up for community review on the Application in Review tab of the
              Civil Registry for 14 days. A Newsroom will be approved if there are no challenges.
            </Paragraph>
            <Paragraph>
              When a new Newsroom applies to be on the Civil Registry, the community has 14 days to review the
              application. During the period, any CVL token holder may challenge this Newsroom if they believe the
              Newsroom’s mission, charter or roster is in any way a violation of the principles of the{" "}
              <a href="https://civil.co/constitution/" target="_blank">
                Civil Constitution
              </a>. If there are no challenges, this Newsroom will be automatically approved. By applying to the
              <a href="https://registry.civil.co/" target="_blank">
                Civil Registry
              </a>, a Newsroom is committing to uphold the values of the{" "}
              <a href="https://civil.co/constitution/" target="_blank">
                Civil Constitution
              </a>.
            </Paragraph>
            <Paragraph>
              The Registry is designed with checks and balances in place to ensure that all voices and perspectives have
              an opportunity to be heard in the Civil community. You can learn more about the review and challenge
              phases{" "}
              <a href="https://cvlconsensys.zendesk.com/hc/en-us/categories/360001542132-Registry" target="_blank">
                here
              </a>.
            </Paragraph>

            <InvertedButton size={buttonSizes.SMALL} target="_blank" href={"https://cvlconsensys.zendesk.com/hc/en-us"}>
              Read more on our FAQ
            </InvertedButton>
          </ContentWrapper>
        </Wrapper>
      </Modal>
    );
  }
  public render(): JSX.Element {
    const button = this.props.lightStyle ? (
      <LightButton onClick={this.showModal}>Learn more about applying to join Civil</LightButton>
    ) : (
      <Button onClick={this.showModal}>Learn more about applying to join Civil</Button>
    );

    return (
      <>
        {button}
        {this.renderModal()}
      </>
    );
  }
  private showModal = (): void => {
    this.setState({ modalOpen: true });
  };
  private close = (): void => {
    this.setState({ modalOpen: false });
  };
}
