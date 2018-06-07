import * as React from "react";
import { EthAddress, ListingWrapper, TwoStepEthTransaction } from "@joincivil/core";
import { approve, depositTokens, exitListing, withdrawTokens } from "../../apis/civilTCR";
import { InputElement, StyledFormContainer, FormGroup, FormValidationMessage } from "../utility/FormElements";
import { TransactionButton } from "@joincivil/components";
import BigNumber from "bignumber.js";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";

export interface OwnerListingViewProps {
  listingAddress: EthAddress;
  listing: ListingWrapper;
}

export interface DepositTokensState {
  numTokens?: string;
}

export interface WithdrawTokensState {
  numTokens?: string;
  isWithdrawalAmountValid?: boolean;
}

export class DepositTokens extends React.Component<OwnerListingViewProps, DepositTokensState> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <ViewModule>
        <ViewModuleHeader>Deposit Additional Tokens</ViewModuleHeader>
        <FormGroup>
          <label>
            Number of Tokens
            <InputElement
              type="text"
              name="numTokens"
              // validate={this.validateVoteCommittedTokens}
              onChange={this.updateViewState}
            />
          </label>
        </FormGroup>

        <FormGroup>
          <TransactionButton transactions={[{ transaction: this.approveDeposit }, { transaction: this.deposit }]}>
            Deposit
          </TransactionButton>
        </FormGroup>
      </ViewModule>
    );
  }

  private approveDeposit = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string);
    return approve(numTokens);
  };

  private deposit = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string);
    return depositTokens(this.props.listingAddress, numTokens);
  };

  private updateViewState = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
  };
}

export class WithdrawTokens extends React.Component<OwnerListingViewProps, WithdrawTokensState> {
  constructor(props: any) {
    super(props);
    this.state = {
      numTokens: "0",
      isWithdrawalAmountValid: true,
    };
  }

  public render(): JSX.Element {
    return (
      <StyledFormContainer>
        <h3>Withdraw Unstaked Tokens</h3>
        <FormGroup>
          <label>
            Number of Tokens
            {!this.state.isWithdrawalAmountValid && (
              <FormValidationMessage children="Please enter a valid withdrawal amount" />
            )}
            <InputElement
              type="text"
              name="numTokens"
              validate={this.validateWithdrawalAmount}
              onChange={this.updateViewState}
            />
          </label>
        </FormGroup>

        <FormGroup>
          <TransactionButton transactions={[{ transaction: this.withdraw }]}>Withdraw</TransactionButton>
        </FormGroup>
      </StyledFormContainer>
    );
  }

  private validateWithdrawalAmount = (event: any): void => {
    const val: number = parseInt(event.target.value, 10);
    const isWithdrawalAmountValid: boolean =
      !!Number.isInteger(val) && val > 0 && val <= this.props.listing.data.unstakedDeposit.toNumber();
    this.setState({ isWithdrawalAmountValid });
  };

  private withdraw = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string);
    return withdrawTokens(this.props.listingAddress, numTokens);
  };

  // @TODO(jon): I know this is gross and not very DRY, but this will be refactored
  // when we have Redux and a canonical store for the app
  private updateViewState = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
  };
}

export class ExitListing extends React.Component<OwnerListingViewProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return <TransactionButton transactions={[{ transaction: this.exitListing }]}>Exit Listing</TransactionButton>;
  }

  private exitListing = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return exitListing(this.props.listingAddress);
  };
}
