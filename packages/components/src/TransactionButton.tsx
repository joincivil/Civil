import * as React from "react";
import styled from "styled-components";
import { TwoStepEthTransaction } from "@joincivil/core";
import { Button, buttonSizes } from "./Button";

export interface TransactionButtonState {
  name: string;
  error: string;
  step: number;
  disableButton: boolean;
}

export interface Transaction {
  transaction(): Promise<TwoStepEthTransaction<any> | void>;
  preTransaction?(): any;
  postTransaction?(result: any): any;
}

export interface TransactionButtonProps {
  transactions: Transaction[];
  disabled?: boolean;
  size?: buttonSizes;
  preExecuteTransactions?(): any;
  postExecuteTransactions?(): any;
}

export class TransactionButton extends React.Component<TransactionButtonProps, TransactionButtonState> {
  constructor(props: TransactionButtonProps) {
    super(props);
    this.state = {
      name: "",
      error: "",
      step: 0,
      disableButton: !!props.disabled,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        {this.state.error}
        <Button onClick={this.onClick} disabled={this.state.disableButton} size={this.props.size || buttonSizes.MEDIUM}>
          {this.state.step === 1 && "Waiting for Transaction..."}
          {this.state.step === 2 && "Transaction Processing..."}
          {this.state.step === 0 && this.props.children}
        </Button>
      </>
    );
  }

  private onClick = async () => {
    if (this.props.preExecuteTransactions) {
      setImmediate(() => this.props.preExecuteTransactions!());
    }
    return this.executeTransactions(this.props.transactions.slice().reverse());
  };

  private executeTransactions = async (transactions: Transaction[]): Promise<any> => {
    const currTransaction = transactions.pop();
    if (currTransaction) {
      if (currTransaction.preTransaction) {
        setImmediate(() => currTransaction.preTransaction!());
      }
      this.setState({ step: 1, disableButton: true });
      const pending = await currTransaction.transaction();
      this.setState({ step: 2 });
      if (pending) {
        const receipt = await pending.awaitReceipt();
        if (!transactions.length) {
          console.log("set it back to 0");
          this.setState({ step: 0, disableButton: false });
        }
        if (currTransaction.postTransaction) {
          setImmediate(() => currTransaction.postTransaction!(receipt));
        }
      }
      return this.executeTransactions(transactions);
    } else if (this.props.postExecuteTransactions) {
      setImmediate(() => this.props.postExecuteTransactions!());
    }
  };
}
