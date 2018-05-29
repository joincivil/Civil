import * as React from "react";
import { StepHeader, StepProps, StepStyled, TextInput, DetailTransactionButton, Collapsable } from "@joincivil/components";
import { TwoStepEthTransaction } from "@joincivil/core";
import { getCivil } from "../../helpers/civilInstance";

export interface NameAndAddressState {
  name: string;
}

export class NameAndAddress extends React.Component<StepProps, NameAndAddressState> {
  constructor(props: StepProps) {
    super(props);
    this.state = {
      name: "",
    };
  }
  public onChange(name: string, value: string | void): void {
    this.setState({name: value || ""});
  }
  public render(): JSX.Element {
    console.log(this.props.disabled);
    const civil = getCivil();
    return (<StepStyled index={this.props.index || 0}>
      <Collapsable
        open={true}
        header={<>
          <StepHeader el={this.props.el} isActive={this.props.active === this.props.index}>
            Set up a newsroom
          </StepHeader>
          <p>Enter your newsroom name to create your newsroom smart contract.</p>
        </>}
      >
        <TextInput label="Newsroom Name" placeholder="Enter your newsroom's name" name="NameInput" value={this.state.name} onChange={(name, val) => this.onChange(name, val)} />
        <DetailTransactionButton
          transactions={[{ transaction: this.createNewsroom }]}
          civil={civil}
          estimateFunctions={[civil.estimateNewsroomDeployTrusted.bind(civil, this.state.name)]}
          requiredNetwork="rinkeby"
        >
          Create Newsroom
        </DetailTransactionButton>
      </Collapsable>
    </StepStyled>)
  }
  private createNewsroom = async (): Promise<TwoStepEthTransaction<any>> => {
    const civil = getCivil();
    return civil.newsroomDeployTrusted(this.state.name);
  };

  // private onNewsroomCreated = (result: any) => {
  //   const address = result.address;
  //   this.props.history.push("/mgmt/" + address);
  // };
}
