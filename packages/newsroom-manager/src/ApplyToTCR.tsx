import * as React from "react";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { StepHeader, StepFormSection, StepDescription, TransactionButton } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import { connect } from "react-redux";

export interface ApplyToTCRProps {
  address?: EthAddress;
  newsroom?: any;
}

export class ApplyToTCRComponent extends React.Component<ApplyToTCRProps> {
  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Apply to the Civil Registry (Coming Soon!)</StepHeader>
        <StepDescription>
          Submit your application to the token-curated registry (TCR) and view your status.
        </StepDescription>
        <StepFormSection>
          <CivilContext.Consumer>
            {(value: CivilContextValue) => {
              return (
                <>
                  <TransactionButton
                    transactions={[
                      {
                        transaction: async () => {
                          const multisigAddr = await this.props.newsroom.getMultisigAddress();
                          const tcr = await value.civil!.tcrSingletonTrusted();
                          const parameterizer = await tcr.getParameterizer();
                          const minDeposit = await parameterizer.getParameterValue("minDeposit");
                          const token = await tcr.getToken();
                          return token.transfer(multisigAddr, minDeposit.mul(2));
                        },
                      },
                    ]}
                  >
                    Send CVL to Multisig
                  </TransactionButton>
                  <TransactionButton
                    transactions={[
                      {
                        transaction: async () => {
                          const multisigAddr = await this.props.newsroom.getMultisigAddress();
                          const tcr = await value.civil!.tcrSingletonTrustedMultisigSupport(multisigAddr);
                          const parameterizer = await tcr.getParameterizer();
                          const minDeposit = await parameterizer.getParameterValue("minDeposit");
                          const token = await tcr.getToken();
                          const approvedTokens = await token.getApprovedTokensForSpender(tcr.address, multisigAddr);
                          if (approvedTokens.lessThan(minDeposit)) {
                            return token.approveSpender(tcr.address, minDeposit);
                          }
                          return;
                        },
                      },
                      {
                        transaction: async () => {
                          const multisigAddr = await this.props.newsroom.getMultisigAddress();
                          const tcr = await value.civil!.tcrSingletonTrustedMultisigSupport(multisigAddr);
                          const parameterizer = await tcr.getParameterizer();
                          const deposit = await parameterizer.getParameterValue("minDeposit");
                          return tcr.apply(this.props.address!, deposit, "");
                        },
                      },
                    ]}
                  >
                    Apply to TCR
                  </TransactionButton>
                </>
              );
            }}
          </CivilContext.Consumer>
        </StepFormSection>
      </>
    );
  }
}

const mapStateToProps = (state: any, ownProps: ApplyToTCRProps): ApplyToTCRProps => {
  const newsroom = state.newsrooms.get(ownProps.address);

  return {
    ...ownProps,
    newsroom: newsroom.newsroom,
  };
};

export const ApplyToTCR = connect(mapStateToProps)(ApplyToTCRComponent);
