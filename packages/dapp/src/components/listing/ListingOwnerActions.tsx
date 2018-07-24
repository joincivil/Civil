import * as React from "react";
import BigNumber from "bignumber.js";
import { EthAddress, ListingWrapper, TwoStepEthTransaction } from "@joincivil/core";
import { buttonSizes, TransactionButton, InputGroup } from "@joincivil/components";
import { approve, depositTokens, exitListing, withdrawTokens } from "../../apis/civilTCR";
import { StyledFormContainer, FormGroup } from "../utility/FormElements";
import { ViewModuleHeader } from "../utility/ViewModules";

export interface ListingOwnerActionsProps {
  listing: ListingWrapper;
}

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

class DepositTokens extends React.Component<OwnerListingViewProps, DepositTokensState> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <>
        <ViewModuleHeader>Deposit Additional Tokens</ViewModuleHeader>
        <FormGroup>
          <InputGroup
            name="numTokens"
            prepend="CVL"
            label="Amount of tokens to Deposit"
            onChange={this.updateViewState}
          />
        </FormGroup>

        <FormGroup>
          <TransactionButton
            size={buttonSizes.SMALL}
            transactions={[{ transaction: this.approveDeposit }, { transaction: this.deposit }]}
          >
            Deposit
          </TransactionButton>
        </FormGroup>
      </>
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

class WithdrawTokens extends React.Component<OwnerListingViewProps, WithdrawTokensState> {
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
          <InputGroup
            name="numTokens"
            prepend="CVL"
            label="Amount of tokens to withdraw"
            onChange={this.updateViewState}
          />
        </FormGroup>

        <FormGroup>
          <TransactionButton size={buttonSizes.SMALL} transactions={[{ transaction: this.withdraw }]}>
            Withdraw
          </TransactionButton>
        </FormGroup>
      </StyledFormContainer>
    );
  }

  // @TODO(jon): Add this validation check back in
  // {!this.state.isWithdrawalAmountValid && (
  //   <FormValidationMessage children="Please enter a valid withdrawal amount" />
  // )}
  // private validateWithdrawalAmount = (event: any): void => {
  //   const val: number = parseInt(event.target.value, 10);
  //   const isWithdrawalAmountValid: boolean =
  //     !!Number.isInteger(val) && val > 0 && val <= this.props.listing.data.unstakedDeposit.toNumber();
  //   this.setState({ isWithdrawalAmountValid });
  // };

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

class ExitListing extends React.Component<OwnerListingViewProps> {
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

export default class ListingOwnerActions extends React.Component<ListingOwnerActionsProps> {
  public render(): JSX.Element {
    const canExitListing = this.props.listing.data.isWhitelisted && !this.props.listing.data.challenge;
    return (
      <>
        <ViewModuleHeader>Owner Actions</ViewModuleHeader>
        <p>As an Owner of this listing, you can manage your balance and listing here</p>
        <DepositTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
        <WithdrawTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
        {canExitListing && <ExitListing listingAddress={this.props.listing.address} listing={this.props.listing} />}
      </>
    );
  }
}
