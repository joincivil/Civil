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
export interface TransactionButtonProps {
  firstTransaction(): Promise<TwoStepEthTransaction<any> | void>;
  postFirstTransaction?(result: any): any;
  secondTransaction?(): Promise<TwoStepEthTransaction<any>>;
  postSecondTransaction?(result: any): any;
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
    this.setState({ step: 1, disableButton: true });
    const transaction = await this.props.firstTransaction();
    this.setState({ step: 2 });
    if (transaction) {
      const receipt = await transaction.awaitReceipt();
      if (this.props.postFirstTransaction) {
        this.props.postFirstTransaction(receipt);
      }
    }

    if (this.props.secondTransaction) {
      this.setState({ step: 1, disableButton: true });
      const transaction2 = await this.props.secondTransaction();
      this.setState({ step: 2 });
      const receipt2 = await transaction2.awaitReceipt();
      if (this.props.postSecondTransaction) {
        this.props.postSecondTransaction(receipt2);
      }
    }

    this.setState({ step: 0, disableButton: false });
  };
}

export default TransactionButton;
