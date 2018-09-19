import { hasInjectedProvider } from "@joincivil/ethapi";
import { ButtonTheme, colors, StepProcessTopNav, Step, ManagerHeading, WalletOnboarding } from "@joincivil/components";
import { Civil, EthAddress, TxHash } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled, { StyledComponentClass, ThemeProvider } from "styled-components";
import { addGetNameForAddress, addNewsroom, getOwners, getEditors, getNewsroom } from "./actionCreators";
// import { SignConstitution } from "./SignConstitution";
// import { CreateCharter } from "./CreateCharter";
// import { ApplyToTCR } from "./ApplyToTCR";
import { Welcome } from "./Welcome";
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
  requiredNetworkNiceName?: string;
  civil?: Civil;
  theme?: ButtonTheme;
  profileWalletAddress?: EthAddress;
  showWalletOnboarding?: boolean;
  showWelcome?: boolean;
  helpUrl?: string;
  profileUrl?: string;
  profileAddressSaving?: boolean;
  userIsOwner?: boolean;
  userIsEditor?: boolean;
  userNotOnContract?: boolean;
  saveAddressToProfile?(): Promise<void>;
  renderUserSearch?(onSetAddress: any): JSX.Element;
  onNewsroomCreated?(address: EthAddress): void;
  onContractDeployStarted?(txHash: TxHash): void;
  getNameForAddress?(address: EthAddress): Promise<string>;
}

export const NoteSection: StyledComponentClass<any, "p"> = styled.p`
  color: ${(props: { disabled: boolean }) => (props.disabled ? "#dcdcdc" : colors.accent.CIVIL_GRAY_3)};
`;

export const Wrapper: StyledComponentClass<any, "div"> = styled.div`
  max-width: 845px;

  &,
  & p {
    font-size: 14px;
  }
`;

const ErrorP = styled.p`
  color: ${colors.accent.CIVIL_RED};
`;

const Heading = ManagerHeading.extend`
  color: ${(props: { disabled: boolean }) => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.BLACK)};
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

    if (this.props.address && this.props.civil) {
      await this.hydrateNewsroom(this.props.address);
    }
  }

  public async componentWillReceiveProps(newProps: NewsroomProps & DispatchProp<any>): Promise<void> {
    if (newProps.address && !this.props.address) {
      await this.hydrateNewsroom(newProps.address);
    }
  }

  public render(): JSX.Element {
    const disabled = this.isDisabled();
    const manager = (
      <>
        {this.props.userNotOnContract && (
          <ErrorP>
            Your wallet address is not listed on your newsroom contract, so you are unable to make changes to it. Please
            contact a newsroom officer in order to be added.
          </ErrorP>
        )}
        <Heading disabled={disabled}>Newsroom Application</Heading>
        <CivilContext.Provider
          value={{
            civil: this.props.civil,
            currentNetwork: this.props.currentNetwork,
            requiredNetwork: this.props.requiredNetwork || "rinkeby",
            account: this.props.account,
          }}
        >
          <StepProcessTopNav activeIndex={this.state.currentStep}>
            <Step title={"Set up a newsroom"} complete={!!this.props.address}>
              <NameAndAddress
                onNewsroomCreated={this.onNewsroomCreated}
                name={this.props.name}
                address={this.props.address}
                txHash={this.props.txHash}
                onContractDeployStarted={this.props.onContractDeployStarted}
              />
            </Step>
            <Step title={"Add accounts"}>
              <CompleteYourProfile
                address={this.props.address}
                renderUserSearch={this.props.renderUserSearch}
                profileWalletAddress={this.props.profileWalletAddress}
              />
            </Step>
            <Step title={"Create your charter"}>
              <div />
            </Step>
            <Step title={"Sign the Constitution"}>
              <div />
            </Step>
            <Step title={"Apply to the Registry"}>
              <div />
            </Step>
          </StepProcessTopNav>
        </CivilContext.Provider>
      </>
    );

    return (
      <ThemeProvider theme={this.props.theme}>
        <Wrapper>
          {this.props.showWelcome && <Welcome helpUrl={this.props.helpUrl!} />}
          {this.props.showWalletOnboarding && (
            <WalletOnboarding
              noProvider={!hasInjectedProvider()}
              walletLocked={this.props.civil && !this.props.account}
              wrongNetwork={this.props.civil && this.props.currentNetwork !== this.props.requiredNetwork}
              requiredNetworkNiceName={this.props.requiredNetworkNiceName || this.props.requiredNetwork}
              metamaskWalletAddress={this.props.account}
              profileUrl={this.props.profileUrl}
              profileAddressSaving={this.props.profileAddressSaving}
              profileWalletAddress={this.props.profileWalletAddress}
              saveAddressToProfile={this.props.saveAddressToProfile}
            />
          )}

          {manager}
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
    if (this.props.userNotOnContract) {
      return true;
    }

    if (index === 0) {
      return false;
    } else if (index < 2 && this.props.address) {
      return false;
    } else if (index > 1 && this.props.address && !this.props.userIsOwner) {
      // steps > 1 are things only owners can do (charter, sign constitution, apply to registry)
      return true;
    }
    return true;
  };

  private isDisabled = (): boolean => {
    return (
      this.props.disabled ||
      !this.props.civil ||
      !this.props.requiredNetwork!.includes(this.props.currentNetwork!) ||
      !this.props.account ||
      !!this.props.userNotOnContract
    );
  };

  private hydrateNewsroom = async (address: EthAddress): Promise<void> => {
    await this.props.dispatch!(getNewsroom(address, this.props.civil!));
    this.props.dispatch!(getOwners(address, this.props.civil!));
    this.props.dispatch!(getEditors(address, this.props.civil!));
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: NewsroomProps): NewsroomProps => {
  const { address, account } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  const userIsOwner = newsroom.owners && newsroom.owners.indexOf(account!) !== -1;
  const userIsEditor = newsroom.editors && newsroom.editors.indexOf(account!) !== -1;
  const userNotOnContract = !!ownProps.address && !userIsOwner && !userIsEditor;

  return {
    ...ownProps,
    name: newsroom.wrapper.data.name,
    userIsOwner,
    userIsEditor,
    userNotOnContract,
  };
};

export const Newsroom = connect(mapStateToProps)(NewsroomComponent);
