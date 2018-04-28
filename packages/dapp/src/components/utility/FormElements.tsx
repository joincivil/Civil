import * as React from "react";
import styled from "styled-components";

export const StyledFormContainer = styled.div`
  margin: 1em 0;
`;

export const FormValidationMessage = styled.div`
  color: #c00;
  font-weight: bold;
`;

export const FormGroup = styled.div`
  margin: 0 0 1em;
`;

export interface InputElementProps {
  type: string;
  name?: string;
  value?: string;
  readOnly?: boolean;
  onChange?(event: any): void;
  validate?(event: any): void;
}

export class InputElement extends React.Component<InputElementProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <input
        type={this.props.type}
        name={this.props.name}
        value={this.props.value}
        readOnly={this.props.readOnly}
        onChange={this.onChange}
      />
    );
  }

  private onChange(event: any): void {
    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.validate) {
      this.props.validate(event);
    }
  }
}
