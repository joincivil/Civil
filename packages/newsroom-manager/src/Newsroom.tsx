import * as React from "react";
import { FormHeading, StepProcess, Modal, ModalContent, Button, buttonSizes } from "@joincivil/components";
import { NameAndAddress } from "./NameAndAddress";
import { CompleteYourProfile } from "./CompleteYourProfile";
import { connect, DispatchProp } from "react-redux";
import { StateWithNewsroom } from "./reducers";
import { addNewsroom, getNewsroom, getEditors, addGetNameForAddress } from "./actionCreators";
import { EthAddress, Civil, TxHash } from "@joincivil/core";
import { SignConstitution } from "./SignConstitution";
import { CreateCharter } from "./CreateCharter";
import { ApplyToTCR } from "./ApplyToTCR";
import { CivilContext } from "./CivilContext";

export interface NewsroomComponentState {
  modalOpen: boolean;
  currentStep: number;
}

export interface NewsroomProps {
  address?: EthAddress;
  txHash?: TxHash;
  name?: string;
  civil: Civil;
  onNewsroomCreated?(address: EthAddress): void;
  onContractDeployStarted?(txHash: TxHash): void;
  getNameForAddress?(address: EthAddress): Promise<string>;
}

class NewsroomComponent extends React.Component<NewsroomProps & DispatchProp<any>, NewsroomComponentState> {
  constructor(props: NewsroomProps) {
    super(props);
    this.state = {
      modalOpen: !JSON.parse(window.localStorage.getItem("civil:hasSeenWelcomeModal") || "false"),
      currentStep: props.address ? 1 : 0,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.getNameForAddress) {
      this.props.dispatch!(addGetNameForAddress(this.props.getNameForAddress));
    }

    if (this.props.address) {
      await this.hydrateNewsroom(this.props.address);
    }
  }

  public async componentWillReceiveProps(newProps: NewsroomProps & DispatchProp<any>): Promise<void> {
    if (newProps.address && !this.props.address) {
      await this.hydrateNewsroom(newProps.address);
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
          You'll need to use either Chrome, Brave, or Firefox as your browser and have MetaMask installed. You'll also
          need the public keys (wallet addresses) of your newsroom co-owners and of your editors, as well as your
          newsroom charter.
        </ModalContent>
        <ModalContent>
          If you're not sure about some of the above, don't worry, we'll point you to some resources. Let's go!
        </ModalContent>
        <Button onClick={this.onModalClose} size={buttonSizes.MEDIUM}>
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
        <CivilContext.Provider value={this.props.civil}>
          <StepProcess stepIsDisabled={this.isDisabled}>
            <NameAndAddress
              active={this.state.currentStep}
              onNewsroomCreated={this.onNewsroomCreated}
              name={this.props.name}
              address={this.props.address}
              txHash={this.props.txHash}
              onContractDeployStarted={this.props.onContractDeployStarted}
            />
            <CompleteYourProfile active={this.state.currentStep} address={this.props.address} />
            <CreateCharter />
            <SignConstitution address={this.props.address} active={this.state.currentStep} />
            <ApplyToTCR />
          </StepProcess>
        </CivilContext.Provider>
        {this.state.modalOpen && !this.props.address && this.renderModal()}
      </>
    );
  }

  public onNewsroomCreated = async (result: any) => {
    await this.props.dispatch!(
      addNewsroom({
        wrapper: await result.getNewsroomWrapper(),
        address: result.address,
        newsroom: result,
      }),
    );
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

  private hydrateNewsroom = async (address: EthAddress): Promise<void> => {
    await this.props.dispatch!(getNewsroom(address, this.props.civil));
    this.props.dispatch!(getEditors(address, this.props.civil));
  };

  private onModalClose = () => {
    this.setState({ modalOpen: false });
    window.localStorage.setItem("civil:hasSeenWelcomeModal", "true");
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: NewsroomProps): NewsroomProps => {
  const { address } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  return {
    ...ownProps,
    name: newsroom.wrapper.data.name,
  };
};

export const Newsroom = connect(mapStateToProps)(NewsroomComponent);
