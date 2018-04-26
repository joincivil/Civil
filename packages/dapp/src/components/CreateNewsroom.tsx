import * as React from "react";
import TransactionButton from "./utility/TransactionButton";
import { getCivil } from "../helpers/civilInstance";
import { TwoStepEthTransaction } from "@joincivil/core";

export interface CreateNewsroomState {
  name: string;
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
      error: "",
    };
  }

  public render(): JSX.Element {
    console.log("this.props.history: " + this.props.history);
    return (
      <>
        {this.state.error}
        <input onChange={this.onChange} />
        <TransactionButton firstTransaction={this.createNewsroom} postFirstTransaction={this.onNewsroomCreated}>
          Deploy Newsroom
        </TransactionButton>
      </>
    );
  }

  private onChange = (e: any) => {
    this.setState({ name: e.target.value });
  };

  private createNewsroom = async (): Promise<TwoStepEthTransaction<any>> => {
    const civil = getCivil();
    return civil.newsroomDeployNonMultisigTrusted(this.state.name);
  };

  private onNewsroomCreated = (result: any) => {
    const address = result.address;
    this.props.history.push("/mgmt/" + address);
  };
}

export default CreateNewsroom;
