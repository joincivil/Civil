import * as React from "react";
import styled from "styled-components";
import {
  OBCollapsable,
  OBSectionHeader,
  OBSectionDescription,
  CREATE_NEWSROOM_CHANNEL_MUTATION,
  NRSIGNUP_DELETE,
} from "@joincivil/components";
import { Mutation, MutationFunc } from "react-apollo";
import { saveApplyTxMutation } from "../mutations";
import { getCharterQuery } from "../queries";
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
        <Mutation
          mutation={saveApplyTxMutation}
          refetchQueries={[
            {
              query: getCharterQuery,
            },
          ]}
        >
          {(saveTxHash: MutationFunc) => {
            return (
              <Mutation mutation={CREATE_NEWSROOM_CHANNEL_MUTATION}>
                {(createChannel: MutationFunc) => {
                  return (
                    <Mutation mutation={NRSIGNUP_DELETE}>
                      {(deleteNrsignup: MutationFunc) => {
                        return (
                          <ApplyToTCRForm
                            newsroomAddress={address!}
                            minDeposit={minDeposit}
                            multisigAddress={multisigAddress!}
                            multisigHasMinDeposit={multisigHasMinDeposit}
                            postApplyToTCR={async () => {
                              this.setState({ didApplicationSucceed: true });
                              await createChannel({
                                variables: { newsroomContractAddress: address! },
                              });
                              await deleteNrsignup();
                              postApplyToTCR();
                            }}
                            saveTxHash={async txHash => {
                              const saveTxResult = await saveTxHash({ variables: { input: txHash } });
                            }}
                          />
                        );
                      }}
                    </Mutation>
                  );
                }}
              </Mutation>
            );
          }}
        </Mutation>
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
