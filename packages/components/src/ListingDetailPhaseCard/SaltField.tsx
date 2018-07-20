import { saltToWords } from "@joincivil/utils";
import * as React from "react";
import { TextInput } from "../input/";

export interface SaltFieldProps {
  salt?: string;
}

export class SaltField extends React.Component<SaltFieldProps> {
  public render(): JSX.Element {
    const label = "Write down your salt please.";

    const saltWords = this.getSaltyWords();
    return <TextInput label={label} value={saltWords} name="salt" readOnly />;
  }

  private getSaltyWords(): string {
    const { salt } = this.props;

    if (!salt) {
      return "";
    }

    return saltToWords(salt).join(" ");
  }
}
