import * as React from "react";
import { PageView, ViewModule } from "./utility/ViewModules";
import { Modal, FormHeading, ModalContent, Button, buttonSizes } from "@joincivil/components";
import { Newsroom } from "@joincivil/newsroom-manager";
import { EthAddress } from "@joincivil/core";
import { getCivil } from "../helpers/civilInstance";

export interface CreateNewsroomState {
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
      error: "",
    };
  }

  public render(): JSX.Element {
    console.log("this.props.history:", this.props.history);
    const civil = getCivil();
    return (
      <PageView>
        <ViewModule>
          <Newsroom civil={civil} onNewsroomCreated={this.onCreated} />
        </ViewModule>
      </PageView>
    );
  }

  private onCreated = (address: EthAddress) => {
    this.props.history.push("/mgmt/" + address);
  };
}

export default CreateNewsroom;
