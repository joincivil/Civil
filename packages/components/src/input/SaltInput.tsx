import * as React from "react";
import { TextInput } from "../input/";
import { wordsToSalt } from "@joincivil/utils";

export interface SaltInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  onChange(name: string, value: string): void;
}

export interface SaltInputState {
  isValid: boolean;
  value: string;
}

export class SaltInput extends React.Component<SaltInputProps, SaltInputState> {
  constructor(props: SaltInputProps) {
    super(props);
    this.state = {
      isValid: false,
      value: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  public render(): JSX.Element {
    const { name, label, placeholder } = this.props;
    const { value, isValid } = this.state;

    return <TextInput label={label} placeholder={placeholder} name={name} onChange={this.handleChange} value={value} />;
  }

  private handleChange(name: string, value: string): void {
    const { onChange } = this.props;

    const nextState = { ...this.state };

    const onlyLetters = value.replace(/[^a-z ]/, "").replace(/[ ]+/, " ");

    nextState.value = onlyLetters;

    try {
      const saltNum = wordsToSalt(onlyLetters);
      nextState.isValid = true;
      onChange(name, saltNum.toFixed());
    } catch (err) {
      nextState.isValid = false;
      onChange(name, "");
    }

    this.setState(nextState);
  }
}
