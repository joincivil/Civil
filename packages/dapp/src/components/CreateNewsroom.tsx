import * as React from "react";
import TransactionButton from "./utility/TransactionButton";
import { getCivil } from "../helpers/civilInstance";
import { TwoStepEthTransaction } from "@joincivil/core";
import { PageView, ViewModule, ViewModuleHeader } from "./utility/ViewModules";

export interface CreateNewsroomState {
  name: string;
  multisig: boolean;
  error: string;
}
export interface CreateNewsroomProps {
  match: any;
  history: any;
}

class CreateNewsroom extends React.Component<CreateNewsroomProps, CreateNewsroomState> {
  constructor(props: CreateNewsroomProps) {
    super(props);
    this.state = {
      name: "",
      multisig: false,
      error: "",
    };
  }

  public render(): JSX.Element {
    console.log("this.props.history:", this.props.history);
    return (
      <PageView>
        <ViewModule>
          <ViewModuleHeader>Create Newsroom</ViewModuleHeader>
          {this.state.error}
          <input onChange={this.onNameChange} />
          <TransactionButton
            transactions={[{ transaction: this.createNewsroom, postTransaction: this.onNewsroomCreated }]}
          >
            Deploy Newsroom
          </TransactionButton>
          <br />
          <input type="checkbox" checked={this.state.multisig} onChange={this.onMultisigChange} /> multisig
        </ViewModule>
      </PageView>
    );
  }

  private onNameChange = (e: any) => {
    return this.setState({ name: e.target.value });
  };

  private onMultisigChange = (e: any) => {
    return this.setState({ multisig: e.target.checked });
  };

  private createNewsroom = async (): Promise<TwoStepEthTransaction<any>> => {
    const civil = getCivil();
    if (this.state.multisig) {
      return civil.newsroomDeployTrusted(this.state.name);
    } else {
      return civil.newsroomDeployNonMultisigTrusted(this.state.name);
    }
  };

  private onNewsroomCreated = (result: any) => {
    const address = result.address;
    this.props.history.push("/mgmt/" + address);
  };
}

export default CreateNewsroom;
