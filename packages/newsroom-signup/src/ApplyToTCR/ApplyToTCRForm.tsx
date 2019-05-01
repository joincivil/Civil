import * as React from "react";
import { compose } from "redux";
import { BigNumber } from "bignumber.js";
import { EthAddress, TxHash } from "@joincivil/core";
import { getFormattedTokenBalance, urlConstants as links } from "@joincivil/utils";
import { QuestionToolTip, OBSmallParagraph, TransactionButtonNoModal, ModalContent } from "@joincivil/components";
import { MutationFunc } from "react-apollo";
import { CivilContext, CivilContextValue } from "../CivilContext";
import {
  FormSection,
  FormRow,
  FormRowItem,
  FormTitle,
  TransactionPopUpWarning,
  DepositAmountText,
  CivilLabel,
} from "../styledComponents";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../TransactionStatusModalsHOC";
import { TransactionButtonInner } from "../TransactionButtonInner";

enum TransactionTypes {
  APPROVE_FOR_APPLY = "APPROVE_FOR_APPLY",
  APPLY_TO_REGISTRY = "APPLY_TO_REGISTRY",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_FOR_APPLY]: "Approve Tokens for Application Deposit ",
  [TransactionTypes.APPLY_TO_REGISTRY]: "Apply To Registry",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_FOR_APPLY]: "1 of 2",
  [TransactionTypes.APPLY_TO_REGISTRY]: "2 of 2",
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_FOR_APPLY]: [
    "Your application was not submitted",
    "Before submitting an application, you need to confirm the approval of your application deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.APPLY_TO_REGISTRY]: [
    "Your application was not submitted",
    "To submit an application, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_FOR_APPLY]: [
    "There was an problem with approving your application deposit",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
  [TransactionTypes.APPLY_TO_REGISTRY]: [
    "The was an problem with submitting your application",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionSuccessContent = {
  [TransactionTypes.APPROVE_FOR_APPLY]: [
    "Transaction Successful",
    <ModalContent>You have approved the token deposit for your application.</ModalContent>,
  ],
  [TransactionTypes.APPLY_TO_REGISTRY]: [
    "Transaction Successful",
    <ModalContent>Your application to the registry has been recorded!</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionRejectionContent,
  transactionErrorContent,
  transactionSuccessContent,
};

export interface ApplyToTCRFormProps {
  minDeposit: BigNumber;
  newsroomAddress: EthAddress;
  multisigAddress: EthAddress;
  multisigHasMinDeposit: boolean;
  saveTxHash: MutationFunc;
}

export interface ApplyPostTransactionProp {
  postApplyToTCR(): void | Promise<void>;
}

export interface TransactionsProp {
  transactions: any;
}

const ApplyToTCRFormComponent: React.FunctionComponent<
  ApplyToTCRFormProps & ApplyPostTransactionProp & TransactionsProp & InjectedTransactionStatusModalProps
> = props => {
  const { minDeposit, multisigHasMinDeposit, transactions } = props;

  return (
    <FormSection>
      <FormRow>
        <FormRowItem>
          <FormTitle>
            Newsroom Token Stake{" "}
            <QuestionToolTip explainerText="The deposit is subject to change. You wil be notified when changes occur." />
          </FormTitle>
        </FormRowItem>

        <FormRowItem align="right">
          <DepositAmountText>{getFormattedTokenBalance(minDeposit!, true)}</DepositAmountText>{" "}
          <CivilLabel>CVL</CivilLabel>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <OBSmallParagraph>
            By applying to the Civil Registry, you acknowledge that you have agreed to the{" "}
            <a href={links.TERMS} target="_blank">
              Terms
            </a>{" "}
            and{" "}
            <a href={links.PRIVACY_POLICY} target="_blank">
              Privacy Policy
            </a>
          </OBSmallParagraph>
        </FormRowItem>
        <FormRowItem align="right">
          <TransactionButtonNoModal
            disabled={!multisigHasMinDeposit}
            Button={TransactionButtonInner}
            transactions={transactions}
          >
            Apply to the Civil Registry
          </TransactionButtonNoModal>
          <TransactionPopUpWarning>
            This will open your wallet asking to process the transactions.
          </TransactionPopUpWarning>
        </FormRowItem>
      </FormRow>
    </FormSection>
  );
};

const ApplyToTCRForm: React.FunctionComponent<
  ApplyToTCRFormProps & ApplyPostTransactionProp & InjectedTransactionStatusModalProps
> = props => {
  const { newsroomAddress, minDeposit, multisigAddress, postApplyToTCR } = props;

  return (
    <CivilContext.Consumer>
      {(value: CivilContextValue) => {
        const transactions = [
          {
            transaction: async () => {
              props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                isTransactionErrorModalOpen: false,
                isTransactionRejectionModalOpen: false,
                transactionType: TransactionTypes.APPROVE_FOR_APPLY,
              });
              const tcr = await value.civil!.tcrSingletonTrustedMultisigSupport(multisigAddress);
              const token = await tcr.getToken();
              const approvedTokens = await token.getApprovedTokensForSpender(tcr.address, multisigAddress);
              if (approvedTokens.lessThan(minDeposit!)) {
                return token.approveSpender(tcr.address, value.civil!.toBigNumber(minDeposit!));
              }
              return;
            },
            handleTransactionHash: (txHash: TxHash) => {
              props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: true,
              });
            },
            handleTransactionError: props.handleTransactionError,
          },
          {
            transaction: async () => {
              props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                transactionType: TransactionTypes.APPLY_TO_REGISTRY,
              });
              const tcr = await value.civil!.tcrSingletonTrustedMultisigSupport(multisigAddress);
              return tcr.apply(newsroomAddress!, value.civil!.toBigNumber(minDeposit), "");
            },
            handleTransactionHash: async (txHash: TxHash) => {
              await props.saveTxHash({ variables: { input: txHash } });
              props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: true,
              });
            },
            handleTransactionError: props.handleTransactionError,
            postTransaction: () => {
              props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: true,
              });
              postApplyToTCR();

              // @TODO A hack until https://github.com/joincivil/Civil/pull/1148
              props.setHandleTransactionSuccessButtonClick(() => {
                document.location.reload();
              });
            },
          },
        ];

        props.setTransactions(transactions);

        return <ApplyToTCRFormComponent {...props} transactions={transactions} />;
      }}
    </CivilContext.Consumer>
  );
};

export default compose<React.ComponentClass<ApplyToTCRFormProps & ApplyPostTransactionProp>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ApplyToTCRForm);
