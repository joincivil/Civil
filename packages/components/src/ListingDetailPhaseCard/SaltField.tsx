import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { TextInput } from "../input/";
import { saltToWords } from "@joincivil/utils";

export interface SaltFieldProps {
  salt?: string;
}

export class SaltField extends React.Component<SaltFieldProps> {
  public render(): JSX.Element {
    const label = "Write down your salt please.";

    const saltWords = this.getSaltyWords();
    return <TextInput label={label} placeholder="Enter a unique number" value={saltWords} name="salt" readOnly />;
  }

  private getSaltyWords(): string {
    const { salt } = this.props;

    if (!salt) {
      return "";
    }

    return saltToWords(salt).join(" ");
  }
}
