import * as React from "react";
import styled from "styled-components";
import { TwoStepEthTransaction } from "@joincivil/core";

// TODO(nickreynolds): get colors from constants file
const Button = styled.button`
  background-color: #2b56ff;
  font-family: "Libre Franklin", sans-serif;
  font-weight: 700;
  color: #ffffff;
  border: none;
  font-size: 18px;
  text-align: center;
  &.active {
    color: #30e8bd;
  }
  &.disabled {
    background-color: #c4c2c0;
  }
`;

export interface TransactionButtonState {
  name: string;
  error: string;
  step: number;
  disableButton: boolean;
}

export interface Transaction {
  transaction(): Promise<TwoStepEthTransaction<any> | void>;
  postTransaction?(result: any): any;
}

export interface TransactionButtonProps {
  transactions: Transaction[];
}

class TransactionButton extends React.Component<TransactionButtonProps, TransactionButtonState> {
  constructor(props: TransactionButtonProps) {
    super(props);
    this.state = {
      name: "",
      error: "",
      step: 0,
      disableButton: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        {this.state.error}
        <Button onClick={this.onClick} disabled={this.state.disableButton}>
          {this.state.step === 1 && "Waiting for Transaction..."}
          {this.state.step === 2 && "Transaction Processing..."}
          {this.state.step === 0 && this.props.children}
        </Button>
      </>
    );
  }

  private onClick = async () => {
    return this.executeTransactions(this.props.transactions.slice().reverse());
  };

  private executeTransactions = async (transactions: Transaction[]): Promise<any> => {
    const currTransaction = transactions.pop();
    if (currTransaction) {
      this.setState({ step: 1, disableButton: true });
      const pending = await currTransaction.transaction();
      this.setState({ step: 2 });
      if (pending) {
        const receipt = await pending.awaitReceipt();
        if (!transactions.length) {
          this.setState({ step: 0, disableButton: false });
        }
        if (currTransaction.postTransaction) {
          setImmediate(() => currTransaction.postTransaction!(receipt));
        }
      }
      return this.executeTransactions(transactions);
    }
  };
}

export default TransactionButton;
