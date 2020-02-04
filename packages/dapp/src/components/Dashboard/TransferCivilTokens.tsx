import * as React from "react";
import { connect } from "react-redux";
import { BigNumber, EthAddress } from "@joincivil/typescript-types";

import {
  StyledDashboardActivityDescription,
  Notice,
  NoticeTypes,
  DashboardTransferTokenForm,
  BalanceType,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { State } from "../../redux/reducers";
import { getUnlockedWhitelist } from "../../helpers/tokenController";

import DepositTokens from "./DepositTokens";
import ReclaimTokens from "./ReclaimTokens";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";

export interface TransferCivilTokensProps {
  showNoMobileTransactionsModal(): void;
}

export interface TransferCivilTokensReduxProps {
  userAccount: EthAddress;
  balance: BigNumber;
  votingBalance: BigNumber;
}

interface TransferCivilTokensState {
  isNoMobileTransactionVisible: boolean;
  fromBalanceType: number;
}

class TransferCivilTokens extends React.Component<
  TransferCivilTokensProps & TransferCivilTokensReduxProps,
  TransferCivilTokensState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public state = {
    isNoMobileTransactionVisible: false,
    fromBalanceType: 0,
  };

  public render(): JSX.Element {
    const balance = getFormattedTokenBalance(this.props.balance);
    const votingBalance = getFormattedTokenBalance(this.props.votingBalance);
    const isUnlockedWhitelist = getUnlockedWhitelist(this.context, this.props.userAccount);

    return (
      <>
        {!isUnlockedWhitelist && this.renderTransferTokensMsg()}

        <DashboardTransferTokenForm
          renderTransferBalance={this.renderTransferBalance}
          cvlAvailableBalance={balance}
          cvlVotingBalance={votingBalance}
        >
          {this.state.fromBalanceType === BalanceType.AVAILABLE_BALANCE ? (
            <DepositTokens />
          ) : (
            <ReclaimTokens onMobileTransactionClick={this.props.showNoMobileTransactionsModal} />
          )}
        </DashboardTransferTokenForm>
      </>
    );
  }

  private renderTransferTokensMsg(): JSX.Element {
    return (
      <StyledDashboardActivityDescription noBorder={true}>
        <Notice type={NoticeTypes.ERROR}>
          Unlock your account by transfering at least 50% of your <b>available tokens</b> into your{" "}
          <b>voting balance</b>. Unlocking your account allow you to sell Civil tokens.
        </Notice>
      </StyledDashboardActivityDescription>
    );
  }

  private renderTransferBalance = (value: number) => {
    this.setState({ fromBalanceType: value });
  };
}

const mapStateToProps = (
  state: State,
  ownProps: TransferCivilTokensProps,
): TransferCivilTokensProps & TransferCivilTokensReduxProps => {
  const { user } = state.networkDependent;
  let balance = new BigNumber(0);
  if (user.account && user.account.balance) {
    balance = user.account.balance;
  }
  let votingBalance = new BigNumber(0);
  if (user.account && user.account.votingBalance) {
    votingBalance = user.account.votingBalance;
  }

  return {
    userAccount: user.account.account,
    balance,
    votingBalance,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(TransferCivilTokens);
