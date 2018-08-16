import * as React from "react";
import { SaltInput, TextInput } from "./input/";
import { TransactionButton } from "./TransactionButton";
import { FormCopy, FormHeader } from "./ListingDetailPhaseCard/styledComponents";

export interface ClaimRewardsProps {
  challengeID: string;
  transactions: any[];
  modalContentComponents?: any;
}

export class ClaimRewards extends React.Component<ClaimRewardsProps> {
  public render(): JSX.Element {
    return (
      <>
        <FormHeader>Claim Your Rewards</FormHeader>
        <FormCopy>Congratulations, you have a reward available!</FormCopy>
        <TextInput name="challengeID" readOnly={true} value={this.props.challengeID} label="Challenge ID" />

        <TransactionButton
          transactions={this.props.transactions}
          modalContentComponents={this.props.modalContentComponents}
        >
          Claim Rewards
        </TransactionButton>
      </>
    );
  }
}
