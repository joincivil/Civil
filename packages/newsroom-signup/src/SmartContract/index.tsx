import * as React from "react";
import styled from "styled-components";
import { EthAddress, CharterData } from "@joincivil/core";
import { NextBackButtonContainer } from "../styledComponents";
import { LetsGetStartedPage } from "./LetsGetStartedPage";
import { UnderstandingEth } from "./UnderstandingEth";
import { BorderlessButton, Button, buttonSizes } from "@joincivil/components";

export interface SmartContractProps {
  currentStep: number;
  profileWalletAddress?: EthAddress;
  charter: Partial<CharterData>;
  navigate(go: 1 | -1): void;
}

const ContinueButton = styled(Button)`
  margin: 45px auto;
  font-weight: bold;
`;

const ContinueButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export class SmartContract extends React.Component<SmartContractProps> {
  public getDisabled(index: number): () => boolean {
    const functions = [
      () => {
        return false;
      },
      () => {
        return false;
      },
    ];

    return functions[index];
  }

  public renderButtons(): JSX.Element | void {
    if (this.props.currentStep === 0) {
      return (
        <ContinueButtonContainer>
          <ContinueButton onClick={() => this.props.navigate(1)} size={buttonSizes.MEDIUM_WIDE}>
            Continue
          </ContinueButton>
        </ContinueButtonContainer>
      );
    }

    return (
      <NextBackButtonContainer>
        {this.props.currentStep > 0 ? (
          <BorderlessButton size={buttonSizes.MEDIUM} onClick={() => this.props.navigate(-1)}>
            Back
          </BorderlessButton>
        ) : (
          <div />
        )}
        <Button
          disabled={this.getDisabled(this.props.currentStep)()}
          textTransform="none"
          width={220}
          size={buttonSizes.MEDIUM}
          onClick={() => this.props.navigate(1)}
        >
          Next
        </Button>
      </NextBackButtonContainer>
    );
  }
  public renderCurrentStep(): JSX.Element {
    const steps = [
      <LetsGetStartedPage walletAddress={this.props.profileWalletAddress} name={this.props.charter.name!} />,
      <UnderstandingEth />,
    ];
    return steps[this.props.currentStep];
  }
  public render(): JSX.Element {
    return (
      <>
        {this.renderCurrentStep()}
        {this.renderButtons()}
      </>
    );
  }
}
