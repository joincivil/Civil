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
              few key terms.
            </Paragraph>

            <SectionHeader>What is the Civil Registry</SectionHeader>
            <Paragraph>
              The Civil Registry is the online destination where prospective Civil newsrooms apply to be part of the
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

            <SectionHeader>Ether (ETH)</SectionHeader>
            <Paragraph>
              Ether (ETH) is the cryptocurrency or fuel for the Ethereum blockchain. You will need ETH to pay for
              certain transcations on Civil. Each transaction takes a small amount of computing effort, called Gas,
              which is paid for in ETH.
            </Paragraph>

            <SectionHeader>Applying to the Civil Registry</SectionHeader>
            <Paragraph>
              You will need to deposit 5,000 CVL tokens with your application. This is to signal the seriousness of your
              intent to the community.
            </Paragraph>
            <Paragraph>
              Your application to the Civil Registry will be up for community review on the Application in Review tab of
              the Civil Registry for 14 days. A newsroom will be approved if there are no successful challenges.
            </Paragraph>
            <Paragraph>
              When a new newsroom applies to be on the Civil Registry, the community has 14 days to review the
              application. During the period, any CVL token holder may challenge this newsroom by matching the
              application deposit if they believe the newsroom’s mission, charter or roster is in any way a violation of
              the principles of the{" "}
              <a href="https://civil.co/constitution/" target="_blank">
                Civil Constitution
              </a>. If there are no challenges, this newsroom will be automatically approved. By applying to the
              <a href="https://registry.civil.co/" target="_blank">
                Civil Registry
              </a>, a newsroom is committing to uphold the values of the{" "}
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
