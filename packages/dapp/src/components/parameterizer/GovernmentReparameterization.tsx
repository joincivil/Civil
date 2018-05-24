import * as React from "react";
import TransactionButton from "../utility/TransactionButton";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { StyledFormContainer, FormGroup, InputElement, InputSelectElement } from "../utility/FormElements";
import { updateGovernmentParameter } from "../../apis/civilTCR";
import { TwoStepEthTransaction } from "@joincivil/core";
import { BigNumber } from "bignumber.js";

export interface GovernmentReparameterizationProps {
  paramKeys: string[];
}

export interface GovernmentReparameterizationState {
  paramName: string;
  newValue: string;
}

export class GovernmentReparameterization extends React.Component<
  GovernmentReparameterizationProps,
  GovernmentReparameterizationState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      paramName: this.props.paramKeys[0],
      newValue: "",
    };
  }

  public render(): JSX.Element {
    return (
      <ViewModule>
        <ViewModuleHeader>Change Government Parameter</ViewModuleHeader>
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
            <TransactionButton transactions={[{ transaction: this.updateGovernmentParameter }]}>
              Submit Proposal
            </TransactionButton>
          </FormGroup>
        </StyledFormContainer>
      </ViewModule>
    );
  }

  public componentWillReceiveProps(nextProps: GovernmentReparameterizationProps): void {
    // Ensure that the initial `paramName` is set in state
    // @TODO(jon): This may need to be changed to `getDerivedStateFromProps()` if we upgrade to React 17
    // @TODO(jon): We might want to prepend the `paramKeys` select element with a placeholder option (ie: Please Select a Parameter) and add some form validation for `paramName` and `propValue`
    if (!this.props.paramKeys || (!this.props.paramKeys.length && nextProps.paramKeys && nextProps.paramKeys.length)) {
      this.setState({ paramName: nextProps.paramKeys[0] });
    }
  }

  private updateProposalState = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
  };

  // @TODO(jon): This would probably be a nice place for a confirm dialog
  private updateGovernmentParameter = async (): Promise<TwoStepEthTransaction<any> | void> => {
    if (!this.state.paramName || !this.state.newValue.length) {
      throw new Error("oops. the proposal is missing some key args.");
    }
    const newValue: BigNumber = new BigNumber(this.state.newValue);
    return updateGovernmentParameter(this.state.paramName, newValue);
  };
}
