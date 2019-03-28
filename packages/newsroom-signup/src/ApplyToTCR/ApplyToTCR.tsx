import * as React from "react";
import styled from "styled-components";
import { OBCollapsable, OBSectionHeader, OBSectionDescription } from "@joincivil/components";

import { ApplyToTCRStepOwnProps, ApplyToTCRStepReduxProps } from "./index";
import TransferToMultisig, { TransferPostTransactionProp } from "./TransferToMultisig";
import ApplyToTCRForm, { ApplyPostTransactionProp } from "./ApplyToTCRForm";
import { AboutApplicationButton } from "./AboutApplicationButton";

export type TApplyToTCRProps = ApplyToTCRStepOwnProps &
  ApplyToTCRStepReduxProps &
  TransferPostTransactionProp &
  ApplyPostTransactionProp;

const TransferredCollapsable = styled(OBCollapsable)`
  padding-top: 36px;
  padding-bottom: 36px;
`;

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
        <TransferredCollapsable
          open={false}
          header={<>Civil tokens transferred from your wallet to your Newsroom’s wallet.</>}
        />
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
