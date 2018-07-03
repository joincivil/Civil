import * as React from "react";
import {
  StepHeader,
  StepProps,
  StepStyled,
  TextInput,
  DetailTransactionButton,
  Collapsable,
  fonts,
  AddressWithCopyButton,
  StepDescription,
} from "@joincivil/components";
import { TwoStepEthTransaction, Civil, TxHash, EthAddress } from "@joincivil/core";
import { Newsroom } from "@joincivil/core/build/src/contracts/newsroom";
import styled, { StyledComponentClass } from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { updateNewsroom, changeName } from "./actionCreators";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { StateWithNewsroom } from "./reducers";

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
}

export const Label: StyledComponentClass<any, "div"> = styled.div`
  font-size: 15px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 10px;
`;

class NameAndAddressComponent extends React.Component<NameAndAddressProps & DispatchProp<any>, NameAndAddressState> {
  constructor(props: NameAndAddressProps & DispatchProp<any>) {
    super(props);
    this.state = {
      name: this.props.name,
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
                  postTransaction: this.props.onNewsroomCreated,
                  handleTransactionHash: this.props.onContractDeployStarted,
                },
              ]}
              civil={value.civil}
              estimateFunctions={[value.civil!.estimateNewsroomDeployTrusted.bind(value.civil, this.props.name)]}
              requiredNetwork="rinkeby"
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
              requiredNetwork={value.network}
            >
              Change Name
            </DetailTransactionButton>
            <div>
              <Label>Newsroom Contract Address</Label>
              <AddressWithCopyButton address={this.props.address || ""} />
            </div>
          </>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderOnlyTxHash(): JSX.Element {
    return <p>Still waiting for contract to sync</p>;
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
          {body}
        </Collapsable>
      </StepStyled>
    );
  }

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
