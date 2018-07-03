import * as React from "react";
import { StepHeader, StepProps, StepStyled, Collapsable, StepDescription } from "@joincivil/components";

export class CreateCharter extends React.Component<StepProps> {
  public render(): JSX.Element {
    return (
      <StepStyled disabled={this.props.disabled} index={this.props.index || 0}>
        <Collapsable
          header={
            <>
              <StepHeader disabled={this.props.disabled}>Create your charter (Coming Soon!)</StepHeader>
              <StepDescription disabled={this.props.disabled}>State your newsrooms goals.</StepDescription>
            </>
          }
          disabled={this.props.disabled}
          open={false}
        />
      </StepStyled>
    );
  }
}
