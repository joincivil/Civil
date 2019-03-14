import * as React from "react";
import {
  colors,
  FullScreenModal,
  CloseBtn,
  CloseXIcon,
  TokenTutorial,
  HollowGreenCheck,
  Button,
  ButtonProps,
} from "@joincivil/components";
import styled, { StyledComponentClass } from "styled-components";

export interface TutorialModalProps {
  user: any;
}

export interface TutorialModalStates {
  isTutorialComplete: boolean;
  isTutorialModalOpen: boolean;
}

export const LaunchTutorialBtn: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  font-size: 13px;
  letter-spacing: 0.2px;
  margin-top: 7px;
  padding: 10px 45px;
`;

const TutorialCheck = styled.div`
  display: flex;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.2px;
  line-height: 14px;
  margin-top: 20px;

  svg {
    margin-left: 5px;
  }
`;

export class TutorialModal extends React.Component<TutorialModalProps, TutorialModalStates> {
  public constructor(props: TutorialModalProps) {
    super(props);
    this.state = {
      isTutorialModalOpen: false,
      isTutorialComplete: false,
    };
  }

  public render(): JSX.Element {
    const tutorialComplete = this.getTutorialStatus(this.props.user);

    if (tutorialComplete) {
      return (
        <TutorialCheck>
          Tutorial completed <HollowGreenCheck height={16} width={16} />
        </TutorialCheck>
      );
    }
    return (
      <>
        <LaunchTutorialBtn onClick={this.openTutorialModal}>Open the Tutorial</LaunchTutorialBtn>
        <FullScreenModal open={this.state.isTutorialModalOpen} solidBackground={true}>
          <CloseBtn onClick={() => this.closeTutorialModal(this.props.user)}>
            <CloseXIcon color={colors.accent.CIVIL_GRAY_2} />
          </CloseBtn>
          <TokenTutorial handleClose={() => this.closeTutorialModal(this.props.user)} />
        </FullScreenModal>
      </>
    );
  }

  private getTutorialStatus = (user: any) => {
    if (user && user.quizStatus) {
      return true;
    }
    return false;
  };

  private openTutorialModal = () => {
    this.setState({ isTutorialModalOpen: true });
  };

  private closeTutorialModal = (user: any) => {
    const tutorialComplete = this.getTutorialStatus(user);

    if (tutorialComplete) {
      this.setState({ isTutorialModalOpen: false, isTutorialComplete: true });
    } else {
      this.setState({ isTutorialModalOpen: false });
    }
  };
}
