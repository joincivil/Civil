import * as React from "react";
import { StepHeader, StepProps, StepStyled, Collapsable, StepDescription } from "@joincivil/components";

export class SignConstitution extends React.Component<StepProps> {
  constructor(props: StepProps) {
    super(props);
  }
  public render(): JSX.Element {
    return (<StepStyled disabled={this.props.disabled} index={this.props.index || 0}>
      <Collapsable header={
          <>
            <StepHeader disabled={this.props.disabled} el={this.props.el} isActive={this.props.active === this.props.index}>
              Sign the Civil Constitution
            </StepHeader>
            <StepDescription disabled={this.props.disabled}>Agree to the Civil Constitution</StepDescription>
          </>
        }
        open={false}
        disabled={this.props.disabled}
      >
       stand in
      </Collapsable>
    </StepStyled>)
  }
}
