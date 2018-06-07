import * as React from "react";
import { FormHeading, StepProcess, Modal, ModalContent, Button, buttonSizes } from "@joincivil/components";
import { NameAndAddress } from "./NameAndAddress";
import { CompleteYourProfile } from "./CompleteYourProfile";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../reducers";
import { addNewsroom, getNewsroom, getEditors } from "../../actionCreators/newsrooms";
import { EthAddress } from "@joincivil/core";
import { SignConstitution } from "./SignConstitution";
import { CreateCharter } from "./CreateCharter";
import { ApplyToTCR } from "./ApplyToTCR";

export interface NewsroomState {
  modalOpen: boolean;
  currentStep: number;
}

export interface NewsroomProps {
  address?: string;
  name?: string;
  onNewsroomCreated?(address: EthAddress): void;
}

class NewsroomComponent extends React.Component<NewsroomProps & DispatchProp<any>, NewsroomState> {
  constructor(props: NewsroomProps) {
    super(props);
    this.state = {
      modalOpen: true,
      currentStep: props.address ? 1 : 0,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.address) {
      await this.props.dispatch!(getNewsroom(this.props.address));
      this.props.dispatch!(getEditors(this.props.address));
    }
  }

  public renderModal(): JSX.Element {
    return (
      <Modal>
        <FormHeading>Welcome</FormHeading>
        <ModalContent>Welcome to our newsroom setup guide</ModalContent>
        <ModalContent>
          Here, you'll be going through the steps to set up your newsroom smart contract so that you can publish on
          Civil and make use of blockchain features such as permananet archiving.
        </ModalContent>
        <ModalContent>
          You'll need to use either Chrome, Brave, or FireFox as your browser and have MetaMask installed. You'll also
          need the public keys (wallet addresses) of your newsroom co-owners and of your editors, as well as your
          newsroom charter.
        </ModalContent>
        <ModalContent>
          If you're not sure about some of the above, don't worry, we'll point you to some resources. Let's go!
        </ModalContent>
        <Button onClick={() => this.setState({ modalOpen: false })} size={buttonSizes.MEDIUM}>
          Get Started
        </Button>
      </Modal>
    );
  }

  public render(): JSX.Element {
    return (
      <>
        <FormHeading>Newsroom Application</FormHeading>
        <p>Set up your newsroom smart contract and get started publishing on Civil.</p>
        <StepProcess stepIsDisabled={this.isDisabled}>
          <NameAndAddress
            active={this.state.currentStep}
            onNewsroomCreated={this.onNewsroomCreated}
            name={this.props.name}
            address={this.props.address}
          />
          <CompleteYourProfile active={this.state.currentStep} address={this.props.address} />
          <CreateCharter />
          <SignConstitution address={this.props.address} active={this.state.currentStep} />
          <ApplyToTCR />
        </StepProcess>
        {this.state.modalOpen && !this.props.address && this.renderModal()}
      </>
    );
  }

  public onNewsroomCreated = async (result: any) => {
    await this.props.dispatch!(addNewsroom(result.getNewsroomWrapper()));
    if (this.props.onNewsroomCreated) {
      this.props.onNewsroomCreated(result.address);
    }
  };

  public isDisabled = (index: number) => {
    if (index === 0) {
      return false;
    } else if (index < 2 && this.props.address) {
      return false;
    }
    return true;
  };
}

const mapStateToProps = (state: State, ownProps: NewsroomProps): NewsroomProps => {
  const { address } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  return {
    ...ownProps,
    address,
    name: newsroom.wrapper.data.name,
  };
};

export const Newsroom = connect(mapStateToProps)(NewsroomComponent);
