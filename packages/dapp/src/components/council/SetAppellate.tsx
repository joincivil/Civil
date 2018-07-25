import * as React from "react";
import { TransactionButton } from "@joincivil/components";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { StyledFormContainer, FormGroup, InputElement } from "../utility/FormElements";
import { setAppellate } from "../../apis/civilTCR";
import { TwoStepEthTransaction } from "@joincivil/core";

export interface SetAppellateState {
  newValue: string;
}

export class SetAppellate extends React.Component<{}, SetAppellateState> {
  constructor(props: any) {
    super(props);
    this.state = {
      newValue: "",
    };
  }

  public render(): JSX.Element {
    return (
      <ViewModule>
        <ViewModuleHeader>Set Appellate</ViewModuleHeader>
        <StyledFormContainer>
          <FormGroup>
            <label>
              Enter New Appellate Address
              <InputElement type="text" name="newValue" onChange={this.updateAppellateValue} />
            </label>
          </FormGroup>

          <FormGroup>
            <TransactionButton transactions={[{ transaction: this.setAppellate }]}>
              Update Government Parameter
            </TransactionButton>
          </FormGroup>
        </StyledFormContainer>
      </ViewModule>
    );
  }

  private updateAppellateValue = (event: any): void => {
    const val = event.target.value;
    this.setState({ newValue: val });
  };

  // @TODO(jon): This would probably be a nice place for a confirm dialog
  private setAppellate = async (): Promise<TwoStepEthTransaction<any> | void> => {
    console.log("address length: ", this.state.newValue.length);
    if (this.state.newValue.length !== 42) {
      throw new Error("oops. the address was not set correctly.");
    }
    return setAppellate(this.state.newValue);
  };
}
