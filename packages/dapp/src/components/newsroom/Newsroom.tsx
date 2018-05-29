import * as React from "react";
import { FormHeading, StepProcess } from "@joincivil/components";
import { NameAndAddress } from "./NameAndAddress";
import { CompleteYourProfile } from "./CompleteYourProfile";

export interface NewsroomState {
  currentStep: number;
};

export class Newsroom extends React.Component<{}, NewsroomState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }
  public render(): JSX.Element {
    return (<>
      <FormHeading>Newsroom Application</FormHeading>
      <p>Set up your newsroom smart contract and get started publishing on Civil.</p>
      <StepProcess stepIsDisabled={this.isDisabled}>
        <NameAndAddress/>
        <CompleteYourProfile/>
      </StepProcess>
    </>);
  }

  public isDisabled = (index: number) => {
    return index <= this.state.currentStep;
  }
}
