import * as React from "react";
// tslint:disable-next-line:no-unused-variable Normally isn't needed but we need StyledComponentClass cause of exporting styled components but linter complaining about unused StyledComponentClass
import styled, { StyledComponentClass } from "styled-components";
import { BorderlessButton, Modal, fonts, colors } from "@joincivil/components";

const Wrapper = styled.div`
  margin: auto;
  margin-top: 100px;
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

export const Header = styled.h2`
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

export const SectionHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: bold;
  line-height: 32px;
`;

export const Paragraph = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 28px;
`;

const Button = styled(BorderlessButton)`
  margin: auto;
  display: block;
`;

const LightButton = styled(BorderlessButton)`
  font-weight: 200;
  display: block;
`;

export interface InfoModalButtonState {
  modalOpen: boolean;
}

export interface InfoModalButtonProps {
  content: JSX.Element;
  buttonText: string;
  lightStyle?: boolean;
}

export class InfoModalButton extends React.Component<InfoModalButtonProps, InfoModalButtonState> {
  constructor(props: InfoModalButtonProps) {
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
          <ContentWrapper>{this.props.content}</ContentWrapper>
        </Wrapper>
      </Modal>
    );
  }
  public render(): JSX.Element {
    const button = this.props.lightStyle ? (
      <LightButton onClick={this.showModal}>{this.props.buttonText}</LightButton>
    ) : (
      <Button onClick={this.showModal}>{this.props.buttonText}</Button>
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
