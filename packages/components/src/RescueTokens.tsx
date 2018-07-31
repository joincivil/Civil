import * as React from "react";
import { TextInput } from "./input/";
import { TransactionButton } from "./TransactionButton";
import { FormCopy, FormHeader } from "./ListingDetailPhaseCard/styledComponents";

export interface RescueTokensProps {
  challengeID: string,
  transactions: any[],
  modalContentComponents?: any;
}

export class RescueTokens extends React.Component<RescueTokensProps> {
  public render(): JSX.Element {
    return (
      <>
        <FormHeader>Rescue Tokens</FormHeader>
        <FormCopy>
          You did not reveal your vote. Please use the below button to rescue your unrevealed voting tokens.
        </FormCopy>

        <TextInput name="challengeID" readOnly={true} value={this.props.challengeID} label="Challenge ID" />

        <TransactionButton
          transactions={this.props.transactions}
          modalContentComponents={this.props.modalContentComponents}
        >
          Rescue Tokens
        </TransactionButton>
      </>
    );
  }
}
