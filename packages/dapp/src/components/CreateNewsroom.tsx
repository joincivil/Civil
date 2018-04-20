import * as React from "react";
import TransactionButton from "./utility/TransactionButton";
import { getCivil } from "../helpers/civilInstance";

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
        <TransactionButton transaction={this.createNewsroom}>Deploy Newsroom</TransactionButton>
      </>
    );
  }

  private onChange = (e: any) => {
    this.setState({ name: e.target.value });
  };

  private createNewsroom = async () => {
    const civil = getCivil();
    let newsroomTransaction;
    try {
      newsroomTransaction = await civil.newsroomDeployNonMultisigTrusted(this.state.name);
    } catch (ex) {
      console.log("failed to create newsroom.");
      this.setState({
        error:
          "Error creating newsroom. Ensure Metamask is installed, unlocked, and set to Rinkeby and that you have enough ETH for the transaction.",
      });
    }
    if (newsroomTransaction) {
      const newsroom = await newsroomTransaction.awaitReceipt();
      const address = newsroom.address;
      this.props.history.push("/newsroom/" + address);
    }
  };
}

export default CreateNewsroom;
