import * as React from "react";

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
        onChange={this.onChange.bind(this)}
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
