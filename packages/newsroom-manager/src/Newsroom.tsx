import { hasInjectedProvider } from "@joincivil/ethapi";
import {
  ButtonTheme,
  colors,
  StepProcessTopNav,
  Step,
  ManagerHeading,
  WalletOnboarding,
  RenderButtonsArgs,
  Button,
  SecondaryButton,
  buttonSizes,
} from "@joincivil/components";
import { Civil, EthAddress, TxHash, CharterData } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled, { StyledComponentClass, ThemeProvider } from "styled-components";
import {
  addGetNameForAddress,
  addNewsroom,
  getEditors,
  getNewsroom,
  addConstitutionHash,
  addConstitutionUri,
} from "./actionCreators";
import { CreateCharterPartOne } from "./CreateCharterPartOne";
import { CreateCharterPartTwo } from "./CreateCharterPartTwo";
import { SignConstitution } from "./SignConstitution";
import { Welcome } from "./Welcome";
import { CivilContext } from "./CivilContext";
import { CompleteYourProfile } from "./CompleteYourProfile";
import { NameAndAddress } from "./NameAndAddress";
import { ApplyToTCR } from "./ApplyToTCR";
import { StateWithNewsroom } from "./reducers";
import { CmsUserData } from "./types";

export interface NewsroomComponentState {
  currentStep: number;
  subscription?: any;
  charterPartOneComplete?: boolean;
  charterPartTwoComplete?: boolean;
}

export interface IpfsObject {
  add(content: any, options?: { hash: string; pin: boolean }): Promise<[{ path: string; hash: string; size: number }]>;
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
  ipfs?: IpfsObject;
  theme?: ButtonTheme;
  profileWalletAddress?: EthAddress;
  showWalletOnboarding?: boolean;
  showWelcome?: boolean;
  helpUrl?: string;
  profileUrl?: string;
  profileAddressSaving?: boolean;
  owners?: string[];
  editors?: string[];
  savedCharter?: Partial<CharterData>;
  saveCharter?(charter: Partial<CharterData>): void;
  saveAddressToProfile?(): Promise<void>;
  renderUserSearch?(onSetAddress: any): JSX.Element;
  onNewsroomCreated?(address: EthAddress): void;
  onContractDeployStarted?(txHash: TxHash): void;
  getNameForAddress?(address: EthAddress): Promise<CmsUserData>;
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

const Heading = styled(ManagerHeading)`
  color: ${(props: { disabled: boolean }) => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.BLACK)};
`;

class NewsroomComponent extends React.Component<NewsroomProps & DispatchProp<any>, NewsroomComponentState> {
  public static defaultProps = {
    theme: {},
  };

  constructor(props: NewsroomProps) {
    super(props);
    let currentStep = props.address ? 1 : 0;
    try {
      if (localStorage.newsroomOnBoardingLastSeen) {
        currentStep = Number(localStorage.newsroomOnBoardingLastSeen);
      }
    } catch (e) {
      console.error("Failed to load step index", e);
    }
    this.state = {
      currentStep,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.getNameForAddress) {
      this.props.dispatch!(addGetNameForAddress(this.props.getNameForAddress));
    }

    if (this.props.address && this.props.civil) {
      await this.hydrateNewsroom(this.props.address);
    }

    if (this.props.civil) {
      const tcr = await this.props.civil.tcrSingletonTrusted();
      const government = await tcr.getGovernment();
      const hash = await government.getConstitutionHash();
      const uri = await government.getConstitutionURI();
      this.props.dispatch!(addConstitutionHash(hash));
      this.props.dispatch!(addConstitutionUri(uri));
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
        <Heading disabled={disabled}>Newsroom Application</Heading>
        <CivilContext.Provider
          value={{
            civil: this.props.civil,
            currentNetwork: this.props.currentNetwork,
            requiredNetwork: this.props.requiredNetwork || "rinkeby",
            account: this.props.account,
          }}
        >
          <StepProcessTopNav
            activeIndex={this.state.currentStep}
            onActiveTabChange={(newIndex: number) => {
              try {
                localStorage.newsroomOnBoardingLastSeen = JSON.stringify(newIndex);
              } catch (e) {
                console.error("Failed to save step index", e);
              }
              this.setState({ currentStep: newIndex })
            }}
          >
            <Step
              title={"Set up a newsroom"}
              renderButtons={(args: RenderButtonsArgs): JSX.Element => {
                return (
                  <Button disabled={!this.props.address} onClick={args.goNext} size={buttonSizes.MEDIUM}>
                    Next
                  </Button>
                );
              }}
              complete={!!this.props.address}
            >
              <NameAndAddress
                onNewsroomCreated={this.onNewsroomCreated}
                name={this.props.name}
                address={this.props.address}
                txHash={this.props.txHash}
                onContractDeployStarted={this.props.onContractDeployStarted}
              />
            </Step>
            <Step
              title={"Add accounts"}
              renderButtons={(args: RenderButtonsArgs): JSX.Element => {
                return (
                  <>
                    <SecondaryButton size={buttonSizes.MEDIUM} onClick={args.goPrevious}>
                      Back
                    </SecondaryButton>
                    <Button onClick={args.goNext} size={buttonSizes.MEDIUM}>
                      Next
                    </Button>
                  </>
                );
              }}
              complete={this.props.owners!.length > 1 || !!this.props.editors!.length || this.state.currentStep > 1}
            >
              <CompleteYourProfile
                address={this.props.address}
                renderUserSearch={this.props.renderUserSearch}
                profileWalletAddress={this.props.profileWalletAddress}
              />
            </Step>
            <Step
              title={"Create Registry profile"}
              renderButtons={(args: RenderButtonsArgs): JSX.Element => {
                return (
                  <>
                    <SecondaryButton size={buttonSizes.MEDIUM} onClick={args.goPrevious}>
                      Back
                    </SecondaryButton>
                    <Button
                      onClick={args.goNext}
                      size={buttonSizes.MEDIUM}
                      disabled={!this.state.charterPartOneComplete}
                    >
                      Next
                    </Button>
                  </>
                );
              }}
              complete={this.state.charterPartOneComplete}
            >
              <CreateCharterPartOne
                address={this.props.address}
                savedCharter={this.getSavedCharter()}
                saveCharter={this.saveCharter}
                stepisComplete={(isComplete: boolean) => this.setState({ charterPartOneComplete: isComplete })}
              />
            </Step>
            <Step
              title={"Write your charter"}
              renderButtons={(args: RenderButtonsArgs): JSX.Element => {
                return (
                  <>
                    <SecondaryButton size={buttonSizes.MEDIUM} onClick={args.goPrevious}>
                      Back
                    </SecondaryButton>
                    <Button
                      onClick={args.goNext}
                      size={buttonSizes.MEDIUM}
                      disabled={!this.state.charterPartTwoComplete}
                    >
                      Next
                    </Button>
                  </>
                );
              }}
              complete={this.state.charterPartTwoComplete}
            >
              <CreateCharterPartTwo
                address={this.props.address}
                savedCharter={this.getSavedCharter()}
                saveCharter={this.saveCharter}
                stepisComplete={(isComplete: boolean) => this.setState({ charterPartTwoComplete: isComplete })}
              />
            </Step>
            <Step
              title={"Sign the Constitution"}
              renderButtons={(args: RenderButtonsArgs): JSX.Element => {
                return (
                  <>
                    <SecondaryButton size={buttonSizes.MEDIUM} onClick={args.goPrevious}>
                      Back
                    </SecondaryButton>
                    <Button onClick={args.goNext} size={buttonSizes.MEDIUM}>
                      Next
                    </Button>
                  </>
                );
              }}
            >
              <SignConstitution
                newsroomAdress={this.props.address}
                ipfs={this.props.ipfs}
                savedCharter={this.getSavedCharter()}
                saveCharter={this.saveCharter}
              />
            </Step>
            <Step title={"Apply to the Registry"}>
              <ApplyToTCR address={this.props.address} />
            </Step>
          </StepProcessTopNav>
          <button />
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
      !this.props.requiredNetwork!.includes(this.props.currentNetwork!) ||
      !this.props.account
    );
  };

  private hydrateNewsroom = async (address: EthAddress): Promise<void> => {
    await this.props.dispatch!(getNewsroom(address, this.props.civil!));
    this.props.dispatch!(getEditors(address, this.props.civil!));
  };

  private getSavedCharter = (): Partial<CharterData> | undefined => {
    if (this.props.savedCharter) {
      return this.props.savedCharter;
    }

    try {
      if (localStorage[this.props.address! + "|charter"]) {
        return JSON.parse(localStorage[this.props.address! + "|charter"]);
      }
    } catch (e) {
      console.error("Failed to retrieve charter from local storage:", e);
    }

    return undefined;
  };

  private saveCharter = (charter: Partial<CharterData>): void => {
    if (this.props.saveCharter) {
      this.props.saveCharter(charter);
      return;
    }

    try {
      localStorage[this.props.address! + "|charter"] = JSON.stringify(charter);
    } catch (e) {
      console.error("Failed to save charter to local storage:", e);
    }
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: NewsroomProps): NewsroomProps => {
  const { address } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  return {
    ...ownProps,
    name: newsroom.wrapper.data.name,
    owners: newsroom.wrapper.data.owners || [],
    editors: newsroom.editors || [],
  };
};

export const Newsroom = connect(mapStateToProps)(NewsroomComponent);
