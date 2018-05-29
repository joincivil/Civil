import * as React from "react";
import { StepHeader, StepProps, StepStyled } from "@joincivil/components";

export class CompleteYourProfile extends React.Component<StepProps> {
  constructor(props: StepProps) {
    super(props);
  }
  public render(): JSX.Element {
    console.log(this.props.disabled);
    return (<StepStyled index={this.props.index || 0}>
      <StepHeader el={this.props.el} isActive={this.props.active === this.props.index}>
        Complete your profile
      </StepHeader>
      <p>Add owners, editors, and your charter to your profile.</p>
    </StepStyled>)
  }
}
