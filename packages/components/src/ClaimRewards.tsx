import * as React from "react";
import { SaltInput, TextInput } from "./input/";
import { TransactionButton } from "./TransactionButton";
import { FormCopy, FormHeader } from "./ListingDetailPhaseCard/styledComponents";

export interface ClaimRewardsProps {
  challengeID: string;
  salt: string;
  transactions: any[];
  modalContentComponents?: any;
  onInputChange(propsData: any, validateFn?: () => boolean): void;
}

export interface ClaimRewardsState {
  saltError?: string;
}

export class ClaimRewards extends React.Component<ClaimRewardsProps, ClaimRewardsState> {
  constructor(props: ClaimRewardsProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    return (
      <>
        <FormHeader>Claim Your Rewards</FormHeader>
        <FormCopy>Congratulations, you have a reward available!</FormCopy>
        <FormCopy>
          Please use your pass phrase to claim your reward below. Your pass phrase was created at the time when you
          voted for this challenge.
        </FormCopy>

        <TextInput name="challengeID" readOnly={true} value={this.props.challengeID} label="Challenge ID" />

        <SaltInput salt={this.props.salt} label="Enter your salt" name="salt" onChange={this.onChange} />

        <TransactionButton
          transactions={this.props.transactions}
          modalContentComponents={this.props.modalContentComponents}
        >
          Claim Rewards
        </TransactionButton>
      </>
    );
  }

  private validateSalt = (): boolean => {
    let isValid = true;

    if (!this.props.salt || this.props.salt.length === 0) {
      isValid = false;
      this.setState({
        saltError: "Please enter a valid salt phrase",
      });
    } else {
      this.setState({ saltError: undefined });
    }

    return isValid;
  };

  private onChange = (name: string, value: string): void => {
    let validateFn;

    if (name === "salt") {
      validateFn = this.validateSalt;
    }
    this.props.onInputChange({ [name]: value }, validateFn);
  };
}
