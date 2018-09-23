import * as React from "react";
import { TextInput } from "./Input";
import { EthAddress } from "@joincivil/core";
import { isWellFormattedAddress } from "@joincivil/utils";

export interface AddressInputProps {
  address: EthAddress;
  onChange(name: any, value: any): void;
}

export class AddressInput extends React.Component<AddressInputProps> {
  public invalid(): boolean {
    return !!this.props.address && !isWellFormattedAddress(this.props.address);
  }
  public render(): JSX.Element {
    const invalid = this.invalid();
    const errorMessage = invalid ? "The address you have entered is invalid" : undefined;
    return (
      <TextInput
        label="Wallet Address"
        placeholder="Enter Wallet Address"
        name="EditorWalletInput"
        onChange={this.props.onChange}
        value={this.props.address}
        invalid={invalid}
        errorMessage={errorMessage}
      />
    );
  }
}
