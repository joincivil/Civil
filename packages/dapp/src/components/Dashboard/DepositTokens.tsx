import * as React from "react";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { TwoStepEthTransaction } from "@joincivil/core";
import { StyledDashboardActivityDescription, TransactionButton, InputGroup } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { requestVotingRights } from "../../apis/civilTCR";
import { FormGroup } from "../utility/FormElements";

const StyledContainer = styled.div`
  padding: 0 24px;
`;

export interface DepositTokenReduxProps {
  balance: BigNumber;
}

export interface DepositTokensState {
  numTokens?: string;
}

class DepositTokensComponent extends React.Component<DepositTokenReduxProps, DepositTokensState> {
  constructor(props: any) {
    super(props);
    this.state = {
      numTokens: "0",
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledDashboardActivityDescription>
          <p>Transfer your available balance tokens to your voting balance</p>
        </StyledDashboardActivityDescription>
        <StyledContainer>
          <p>Available Tokens: {getFormattedTokenBalance(this.props.balance)}</p>
          <FormGroup>
            <InputGroup
              name="numTokens"
              prepend="CVL"
              label="Amount of tokens to transfer"
              onChange={this.updateViewState}
            />
          </FormGroup>

          <FormGroup>
            <TransactionButton transactions={[{ transaction: this.depositTokens }]}>Transfer</TransactionButton>
          </FormGroup>
        </StyledContainer>
      </>
    );
  }

  private depositTokens = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return requestVotingRights(numTokens);
  };

  private updateViewState = (name: string, value: string): void => {
    this.setState(() => ({ [name]: value }));
  };
}

const mapStateToProps = (state: State): DepositTokenReduxProps => {
  const { user } = state.networkDependent;
  let balance = new BigNumber(0);
  if (user.account && user.account.balance) {
    balance = user.account.balance;
  }

  return {
    balance,
  };
};

export default connect(mapStateToProps)(DepositTokensComponent);
