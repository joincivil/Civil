import {
  AddressWithCopyButton,
  Button,
  buttonSizes,
  Collapsable,
  DetailTransactionButton,
  fonts,
  GreenCheckMark,
  LoadingIndicator,
  Modal,
  StepDescription,
  StepHeader,
  StepProps,
  StepStyled,
  TextInput,
  ViewTransactionLink,
} from "@joincivil/components";
import { Civil, EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { Newsroom } from "@joincivil/core/build/src/contracts/newsroom";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled, { StyledComponentClass } from "styled-components";
import { changeName, updateNewsroom } from "./actionCreators";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { StateWithNewsroom } from "./reducers";
import { TransactionButtonInner } from "./TransactionButtonInner";

export interface NameAndAddressProps extends StepProps {
  address?: EthAddress;
  txHash?: TxHash;
  name?: string;
  newsroom?: Newsroom;
  onNewsroomCreated?(result: any): void;
  onContractDeployStarted?(txHash: TxHash): void;
}

export interface NameAndAddressState {
  name?: string;
  modalOpen: boolean;
}

const Label: StyledComponentClass<any, "div"> = styled.div`
  font-size: 15px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 10px;
`;

const PendingWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CollapsableWrapper = styled.div`
  width: 600px;
`;

const CollapsableInner = styled.div`
  width: 500px;
`;

class NameAndAddressComponent extends React.Component<NameAndAddressProps & DispatchProp<any>, NameAndAddressState> {
  constructor(props: NameAndAddressProps & DispatchProp<any>) {
    super(props);
    this.state = {
      name: this.props.name,
      modalOpen: false,
    };
  }

  public componentWillReceiveProps(newProps: NameAndAddressProps): void {
    this.setState({ name: newProps.name });
  }

  public onChange(name: string, value: string | void): void {
    this.props.dispatch!(updateNewsroom(this.props.address || "", { wrapper: { data: { name: value || "" } } }));
  }

  public onContractChange(name: string, value: string | void): void {
    this.setState({ name: value || undefined });
  }

  public progressModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }
    return (
      <Modal textAlign="left">
        <h2>Your newsroom is being created</h2>
        <p>
          You will also need to authorize this transaction in your wallet. MetaMask should open a new window, if you
          don't see it, please click the icon in the browser bar.
        </p>
        <p>
          Note, that this could take a while depending on network traffic. You can close out of this while you wait.
        </p>
        <p>You will not be able to continue setting up your newsroom contract until this transaction is completed.</p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => this.setState({ modalOpen: false })}>
          Close
        </Button>
      </Modal>
    );
  }

  public renderCheckMark(): JSX.Element | null {
    if (!this.props.address) {
      return null;
    }
    return <GreenCheckMark />;
  }

  public renderNoContract(): JSX.Element {
    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <>
            <TextInput
              label="Newsroom Name"
              placeholder="Enter your newsroom's name"
              name="NameInput"
              value={this.props.name || ""}
              onChange={(name, val) => this.onChange(name, val)}
            />
            <DetailTransactionButton
              transactions={[
                {
                  transaction: this.createNewsroom.bind(this, value.civil),
                  postTransaction: this.postTransaction,
                  handleTransactionHash: this.props.onContractDeployStarted,
                },
              ]}
              civil={value.civil}
              estimateFunctions={[value.civil!.estimateNewsroomDeployTrusted.bind(value.civil, this.props.name)]}
              requiredNetwork={value.requiredNetwork}
              Button={TransactionButtonInner}
              noModal={true}
              preExecuteTransactions={() => this.setState({ modalOpen: true })}
            >
              Create Newsroom
            </DetailTransactionButton>
          </>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderContract(): JSX.Element {
    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <>
            <TextInput
              label="Newsroom Name"
              placeholder="Enter your newsroom's name"
              name="NameInput"
              value={this.state.name || ""}
              onChange={(name, val) => this.onContractChange(name, val)}
            />
            <DetailTransactionButton
              transactions={[{ transaction: this.changeName, postTransaction: this.onNameChange }]}
              civil={value.civil}
              requiredNetwork={value.requiredNetwork}
              Button={TransactionButtonInner}
            >
              Change Name
            </DetailTransactionButton>
            <div>
              <Label>Newsroom Contract Address</Label>
              <AddressWithCopyButton address={this.props.address || ""} />
              <StepDescription>
                This is your newsroom contract address. Think of it as your newsroom's permanent identity on the
                blockchain.
              </StepDescription>
            </div>
          </>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderOnlyTxHash(): JSX.Element {
    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <PendingWrapper>
            <LoadingIndicator height={100} width={150} />
            <h3>Transaction Processing</h3>
            <p>
              Right now computers around the world are learning about your newsroom contract.<br />
              <ViewTransactionLink txHash={this.props.txHash!} network={value.requiredNetwork} />
            </p>
          </PendingWrapper>
        )}
      </CivilContext.Consumer>
    );
  }

  public render(): JSX.Element {
    let body;
    if (this.props.address) {
      body = this.renderContract();
    } else if (this.props.txHash) {
      body = this.renderOnlyTxHash();
    } else {
      body = this.renderNoContract();
    }
    return (
      <StepStyled disabled={this.props.disabled} index={this.props.index || 0}>
        <CollapsableWrapper>
          <Collapsable
            open={!this.props.disabled}
            disabled={this.props.disabled}
            header={
              <>
                <StepHeader disabled={this.props.disabled}>Set up a newsroom</StepHeader>
                <StepDescription disabled={this.props.disabled}>
                  Enter your newsroom name to create your newsroom smart contract.
                </StepDescription>
              </>
            }
          >
            <CollapsableInner>{body}</CollapsableInner>
          </Collapsable>
        </CollapsableWrapper>
        {this.progressModal()}
        {this.renderCheckMark()}
      </StepStyled>
    );
  }

  private postTransaction = (result: any): void => {
    if (this.props.onNewsroomCreated) {
      this.props.onNewsroomCreated(result);
    }
    this.setState({ modalOpen: false });
  };

  private changeName = async (): Promise<TwoStepEthTransaction<any>> => {
    return this.props.newsroom!.setName(this.state.name!);
  };

  private onNameChange = (result: any): void => {
    this.props.dispatch!(changeName(this.props.address!, this.state.name!));
  };

  private createNewsroom = async (civil: Civil): Promise<TwoStepEthTransaction<any>> => {
    return civil.newsroomDeployTrusted(this.props.name!);
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: NameAndAddressProps): NameAndAddressProps => {
  let newsroom;
  if (ownProps.address && state.newsrooms.get(ownProps.address)) {
    newsroom = state.newsrooms.get(ownProps.address).newsroom;
  }
  return {
    newsroom,
    ...ownProps,
  };
};

export const NameAndAddress = connect(mapStateToProps)(NameAndAddressComponent);
