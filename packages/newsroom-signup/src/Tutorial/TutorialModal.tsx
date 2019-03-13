import * as React from "react";
import {
  colors,
  FullScreenModal,
  CloseBtn,
  CloseXIcon,
  TokenTutorial,
  TokenBtns,
  HollowGreenCheck,
} from "@joincivil/components";

export interface TutorialModalProps {
  user: any;
}

export interface TutorialModalStates {
  isTutorialComplete: boolean;
  isTutorialModalOpen: boolean;
}

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
        <>
          <HollowGreenCheck height={16} width={16} /> Tutorial completed
        </>
      );
    }
    return (
      <>
        <TokenBtns onClick={this.openTutorialModal}>Open the Tutorial</TokenBtns>
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
