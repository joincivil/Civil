import * as React from "react";
import styled from "styled-components";
import { TutorialPage } from "./Tutorial";
import { Button, buttonSizes } from "@joincivil/components";

export interface TutorialState {
  currentStep: number;
}

const ContinueButton = styled(Button)`
  margin: 45px auto;
  font-weight: bold;
`;

const ContinueButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export class Tutorial extends React.Component<{}, TutorialState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }
  public renderButtons(): JSX.Element | void {
    if (this.state.currentStep === 0) {
      return (
        <ContinueButtonContainer>
          <ContinueButton onClick={this.goNext} size={buttonSizes.MEDIUM_WIDE}>
            Continue
          </ContinueButton>
        </ContinueButtonContainer>
      );
    }
  }
  public renderCurrentStep(): JSX.Element {
    const steps = [<TutorialPage />];
    return steps[this.state.currentStep];
  }
  public render(): JSX.Element {
    return (
      <>
        {this.renderCurrentStep()}
        {this.renderButtons()}
      </>
    );
  }
  private goNext = (): void => {
    this.setState({ currentStep: this.state.currentStep + 1 });
  };
}
