import * as React from "react";
import { parseEther, TxHash } from "@joincivil/typescript-types";
import { TwoStepEthTransaction } from "@joincivil/core";
import {
  TransactionButtonNoModal,
  CurrencyInput,
  ModalContent,
  TransferTokenTipsText,
  StyledTransferTokenFormElement,
} from "@joincivil/components";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
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

interface ReclaimTokensState {
  numTokens?: string;
  isReclaimAmountValid?: boolean;
}

class ReclaimTokensComponent extends React.Component<
  ReclaimTokenProps & InjectedTransactionStatusModalProps,
  ReclaimTokensState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  constructor(props: ReclaimTokenProps & InjectedTransactionStatusModalProps) {
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
            <TransactionButtonNoModal transactions={this.getTransactions()}>Transfer</TransactionButtonNoModal>
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

export default hasTransactionStatusModals(transactionStatusModalConfig)(ReclaimTokensComponent) as React.ComponentClass<
  ReclaimTokenProps & InjectedTransactionStatusModalProps
>;
