import * as React from "react";
import { StepHeader, StepProps, StepStyled, Collapsable, StepDescription } from "@joincivil/components";

export class ApplyToTCR extends React.Component<StepProps> {
  public render(): JSX.Element {
    return (
      <StepStyled disabled={this.props.disabled} index={this.props.index || 0}>
        <Collapsable
          header={
            <>
              <StepHeader
                disabled={this.props.disabled}
              >
                Apply to the Civil Registry (Coming Soon!)
              </StepHeader>
              <StepDescription disabled={this.props.disabled}>
                Submit your application to the token-curated registry (TCR) and view your status.
              </StepDescription>
            </>
          }
          disabled={this.props.disabled}
          open={false}
        />
      </StepStyled>
    );
  }
}
