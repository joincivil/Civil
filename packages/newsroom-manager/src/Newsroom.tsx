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
  DEFAULT_BUTTON_THEME,
  DEFAULT_CHECKBOX_THEME,
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
  addConstitutionHash,
  addConstitutionUri,
  fetchConstitution,
} from "./actionCreators";
import { AuthWrapper } from "./AuthWrapper";
import { CreateCharterPartOne } from "./CreateCharterPartOne";
import { CreateCharterPartTwo } from "./CreateCharterPartTwo";
import { Welcome } from "./Welcome";
import { CivilContext } from "./CivilContext";
import { CompleteYourProfile } from "./CompleteYourProfile";
import { NameAndAddress } from "./NameAndAddress";
import { SignConstitution } from "./SignConstitution";
import { ApplyToTCR } from "./ApplyToTCR";
import { ApplyToTCRPlaceholder } from "./ApplyToTCRPlaceholder";
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
  allSteps?: boolean; // @TODO temporary while excluding it from IRL newsroom use but including for testing in dapp
  authEnabled?: boolean; // @TODO temporary until we add apollo provider to WP plugin version or split this from that
  initialStep?: number;
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
    theme: {
      ...DEFAULT_BUTTON_THEME,
      ...DEFAULT_CHECKBOX_THEME,
    },
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
    if (typeof props.initialStep !== "undefined") {
      currentStep = props.initialStep;
    } else {
      try {
        if (localStorage.newsroomOnBoardingLastSeen) {
          currentStep = Number(localStorage.newsroomOnBoardingLastSeen);

          // @TODO Temporary cause of infinite loop in sign constitution step
          if (this.props.allSteps && currentStep === 4) {
            currentStep--;
          }
        }
      } catch (e) {
        console.error("Failed to load step index", e);
      }
    }

    this.state = {
      currentStep,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.getCmsUserDataForAddress) {
      this.props.dispatch!(addGetCmsUserDataForAddress(this.props.getCmsUserDataForAddress));
    }

    this.props.dispatch!(addPersistCharter(this.persistCharter));

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
      this.props.dispatch!(fetchConstitution(uri));
    }
  }

  public async componentWillReceiveProps(newProps: NewsroomProps & DispatchProp<any>): Promise<void> {
    if (newProps.address && !this.props.address) {
      await this.hydrateNewsroom(newProps.address);
    }
    if (this.props.newsroom && newProps.account !== this.props.account) {
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
            requiredNetwork: this.props.requiredNetwork || "rinkeby|ganache",
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
            {this.renderSteps()}
          </StepProcessTopNav>
        </CivilContext.Provider>
      </>
    );
  }

  public renderSteps(): JSX.Element[] {
    const baseSteps = [
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
        key="createNewsroom"
      >
        <NameAndAddress
          userIsOwner={this.props.userIsOwner}
          onNewsroomCreated={this.onNewsroomCreated}
          name={this.props.name}
          address={this.props.address}
          txHash={this.props.txHash}
          onContractDeployStarted={this.props.onContractDeployStarted}
        />
      </Step>,
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
        key="nameAndAddress"
      >
        <CompleteYourProfile
          userIsOwner={this.props.userIsOwner}
          userIsEditor={this.props.userIsEditor}
          address={this.props.address}
          renderUserSearch={this.props.renderUserSearch}
          profileWalletAddress={this.props.profileWalletAddress}
        />
      </Step>,
      <Step
        title={"Create Registry profile"}
        disabled={!this.props.address || !this.props.userIsOwner}
        renderButtons={(args: RenderButtonsArgs): JSX.Element => {
          return (
            <>
              <SecondaryButton size={buttonSizes.MEDIUM} onClick={args.goPrevious}>
                Back
              </SecondaryButton>
              <Button onClick={args.goNext} size={buttonSizes.MEDIUM} disabled={!this.state.charterPartOneComplete}>
                Next
              </Button>
            </>
          );
        }}
        complete={this.state.charterPartOneComplete}
        key="createCharterPartOne"
      >
        <CreateCharterPartOne
          address={this.props.address}
          charter={this.props.charter}
          updateCharter={this.updateCharter}
        />
      </Step>,
      <Step
        title={"Write your charter"}
        disabled={(!this.props.address && !this.state.charterPartOneComplete) || !this.props.userIsOwner}
        renderButtons={(args: RenderButtonsArgs): JSX.Element => {
          return (
            <>
              <SecondaryButton size={buttonSizes.MEDIUM} onClick={args.goPrevious}>
                Back
              </SecondaryButton>
              <Button onClick={args.goNext} size={buttonSizes.MEDIUM} disabled={!this.state.charterPartTwoComplete}>
                Next
              </Button>
            </>
          );
        }}
        complete={this.state.charterPartTwoComplete}
        key="createCharterPartTwo"
      >
        <CreateCharterPartTwo charter={this.props.charter} updateCharter={this.updateCharter} />
      </Step>,
    ];
    if (this.props.allSteps) {
      baseSteps.push(
        <Step
          title={"Sign the Constitution"}
          disabled={!this.props.address && !this.state.charterPartTwoComplete}
          complete={!!this.props.charterUri}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <SecondaryButton size={buttonSizes.MEDIUM} onClick={args.goPrevious}>
                  Back
                </SecondaryButton>
                <Button onClick={args.goNext} size={buttonSizes.MEDIUM} disabled={!this.props.charterUri}>
                  Next
                </Button>
              </>
            );
          }}
          key="signConstitution"
        >
          <SignConstitution
            newsroomAdress={this.props.address}
            ipfs={this.props.ipfs}
            charter={this.props.charter}
            updateCharter={this.updateCharter}
          />
        </Step>,
      );
    }
    baseSteps.push(
      <Step
        title={"Apply to the Registry"}
        disabled={(!this.props.address && !this.props.charterUri) || !this.props.userIsOwner}
        key="applyToRegistry"
      >
        {this.props.allSteps ? (
          <ApplyToTCR address={this.props.address} />
        ) : (
          <ApplyToTCRPlaceholder address={this.props.address} />
        )}
      </Step>,
    );
    return baseSteps;
  }

  public render(): JSX.Element {
    return (
      <ThemeProvider theme={this.props.theme}>
        <AuthWrapper authEnabled={this.props.authEnabled}>
          <Wrapper>
            {this.props.showWelcome && <Welcome helpUrl={this.props.helpUrl!} helpUrlBase={this.props.helpUrlBase!} />}
            {this.props.showWalletOnboarding && (
              <WalletOnboarding
                civil={this.props.civil}
                noProvider={!hasInjectedProvider()}
                requireAuth={this.props.authEnabled}
                notEnabled={this.props.civil && !this.props.metamaskEnabled}
                enable={this.props.enable}
                walletLocked={this.props.civil && this.props.metamaskEnabled && !this.props.account}
                wrongNetwork={
                  this.props.civil &&
                  !!this.props.requiredNetwork &&
                  this.props.currentNetwork !== this.props.requiredNetwork
                }
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
        </AuthWrapper>
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

  private async initCharter(): Promise<void> {
    this.updateCharter(this.defaultCharterValues(this.getCharterFromLocalStorage() || {}));

    if (this.props.getPersistedCharter) {
      try {
        const charter = await this.props.getPersistedCharter();
        if (charter) {
          this.updateCharter(this.defaultCharterValues(charter));
        }
      } catch (e) {
        console.error("Failed to load persisted charter", e);
      }
    }
  }

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
    await this.initCharter();
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
  const editors = newsroom.editors ? newsroom.editors.toArray() : [];

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
    editors,
    charter: newsroom.charter || {},
  };
};

export const Newsroom = connect(mapStateToProps)(NewsroomComponent);
