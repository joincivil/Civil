import * as React from "react";
import TransactionButton from "../utility/TransactionButton";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { StyledFormContainer, FormGroup, InputElement, InputSelectElement } from "../utility/FormElements";
import { approveForProposeReparameterization, proposeReparameterization } from "../../apis/civilTCR";
import { TwoStepEthTransaction } from "@joincivil/core";
import { BigNumber } from "bignumber.js";

export interface ProposeReparameterizationProps {
  paramKeys: string[];
  pMinDeposit: string;
}

export interface ProposeReparameterizationState {
  paramName: string;
  newValue: string;
}

export class ProposeReparameterization extends React.Component<
  ProposeReparameterizationProps,
  ProposeReparameterizationState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      paramName: "",
      newValue: "",
    };
  }

  public render(): JSX.Element {
    return (
      <ViewModule>
        <ViewModuleHeader>Propose Parameter Update</ViewModuleHeader>
        <StyledFormContainer>
          <FormGroup>
            <label>
              Select Parameter
              <InputSelectElement name="paramName" options={this.props.paramKeys} onChange={this.updateProposalState} />
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              Enter Proposed Value
              <InputElement type="text" name="newValue" onChange={this.updateProposalState} />
            </label>
          </FormGroup>
          <FormGroup>
            CVL token deposit required to submit a proposal: <strong>{this.props.pMinDeposit}</strong>
          </FormGroup>

          <FormGroup>
            <TransactionButton
              transactions={[
                { transaction: approveForProposeReparameterization },
                { transaction: this.proposeReparameterization },
              ]}
            >
              Submit Proposal
            </TransactionButton>
          </FormGroup>
        </StyledFormContainer>
      </ViewModule>
    );
  }

  private updateProposalState = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
  };

  // @TODO(jon): This would probably be a nice place for a confirm dialog
  private proposeReparameterization = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const newValue: BigNumber = new BigNumber(this.state.newValue);
    return proposeReparameterization(this.state.paramName, newValue);
  };
}
