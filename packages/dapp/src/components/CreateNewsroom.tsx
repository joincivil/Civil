import * as React from "react";
import { PageView, ViewModule } from "./utility/ViewModules";
import {
  Modal,
  FormHeading,
  ModalContent,
  Button,
  buttonSizes,
} from "@joincivil/components";
import { Newsroom } from "./newsroom/Newsroom";

export interface CreateNewsroomState {
  name: string;
  multisig: boolean;
  error: string;
  modalOpen: boolean;
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
      modalOpen: true,
    };
  }

  public renderModal(): JSX.Element {
    return (<Modal>
      <FormHeading>Welcome</FormHeading>
      <ModalContent>Welcome to our newsroom setup guide</ModalContent>
      <ModalContent>Here, you'll be going through the steps to set up your newsroom smart contract so that you can publish on Civil and make use of blockchain features such as permananet archiving.</ModalContent>
      <ModalContent>You'll need to use either Chrome, Brave, or FireFox as your browser and have MetaMask installed. You'll also need the public keys (wallet addresses) of your newsroom co-owners and of your editors, as well as your newsroom charter.</ModalContent>
      <ModalContent>If you're not sure about some of the above, don't worry, we'll point you to some resources. Let's go!</ModalContent>
      <Button onClick={() => this.setState({modalOpen: false})} size={buttonSizes.MEDIUM}>Get Started</Button>
    </Modal>);
  }

  public render(): JSX.Element {
    console.log("this.props.history:", this.props.history);
    return (
      <PageView>
        <ViewModule>
          <Newsroom/>
        </ViewModule>
        {this.state.modalOpen && this.renderModal()}
      </PageView>
    );
  }

}

export default CreateNewsroom;
