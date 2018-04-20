import * as React from "react";
import styled from "styled-components";

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
  disableButton: boolean;
}
export interface TransactionButtonProps {
  transaction(): any;
}

class TransactionButton extends React.Component<TransactionButtonProps, TransactionButtonState> {
  constructor(props: TransactionButtonProps) {
    super(props);
    this.state = {
      name: "",
      error: "",
      disableButton: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        {this.state.error}
        <Button onClick={this.onClick} disabled={this.state.disableButton}>
          {this.state.disableButton && "Transaction Processing..."}
          {!this.state.disableButton && this.props.children}
        </Button>
      </>
    );
  }

  private onClick = async () => {
    this.setState({ disableButton: true });
    await this.props.transaction();
    this.setState({ disableButton: false });
  };
}

export default TransactionButton;
