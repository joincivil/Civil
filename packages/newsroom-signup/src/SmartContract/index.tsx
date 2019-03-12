import * as React from "react";
import styled from "styled-components";
import { EthAddress, CharterData } from "@joincivil/core";
import { LetsGetStartedPage } from "./LetsGetStartedPage";
import { Button, buttonSizes } from "@joincivil/components";

export interface SmartContractProps {
  profileWalletAddress?: EthAddress;
  charter: Partial<CharterData>;
}

export interface SmartContractState {
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

export class SmartContract extends React.Component<SmartContractProps, SmartContractState> {
  constructor(props: SmartContractProps) {
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
    const steps = [
      <LetsGetStartedPage walletAddress={this.props.profileWalletAddress} name={this.props.charter.name!} />,
    ];
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
