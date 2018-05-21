import * as React from "react";
import styled from "styled-components";

export const StyledFormContainer = styled.div`
  margin: 1rem 0;
`;

export const FormValidationMessage = styled.div`
  color: #c00;
  font-weight: bold;
`;

export const FormGroup = styled.div`
  margin: 0 0 1rem;
`;

export interface InputElementProps {
  type: string;
  name?: string;
  value?: string;
  readOnly?: boolean;
  onChange?(event: any): void;
  validate?(event: any): void;
}

export interface InputSelectElementProps {
  options: string[];
  name?: string;
  value?: string;
  onChange?(event: any): void;
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

  private onChange = (event: any): void => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.validate) {
      this.props.validate(event);
    }
  };
}

export class InputSelectElement extends React.Component<InputSelectElementProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <select name={this.props.name} value={this.props.value} onChange={this.onChange}>
        {this.props.options.map((option: string): JSX.Element => {
          const optionData = [option, option];
          return <InputSelectOptionElement option={optionData as [string, string]} key={option} />;
        })}
      </select>
    );
  }

  private onChange = (event: any): void => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };
}

export interface InputElementOptionProps {
  option: [string, string];
}

class InputSelectOptionElement extends React.Component<InputElementOptionProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return <option value={this.props.option[1]}>{this.props.option[0]}</option>;
  }
}
