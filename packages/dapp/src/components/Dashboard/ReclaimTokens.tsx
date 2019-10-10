import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { parseEther } from "@joincivil/typescript-types";
import { Set } from "immutable";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  StyledDashboardActivityDescription,
  TransactionButtonNoModal,
  CurrencyInput,
  ModalContent,
  TransferTokenTipsText,
  StyledTransferTokenFormElement,
} from "@joincivil/components";
import { State } from "../../redux/reducers";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { getUserChallengesWithRescueTokens } from "../../selectors";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { FormGroup } from "../utility/FormElements";

enum TransactionTypes {
  WITHDRAW_VOTING_RIGHTS = "WITHDRAW_VOTING_RIGHTS",
}

const transactionLabels = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: "Transfer Voting Tokens to Available Balance",
};

const transactionSuccessContent = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: [
    "You have successfully transferred your voting tokens",
    <ModalContent>
      Tokens in your Available Balance can be used for applying to The Civil Registry or challenging newsrooms
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: [
    "Your tokens were not transferred",
    "To transfer your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: [
    "There was a problem with transferring your tokens",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

export interface ReclaimTokenProps {
  onMobileTransactionClick?(): any;
}

export interface ReclaimTokenReduxProps {
  numUserChallengesWithRescueTokens: number;
}

interface ReclaimTokensState {
  numTokens?: string;
  isReclaimAmountValid?: boolean;
}

class ReclaimTokensComponent extends React.Component<
  ReclaimTokenProps & ReclaimTokenReduxProps & InjectedTransactionStatusModalProps,
  ReclaimTokensState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  constructor(props: ReclaimTokenReduxProps & InjectedTransactionStatusModalProps) {
    super(props);
    this.state = {
      numTokens: "0",
      isReclaimAmountValid: true,
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public render(): JSX.Element {
    return (
      <>
        {!!this.props.numUserChallengesWithRescueTokens && (
          <StyledDashboardActivityDescription>
            "Please rescue tokens from all of your unrevealed votes before transferring"
          </StyledDashboardActivityDescription>
        )}
        <>
          <StyledTransferTokenFormElement>
            <CurrencyInput
              label="Enter amount"
              placeholder="0"
              name="numTokens"
              icon={<>CVL</>}
              onChange={this.updateViewState}
            />
            <TransferTokenTipsText />
          </StyledTransferTokenFormElement>

          <FormGroup>
            <TransactionButtonNoModal
              disabled={!!this.props.numUserChallengesWithRescueTokens}
              transactions={this.getTransactions()}
            >
              Transfer
            </TransactionButtonNoModal>
          </FormGroup>
        </>
      </>
    );
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.WITHDRAW_VOTING_RIGHTS,
          });
          return this.withdrawVotingRights();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private withdrawVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens = parseEther(this.state.numTokens!);
    return this.context.withdrawVotingRights(numTokens);
  };

  private updateViewState = (name: string, value: string): void => {
    this.setState(() => ({ [name]: value }));
  };
}

const mapStateToProps = (state: State): ReclaimTokenReduxProps => {
  const userChallengesWithRescueTokens: Set<string> = getUserChallengesWithRescueTokens(state)!;

  return {
    numUserChallengesWithRescueTokens: userChallengesWithRescueTokens.count(),
  };
};

export default compose(
  connect(mapStateToProps),
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ReclaimTokensComponent) as React.ComponentClass<ReclaimTokenProps>;
