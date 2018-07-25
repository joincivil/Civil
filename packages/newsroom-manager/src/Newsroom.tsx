import { ButtonTheme, colors, FormHeading, StepProcess } from "@joincivil/components";
import { Civil, EthAddress, TxHash } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled, { StyledComponentClass, ThemeProvider } from "styled-components";
import { addGetNameForAddress, addNewsroom, getEditors, getNewsroom } from "./actionCreators";
// import { SignConstitution } from "./SignConstitution";
// import { CreateCharter } from "./CreateCharter";
// import { ApplyToTCR } from "./ApplyToTCR";
import { CivilContext } from "./CivilContext";
import { CompleteYourProfile } from "./CompleteYourProfile";
import { NameAndAddress } from "./NameAndAddress";
import { StateWithNewsroom } from "./reducers";

export interface NewsroomComponentState {
  currentStep: number;
  subscription?: any;
}

export interface NewsroomProps {
  address?: EthAddress;
  txHash?: TxHash;
  name?: string;
  disabled?: boolean;
  account?: string;
  currentNetwork?: string;
  requiredNetwork?: string;
  civil?: Civil;
  theme?: ButtonTheme;
  renderUserSearch?(onSetAddress: any): JSX.Element;
  onNewsroomCreated?(address: EthAddress): void;
  onContractDeployStarted?(txHash: TxHash): void;
  getNameForAddress?(address: EthAddress): Promise<string>;
}

export const NoteSection: StyledComponentClass<any, "p"> = styled.p`
  font-style: italic;
  color: ${colors.accent.CIVIL_GRAY_2};
`;

export const Wrapper: StyledComponentClass<any, "div"> = styled.div`
  max-width: 750px;
`;

class NewsroomComponent extends React.Component<NewsroomProps & DispatchProp<any>, NewsroomComponentState> {
  constructor(props: NewsroomProps) {
    super(props);
    this.state = {
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

  public async componentWillUnmount(): Promise<void> {}

  public async componentWillReceiveProps(newProps: NewsroomProps & DispatchProp<any>): Promise<void> {
    if (newProps.address && !this.props.address) {
      await this.hydrateNewsroom(newProps.address);
    }
  }

  public render(): JSX.Element {
    return (
      <ThemeProvider theme={this.props.theme}>
        <Wrapper>
          <FormHeading>Newsroom Smart Contract</FormHeading>
          <p>
            Here are the steps to set up your newsroom smart contract. You'll be able to use Civil's blockchain features
            such as indexing and signing posts.
          </p>
          <NoteSection>
            Note: Each step will involve a transaction from your wallet, which will open in a new pop-up window in
            MetaMask. You'll need to confirm the transaction
          </NoteSection>
          <CivilContext.Provider
            value={{
              civil: this.props.civil,
              currentNetwork: this.props.currentNetwork,
              requiredNetwork: this.props.requiredNetwork || "rinkeby",
              account: this.props.account,
            }}
          >
            <StepProcess disabled={this.isDisabled()} stepIsDisabled={this.isStepDisabled}>
              <NameAndAddress
                active={this.state.currentStep}
                onNewsroomCreated={this.onNewsroomCreated}
                name={this.props.name}
                address={this.props.address}
                txHash={this.props.txHash}
                onContractDeployStarted={this.props.onContractDeployStarted}
              />
              <CompleteYourProfile
                active={this.state.currentStep}
                address={this.props.address}
                renderUserSearch={this.props.renderUserSearch}
              />
              {/* <CreateCharter /> */}
              {/* <SignConstitution address={this.props.address} active={this.state.currentStep} /> */}
              {/* <ApplyToTCR /> */}
            </StepProcess>
          </CivilContext.Provider>
        </Wrapper>
      </ThemeProvider>
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

  public isStepDisabled = (index: number) => {
    if (index === 0) {
      return false;
    } else if (index < 2 && this.props.address) {
      return false;
    }
    return true;
  };

  private isDisabled = (): boolean => {
    return (
      this.props.disabled ||
      !this.props.civil ||
      this.props.currentNetwork !== this.props.requiredNetwork ||
      !this.props.account
    );
  };

  private hydrateNewsroom = async (address: EthAddress): Promise<void> => {
    await this.props.dispatch!(getNewsroom(address, this.props.civil!));
    this.props.dispatch!(getEditors(address, this.props.civil!));
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
