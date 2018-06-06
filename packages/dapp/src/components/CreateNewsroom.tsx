import * as React from "react";
import { PageView, ViewModule } from "./utility/ViewModules";
import { Modal, FormHeading, ModalContent, Button, buttonSizes } from "@joincivil/components";
import { Newsroom } from "./newsroom/Newsroom";
import { EthAddress } from "@joincivil/core";

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
    return (
      <PageView>
        <ViewModule>
          <Newsroom onNewsroomCreated={this.onCreated} />
        </ViewModule>
      </PageView>
    );
  }

  private onCreated = (address: EthAddress) => {
    this.props.history.push("/mgmt/" + address);
  };
}

export default CreateNewsroom;
