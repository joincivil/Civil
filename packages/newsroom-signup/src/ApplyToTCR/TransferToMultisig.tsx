import * as React from "react";
import { compose } from "redux";
import { BigNumber } from "bignumber.js";
import { EthAddress, TxHash } from "@joincivil/core";
import {
  OBCollapsable,
  OBCollapsableHeader,
  OBSmallParagraph,
  TransactionButtonNoModal,
  CurrencyConvertedBox as CurrencyBox,
  CurrencyCode,
  ModalContent,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { CivilContext, CivilContextValue } from "../CivilContext";
import {
  FormRowLeftAlign,
  FormRowItem,
  TransactionPopUpWarning,
  TransferTextLarge,
  CivilLabel,
} from "../styledComponents";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../TransactionStatusModalsHOC";
import { TransactionButtonInner } from "../TransactionButtonInner";

enum TransactionTypes {
  TRANSFER_TO_MULTISIG = "TRANSFER_TO_MULTISIG",
}

const transactionLabels = {
  [TransactionTypes.TRANSFER_TO_MULTISIG]: "Transfer Tokens",
};

const transactionSuccessContent = {
  [TransactionTypes.TRANSFER_TO_MULTISIG]: [
    "Your tokens have been transferred to the Newsroom's wallet",
    <ModalContent>You may now apply to the registry</ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.TRANSFER_TO_MULTISIG]: [
    "Your tokens were not transferred",
    "To transfer your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.TRANSFER_TO_MULTISIG]: [
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

export interface TransferToMultisigProps {
  minDeposit: BigNumber;
  userBalance: BigNumber;
  multisigBalance: BigNumber;
  multisigAddress: EthAddress;
}

export interface TransferPostTransactionProp {
  postTransfer(): void | Promise<void>;
}

export interface TransactionsProp {
  transactions: any;
}

const TransferToMultisigComponent: React.SFC<
  TransferToMultisigProps & TransferPostTransactionProp & TransactionsProp
> = props => {
  const transformFormLeftColWidth = "126px";
  const { minDeposit, userBalance, multisigBalance, transactions } = props;
  const tokenAmountToTransfer = minDeposit.minus(multisigBalance);

  return (
    <OBCollapsable
      open={true}
      header={
        <OBCollapsableHeader>
          Transfer {getFormattedTokenBalance(minDeposit!)} tokens (CVL) from your Wallet to your Newsroom’s Wallet to
          deposit with your application.
        </OBCollapsableHeader>
      }
    >
      <OBSmallParagraph>
        You need to transfer your Civil tokens to the Newsroom when you are applying on behalf of the newsroom. This
        transaction moves your CVL tokens to the Newsroom’s Public wallet address.
      </OBSmallParagraph>

      <FormRowLeftAlign>
        <FormRowItem width={transformFormLeftColWidth}>From</FormRowItem>
        <FormRowItem>
          <TransferTextLarge>Your Wallet</TransferTextLarge>
          {getFormattedTokenBalance(userBalance, true)}
          <CivilLabel>CVL</CivilLabel>
          <br />
        </FormRowItem>
      </FormRowLeftAlign>
      <FormRowLeftAlign>
        <FormRowItem width={transformFormLeftColWidth}>To</FormRowItem>
        <FormRowItem>
          <TransferTextLarge>Newsroom Wallet</TransferTextLarge>
          {getFormattedTokenBalance(multisigBalance!, true)}
          <CivilLabel>CVL</CivilLabel>
        </FormRowItem>
      </FormRowLeftAlign>
      <FormRowLeftAlign>
        <FormRowItem width={transformFormLeftColWidth}>Amount</FormRowItem>
        <FormRowItem>
          <CurrencyBox>
            {getFormattedTokenBalance(tokenAmountToTransfer, true)}
            <CurrencyCode>CVL</CurrencyCode>
          </CurrencyBox>
        </FormRowItem>
      </FormRowLeftAlign>

      <FormRowLeftAlign>
        <FormRowItem width={transformFormLeftColWidth} />
        <FormRowItem>
          <TransactionButtonNoModal Button={TransactionButtonInner} transactions={transactions}>
            Transfer CVL Tokens
          </TransactionButtonNoModal>
          <TransactionPopUpWarning>
            This will open your wallet asking to process the transactions.
          </TransactionPopUpWarning>
        </FormRowItem>
      </FormRowLeftAlign>
    </OBCollapsable>
  );
};

const TransferToMultisig: React.SFC<
  TransferToMultisigProps & TransferPostTransactionProp & InjectedTransactionStatusModalProps
> = props => {
  return (
    <CivilContext.Consumer>
      {(value: CivilContextValue) => {
        const { multisigAddress, minDeposit, multisigBalance, postTransfer } = props;
        const tokenAmountToTransfer = minDeposit.minus(multisigBalance);
        const transactions = [
          {
            transaction: async () => {
              props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                isTransactionErrorModalOpen: false,
                isTransactionRejectionModalOpen: false,
                transactionType: TransactionTypes.TRANSFER_TO_MULTISIG,
              });
              const tcr = await value.civil!.tcrSingletonTrusted();
              const token = await tcr.getToken();
              return token.transfer(multisigAddress, value.civil!.toBigNumber(tokenAmountToTransfer));
            },
            handleTransactionHash: (txHash: TxHash) => {
              props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
              });
            },
            handleTransactionError: props.handleTransactionError,
            postTransaction: postTransfer,
          },
        ];
        return <TransferToMultisigComponent {...props} transactions={transactions} />;
      }}
    </CivilContext.Consumer>
  );
};

export default compose<React.ComponentClass<TransferToMultisigProps & TransferPostTransactionProp>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(TransferToMultisig);
