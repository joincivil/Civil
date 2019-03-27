import * as React from "react";
import { OBCollapsableHeader, OBSectionHeader, OBSectionDescription } from "@joincivil/components";

import { ApplyToTCRStepOwnProps, ApplyToTCRStepReduxProps } from "./index";
import TransferToMultisig, { TransferPostTransactionProp } from "./TransferToMultisig";
import ApplyToTCRForm, { ApplyPostTransactionProp } from "./ApplyToTCRForm";
import { AboutApplicationButton } from "./AboutApplicationButton";

export type TApplyToTCRProps = ApplyToTCRStepOwnProps &
  ApplyToTCRStepReduxProps &
  TransferPostTransactionProp &
  ApplyPostTransactionProp;

class ApplyToTCR extends React.Component<TApplyToTCRProps> {
  public render(): JSX.Element {
    const { address, minDeposit, multisigAddress, multisigHasMinDeposit, postApplyToTCR } = this.props;

    // TODO: This would be a good place for a loading indicator
    if (!minDeposit || !multisigAddress) {
      return <>Loading...</>;
    }

    return (
      <>
        <OBSectionHeader>Apply to the Civil Registry</OBSectionHeader>
        <OBSectionDescription>
          Your application and Civil tokens are ready to be submitted to the Civil Registry. Your Newsroom will be up
          for community review for the next {this.props.applyStageLenDisplay}. You can check back here at any time
          during the process and will also be notified via email.
        </OBSectionDescription>
        <AboutApplicationButton />

        {this.renderTransferSection()}

        <ApplyToTCRForm
          newsroomAddress={address!}
          minDeposit={minDeposit}
          multisigAddress={multisigAddress!}
          multisigHasMinDeposit={multisigHasMinDeposit}
          postApplyToTCR={postApplyToTCR}
        />
      </>
    );
  }

  private renderTransferSection = (): JSX.Element => {
    const {
      minDeposit,
      userBalance,
      multisigBalance,
      multisigHasMinDeposit,
      multisigAddress,
      postTransfer,
    } = this.props;

    if (multisigHasMinDeposit) {
      return (
        <OBCollapsableHeader>
          Civil tokens transfered from your Public Wallet to your Newsroom’s Public Wallet.
        </OBCollapsableHeader>
      );
    }

    return (
      <TransferToMultisig
        minDeposit={minDeposit!}
        multisigAddress={multisigAddress!}
        userBalance={userBalance!}
        multisigBalance={multisigBalance!}
        postTransfer={postTransfer}
      />
    );
  };
}

export default ApplyToTCR;
