import * as React from "react";
import { compose } from "redux";
import { EthAddress, TxHash, BigNumber } from "@joincivil/typescript-types";
import {
  OBCollapsable,
  OBCollapsableHeader,
  OBSmallParagraph,
  TransactionButtonNoModal,
  CurrencyConvertedBox as CurrencyBox,
  CurrencyCode,
  ModalContent,
  CivilContext,
  ICivilContext,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

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

const TransferToMultisig: React.FunctionComponent<
  TransferToMultisigProps & TransferPostTransactionProp & InjectedTransactionStatusModalProps
> = props => {
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const { multisigAddress, minDeposit, multisigBalance, postTransfer, userBalance } = props;
  const tokenAmountToTransfer = minDeposit.sub(multisigBalance);
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
        const tcr = await civilCtx.civil!.tcrSingletonTrusted();
        const token = await tcr.getToken();
        return token.transfer(multisigAddress, civilCtx.civil!.toBigNumber(tokenAmountToTransfer));
      },
      handleTransactionHash: (txHash: TxHash) => {
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
        postTransfer();
      },
    },
  ];
  const transformFormLeftColWidth = "126px";

  return (
    <OBCollapsable
      open={true}
      header={
        <OBCollapsableHeader>
          Transfer {getFormattedTokenBalance(minDeposit!)} from your wallet to your Newsroom’s wallet to deposit with
          your application.
        </OBCollapsableHeader>
      }
    >
      <OBSmallParagraph>
        You need to transfer your Civil tokens (CVL) to your Newsroom when you are applying on behalf of your newsroom.
        This transaction moves your CVL to your Newsroom’s wallet.
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

export default compose<React.ComponentClass<TransferToMultisigProps & TransferPostTransactionProp>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(TransferToMultisig);
