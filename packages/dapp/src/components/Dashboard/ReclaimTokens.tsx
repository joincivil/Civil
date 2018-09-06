import * as React from "react";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { Set } from "immutable";
import { TwoStepEthTransaction } from "@joincivil/core";
import { StyledDashboardActivityDescription, TransactionButton, InputGroup } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../reducers";
import { getUserChallengesWithRescueTokens } from "../../selectors";
import { withdrawVotingRights } from "../../apis/civilTCR";
import { FormGroup } from "../utility/FormElements";

const StyledContainer = styled.div`
  padding: 0 24px;
`;

export interface ReclaimTokenReduxProps {
  numUserChallengesWithRescueTokens: number;
  votingBalance: BigNumber;
}

export interface ReclaimTokensState {
  numTokens?: string;
  isReclaimAmountValid?: boolean;
}

class ReclaimTokensComponent extends React.Component<ReclaimTokenReduxProps, ReclaimTokensState> {
  constructor(props: any) {
    super(props);
    this.state = {
      numTokens: "0",
      isReclaimAmountValid: true,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledDashboardActivityDescription>
          <p>Transfer your voting tokens to your available balance</p>

          {!!this.props.numUserChallengesWithRescueTokens &&
            "Please rescue tokens from all of your unrevealed votes before transferring"}
        </StyledDashboardActivityDescription>
        <StyledContainer>
          <p>Voting Tokens: {getFormattedTokenBalance(this.props.votingBalance)}</p>
          <FormGroup>
            <InputGroup
              name="numTokens"
              prepend="CVL"
              label="Amount of tokens to transfer"
              onChange={this.updateViewState}
            />
          </FormGroup>

          <FormGroup>
            <TransactionButton
              disabled={!!this.props.numUserChallengesWithRescueTokens}
              transactions={[{ transaction: this.reclaimTokens }]}
            >
              Transfer
            </TransactionButton>
          </FormGroup>
        </StyledContainer>
      </>
    );
  }

  private reclaimTokens = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return withdrawVotingRights(numTokens);
  };

  private updateViewState = (name: string, value: string): void => {
    this.setState(() => ({ [name]: value }));
  };
}

const mapStateToProps = (state: State): ReclaimTokenReduxProps => {
  const { user } = state.networkDependent;
  const userChallengesWithRescueTokens: Set<string> = getUserChallengesWithRescueTokens(state)!;
  let votingBalance = new BigNumber(0);
  if (user.account && user.account.votingBalance) {
    votingBalance = user.account.votingBalance;
  }

  return {
    numUserChallengesWithRescueTokens: userChallengesWithRescueTokens.count(),
    votingBalance,
  };
};

export default connect(mapStateToProps)(ReclaimTokensComponent);
