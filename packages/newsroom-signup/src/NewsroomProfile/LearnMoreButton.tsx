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

export interface LearnMoreButtonState {
  modalOpen: boolean;
}

export class LearnMoreButton extends React.Component<{}, LearnMoreButtonState> {
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
            <SectionHeader>What is the process and what to expect</SectionHeader>
            <Paragraph>
              In this section we'll take you thought the steps of completing your application to join the Civil network.
              You will be led through the steps of completing your application to the Civil Registry, which unlocks
              several key benefits. It allows you to be part of a community that has vetted your newsroom and deemed it
              as having a credible journalistic mission. It also allows your content to be featured alongside content
              from other approved Civil network newsrooms.
            </Paragraph>
            <Paragraph>
              When creating your Newsroom Profile, we will ask you to complete the application asking for information
              about your newsroom. We ask that any newsroom applying to the registry provide the information to the best
              of their ability.
            </Paragraph>
            <SectionHeader>What is the Civil Registry</SectionHeader>
            <Paragraph>
              Civil Registry is the destination to which prospective Civil Newsrooms must apply to access publishing
              rights on the Civil platform. You can apply to the Civil Registry after creating your Newsroom Smart
              Contract.
            </Paragraph>
            <Paragraph>
              Being included in the Civil Registry means that the community has vetted a Newsroom and deemed it as
              having a credible, journalistic mission, and that it has pledged to adhere to the journalistic ethics
              outlined by the Civil Constitution.
            </Paragraph>
            <SectionHeader>Applying to the Civil Registry</SectionHeader>
            <Paragraph>
              You will need to deposit 0,000 CVL token with your application. This is to state the seriousness of your
              intent to the community.
            </Paragraph>
            <Paragraph>
              Your application for the Newsroom will be up for community vote and review on the Application in Review
              tab of the Civil Registry for 14 days. A Newsroom will be approved if there are no challenges.
            </Paragraph>
            <Paragraph>
              If the application is challenged by the community, there will be a 10 day period for the community to
              Commit their votes. In order to finalize their votes, they have a 7 day period to Confirm. The newsroom
              can request an Appeal from the Civil Council within 3 days. The Civil Council will decide on the appeal
              within 14 days, and the challenge can be appealed, and the Commit and Confirm process begins again.
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
    return (
      <>
        <Button onClick={this.showModal}>Learn more about applying to join Civil</Button>
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
