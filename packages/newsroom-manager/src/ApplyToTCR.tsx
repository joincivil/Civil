import * as React from "react";
import { StepHeader, StepFormSection, TransactionButton } from "@joincivil/components";
import styled from "styled-components";
import { EthAddress } from "@joincivil/core";
import { connect } from "react-redux";
import { CivilContext, CivilContextValue } from "./CivilContext";

export interface ApplyToTCRProps {
  address?: EthAddress;
  newsroom?: any;
}

const FormSectionInner = styled("div")`
  padding: 46px;
  background-color: #fffef6;
  opacity: 0.8;
  margin: 16px -38px;
`;

export class ApplyToTCRComponent extends React.Component<ApplyToTCRProps> {
  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Apply to the Civil Registry</StepHeader>
        <StepFormSection>
          <FormSectionInner>
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
          </FormSectionInner>
        </StepFormSection>
      </>
    );
  }
}

const mapStateToProps = (state: any, ownProps: ApplyToTCRProps): ApplyToTCRProps => {
  const newsroom = state.newsrooms.get(ownProps.address);

  return {
    ...ownProps,
    newsroom: newsroom ? newsroom.newsroom : null,
  };
};

export const ApplyToTCR = connect(mapStateToProps)(ApplyToTCRComponent);
