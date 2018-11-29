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
import { debounce } from "lodash";
import styled, { StyledComponentClass, ThemeProvider } from "styled-components";
import {
  addGetCmsUserDataForAddress,
  addPersistCharter,
  updateNewsroom,
  getEditors,
  getIsOwner,
  getIsEditor,
  getNewsroom,
  updateCharter,
} from "./actionCreators";
import { CreateCharterPartOne } from "./CreateCharterPartOne";
import { CreateCharterPartTwo } from "./CreateCharterPartTwo";
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
  hasPublishedCharter?: boolean;
}

export interface IpfsObject {
  add(content: any, options?: { hash: string; pin: boolean }): Promise<[{ path: string; hash: string; size: number }]>;
}

export interface NewsroomExternalProps {
  address?: EthAddress;
  txHash?: TxHash;
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
  helpUrlBase?: string;
  profileUrl?: string;
  profileAddressSaving?: boolean;
  newsroomUrl?: string;
  logoUrl?: string;
  metamaskEnabled?: boolean;
  enable(): void;
  getPersistedCharter?(): Promise<Partial<CharterData> | void>;
  persistCharter?(charter: Partial<CharterData>): Promise<void>;
  saveAddressToProfile?(): Promise<void>;
  renderUserSearch?(onSetAddress: any): JSX.Element;
  onNewsroomCreated?(address: EthAddress): void;
  onContractDeployStarted?(txHash: TxHash): void;
  getCmsUserDataForAddress?(address: EthAddress): Promise<CmsUserData>;
}

export interface NewsroomProps extends NewsroomExternalProps {
  charter: Partial<CharterData>;
  owners: string[];
  editors: string[];
  name?: string;
  newsroom?: any;
  userIsOwner?: boolean;
  userIsEditor?: boolean;
  userNotOnContract?: boolean;
  charterUri?: string;
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

const Heading = styled(ManagerHeading)`
  color: ${(props: { disabled: boolean }) => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.BLACK)};
`;

class NewsroomComponent extends React.Component<NewsroomProps & DispatchProp<any>, NewsroomComponentState> {
  public static defaultProps = {
    theme: {},
  };

  private persistCharter = debounce(
    (charter: Partial<CharterData>): void => {
      if (this.props.persistCharter) {
        // We don't need to know when this finishes, but maybe some day we'd have a saving indicator or something.
        // tslint:disable-next-line: no-floating-promises
        this.props.persistCharter(charter);
        return;
      }

      try {
        localStorage[`civil:${this.props.address!}:charter`] = JSON.stringify(charter);
      } catch (e) {
        console.error("Failed to save charter to local storage:", e);
      }
    },
    1000,
    { maxWait: 2000 },
  );

  private checkCharterCompletion = debounce(
    () => {
      const charterPartOneComplete = !!(
        this.props.charter &&
        this.props.charter.logoUrl &&
        this.props.charter.newsroomUrl &&
        this.props.charter.tagline &&
        this.props.charter.roster &&
        this.props.charter.roster.length
      );

      let charterPartTwoComplete = false;
      const mission = this.props.charter.mission;
      if (mission) {
        charterPartTwoComplete = !!(
          mission.purpose &&
          mission.structure &&
          mission.revenue &&
          mission.encumbrances &&
          mission.miscellaneous
        );
      }

      this.setState({
        charterPartOneComplete,
        charterPartTwoComplete,
      });
    },
    1000,
    { maxWait: 2000 },
  );

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

    this.updateCharter(this.defaultCharterValues(this.getCharterFromLocalStorage() || {}));

    this.state = {
      currentStep,
    };

    if (props.getPersistedCharter) {
      props
        .getPersistedCharter()
        .then(charter => {
          if (charter) {
            this.updateCharter(this.defaultCharterValues(charter));
          }
        })
        .catch();
    }
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.getCmsUserDataForAddress) {
      this.props.dispatch!(addGetCmsUserDataForAddress(this.props.getCmsUserDataForAddress));
    }

    this.props.dispatch!(addPersistCharter(this.persistCharter));

    if (this.props.address && this.props.civil) {
      await this.hydrateNewsroom(this.props.address);
    }
  }

  public async componentWillReceiveProps(newProps: NewsroomProps & DispatchProp<any>): Promise<void> {
    if (newProps.address && !this.props.address) {
      await this.hydrateNewsroom(newProps.address);
    }
    if ((newProps.address || this.props.address) && newProps.account !== this.props.account) {
      this.setRoles(newProps.address || this.props.address!);
    }
  }

  public renderManager(): JSX.Element | null {
    if (!hasInjectedProvider()) {
      return null;
    }
    const disabled = this.isDisabled();
    return (
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
          <StepProcessTopNav
            activeIndex={this.state.currentStep}
            onActiveTabChange={(newIndex: number) => {
              try {
                localStorage.newsroomOnBoardingLastSeen = JSON.stringify(newIndex);
              } catch (e) {
                console.error("Failed to save step index", e);
              }
              this.setState({ currentStep: newIndex });
            }}
          >
            <Step
              title={"Create newsroom"}
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
                userIsOwner={this.props.userIsOwner}
                onNewsroomCreated={this.onNewsroomCreated}
                name={this.props.name}
                address={this.props.address}
                txHash={this.props.txHash}
                onContractDeployStarted={this.props.onContractDeployStarted}
              />
            </Step>
            <Step
              disabled={!this.props.address}
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
              complete={this.props.owners.length > 1 || !!this.props.editors.length || this.state.currentStep > 1}
            >
              <CompleteYourProfile
                userIsOwner={this.props.userIsOwner}
                userIsEditor={this.props.userIsEditor}
                address={this.props.address}
                renderUserSearch={this.props.renderUserSearch}
                profileWalletAddress={this.props.profileWalletAddress}
              />
            </Step>
            <Step
              title={"Create Registry profile"}
              disabled={!this.props.address || !this.props.userIsOwner}
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
                charter={this.props.charter}
                updateCharter={this.updateCharter}
              />
            </Step>
            <Step
              title={"Write your charter"}
              disabled={(!this.props.address && !this.state.charterPartOneComplete) || !this.props.userIsOwner}
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
              <CreateCharterPartTwo charter={this.props.charter} updateCharter={this.updateCharter} />
            </Step>
            <Step
              title={"Apply to the Registry"}
              disabled={(!this.props.address && !this.props.charterUri) || !this.props.userIsOwner}
            >
              <ApplyToTCR address={this.props.address} />
            </Step>
          </StepProcessTopNav>
        </CivilContext.Provider>
      </>
    );
  }

  public render(): JSX.Element {
    return (
      <ThemeProvider theme={this.props.theme}>
        <Wrapper>
          {this.props.showWelcome && <Welcome helpUrl={this.props.helpUrl!} helpUrlBase={this.props.helpUrlBase!} />}
          {this.props.showWalletOnboarding && (
            <WalletOnboarding
              noProvider={!hasInjectedProvider()}
              notEnabled={this.props.civil && !this.props.metamaskEnabled}
              enable={this.props.enable}
              walletLocked={this.props.civil && this.props.metamaskEnabled && !this.props.account}
              wrongNetwork={this.props.civil && this.props.currentNetwork !== this.props.requiredNetwork}
              requiredNetworkNiceName={this.props.requiredNetworkNiceName || this.props.requiredNetwork}
              metamaskWalletAddress={this.props.account}
              profileUrl={this.props.profileUrl}
              helpUrl={this.props.helpUrl}
              helpUrlBase={this.props.helpUrlBase}
              profileAddressSaving={this.props.profileAddressSaving}
              profileWalletAddress={this.props.profileWalletAddress}
              saveAddressToProfile={this.props.saveAddressToProfile}
            />
          )}

          {this.renderManager()}
        </Wrapper>
      </ThemeProvider>
    );
  }

  public onNewsroomCreated = async (result: any) => {
    await this.props.dispatch!(
      updateNewsroom(result.address, {
        wrapper: await result.getNewsroomWrapper(),
        newsroom: result,
      }),
    );
    if (this.props.onNewsroomCreated) {
      this.props.onNewsroomCreated(result.address);
    }
  };

  private isDisabled = (): boolean => {
    const onRequiredNetwork =
      !this.props.requiredNetwork || this.props.requiredNetwork.includes(this.props.currentNetwork!);
    return (
      this.props.disabled ||
      !this.props.civil ||
      !onRequiredNetwork ||
      !this.props.account ||
      !!this.props.userNotOnContract
    );
  };

  private hydrateNewsroom = async (address: EthAddress): Promise<void> => {
    await this.props.dispatch!(getNewsroom(address, this.props.civil!));
    this.props.dispatch!(getEditors(address, this.props.civil!));
    this.setRoles(address);
  };

  private setRoles = (address: EthAddress): void => {
    this.props.dispatch!(getIsOwner(address, this.props.civil!));
    this.props.dispatch!(getIsEditor(address, this.props.civil!));
  };

  private getCharterFromLocalStorage = (): Partial<CharterData> | undefined => {
    try {
      const key = `civil:${this.props.address!}:charter`;
      if (localStorage[key]) {
        return JSON.parse(localStorage[key]);
      }
    } catch (e) {
      console.error("Failed to retrieve charter from local storage:", e);
    }
    return undefined;
  };

  private updateCharter = (charter: Partial<CharterData>): void => {
    this.props.dispatch!(updateCharter(this.props.address!, charter));
    this.checkCharterCompletion();
  };

  /** Replace even empty string values for newsroom/logo URLs in case user has partially filled charter and later goes in to CMS and sets these values. */
  private defaultCharterValues = (charter: Partial<CharterData>): Partial<CharterData> => {
    const { newsroomUrl, logoUrl } = this.props;
    return {
      ...charter,
      newsroomUrl: charter.newsroomUrl || newsroomUrl,
      logoUrl: charter.logoUrl || logoUrl,
    };
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: NewsroomExternalProps): NewsroomProps => {
  const { address } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  const userIsOwner = newsroom.isOwner;
  const userIsEditor = newsroom.isEditor;
  const userNotOnContract = !!ownProps.address && userIsOwner === false && userIsEditor === false;

  const charterUri = newsroom.wrapper.data.charterHeader && newsroom.wrapper.data.charterHeader.uri;
  return {
    ...ownProps,
    charterUri,
    newsroom: newsroom.newsroom,
    name: newsroom.wrapper.data.name,
    userIsOwner,
    userIsEditor,
    userNotOnContract,
    owners: newsroom.wrapper.data.owners || [],
    editors: newsroom.editors || [],
    charter: newsroom.charter || {},
  };
};

export const Newsroom = connect(mapStateToProps)(NewsroomComponent);
