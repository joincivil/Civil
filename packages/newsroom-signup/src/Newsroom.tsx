import {
  ButtonTheme,
  colors,
  StepProcessTopNavNoButtons,
  StepNoButtons,
  WalletOnboardingV2,
  AuthApplicationEnum,
  DEFAULT_BUTTON_THEME,
  DEFAULT_CHECKBOX_THEME,
} from "@joincivil/components";
import { Civil, EthAddress, CharterData } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { debounce } from "lodash";
import styled, { StyledComponentClass, ThemeProvider } from "styled-components";
import {
  addGetCmsUserDataForAddress,
  addPersistCharter,
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
import { DataWrapper } from "./DataWrapper";
import { NewsroomProfile } from "./NewsroomProfile";
import { SmartContract } from "./SmartContract";
import { Tutorial } from "./Tutorial";
import { CivilContext } from "./CivilContext";
import { PurchaseTokens } from "./PurchaseTokens";
import { ApplyToTCRStep as ApplyToTCR } from "./ApplyToTCR/index";
import { StateWithNewsroom } from "./reducers";
import { CmsUserData } from "./types";
import { MutationFunc } from "react-apollo";

enum SECTION {
  PROFILE,
  CONTRACT,
  TUTORIAL,
  TOKENS,
  APPLY,
}
export enum STEP {
  PROFILE_BIO,
  PROFILE_ROSTER,
  PROFILE_CHARTER,
  PROFILE_SIGN,
  PROFILE_SO_FAR,
  PROFILE_GRANT,
  CONTRACT_GET_STARTED,
  CONTRACT_UNDERSTANDING_ETH,
  CONTRACT_CREATE,
  CONTRACT_ASSIGN,
  TUTORIAL,
  TOKENS,
  APPLY,
  APPLIED, // @HACK: API needs distinct step for "has applied to TCR" state, which is not how we built it. This extra pseuo-step doesn't affect rendering but makes it easy to package with the rest of API's step-depenent logic.
}
const STEP_TO_SECTION = {
  [STEP.PROFILE_BIO]: SECTION.PROFILE,
  [STEP.PROFILE_ROSTER]: SECTION.PROFILE,
  [STEP.PROFILE_CHARTER]: SECTION.PROFILE,
  [STEP.PROFILE_SIGN]: SECTION.PROFILE,
  [STEP.PROFILE_SO_FAR]: SECTION.PROFILE,
  [STEP.PROFILE_GRANT]: SECTION.PROFILE,
  [STEP.CONTRACT_GET_STARTED]: SECTION.CONTRACT,
  [STEP.CONTRACT_UNDERSTANDING_ETH]: SECTION.CONTRACT,
  [STEP.CONTRACT_CREATE]: SECTION.CONTRACT,
  [STEP.CONTRACT_ASSIGN]: SECTION.CONTRACT,
  [STEP.TUTORIAL]: SECTION.TUTORIAL,
  [STEP.TOKENS]: SECTION.TOKENS,
  [STEP.APPLY]: SECTION.APPLY,
};
const SECTION_STARTS = {
  [SECTION.PROFILE]: 0,
  [SECTION.CONTRACT]: 6,
  [SECTION.TUTORIAL]: 10,
  [SECTION.TOKENS]: 11,
  [SECTION.APPLY]: 12,
};

export interface NewsroomComponentState {
  currentStep: STEP;
  furthestStep: STEP;
  subscription?: any;
  charterPartOneComplete?: boolean;
  charterPartTwoComplete?: boolean;
  hasPublishedCharter?: boolean;
}

export interface IpfsObject {
  add(content: any, options?: { hash: string; pin: boolean }): Promise<[{ path: string; hash: string; size: number }]>;
}

export interface NewsroomExternalProps {
  newsroomAddress?: string;
  disabled?: boolean;
  account?: string;
  currentNetwork?: string;
  requiredNetwork?: string;
  requiredNetworkNiceName?: string;
  civil?: Civil;
  ipfs?: IpfsObject;
  theme?: ButtonTheme;
  showWelcome?: boolean;
  helpUrl?: string;
  helpUrlBase?: string;
  logoUrl?: string;
  renderUserSearch?(onSetAddress: any): JSX.Element;
  getCmsUserDataForAddress?(address: EthAddress): Promise<CmsUserData>;
}

export interface NewsroomReduxProps extends NewsroomExternalProps {
  charter: Partial<CharterData>;
  name?: string;
  newsroom?: any;
  userIsOwner?: boolean;
  userIsEditor?: boolean;
  userNotOnContract?: boolean;
  charterUri?: string;
}

export interface NewsroomGqlProps {
  newsroomAddress?: string;
  grantRequested?: boolean;
  grantApproved?: boolean;
  newsroomDeployTx?: EthAddress;
  profileWalletAddress?: EthAddress;
  persistedCharter?: Partial<CharterData>;
  savedStep: STEP;
  furthestStep: STEP;
  saveAddress: MutationFunc;
  saveSteps: MutationFunc;
  persistCharter(charter: Partial<CharterData>): Promise<any>;
}

export type NewsroomProps = NewsroomGqlProps & NewsroomReduxProps;

export const NoteSection: StyledComponentClass<any, "p"> = styled.p`
  color: ${(props: { disabled: boolean }) => (props.disabled ? "#dcdcdc" : colors.accent.CIVIL_GRAY_3)};
`;

export const Wrapper: StyledComponentClass<any, "div"> = styled.div`
  max-width: 720px;
  margin: auto;
  font-size: 14px;
`;

const ErrorP = styled.p`
  color: ${colors.accent.CIVIL_RED};
`;

class NewsroomComponent extends React.Component<NewsroomProps & DispatchProp<any>, NewsroomComponentState> {
  public static defaultProps = {
    theme: {
      ...DEFAULT_BUTTON_THEME,
      ...DEFAULT_CHECKBOX_THEME,
      primaryButtonTextTransform: "none",
      primaryButtonFontWeight: "bold",
      borderlessButtonSize: "14px",
    },
  };

  public static getDerivedStateFromProps(
    props: NewsroomProps,
    state: NewsroomComponentState,
  ): NewsroomComponentState | null {
    const decidedWhetherToApply = typeof props.grantRequested === "boolean";
    // @TODO/toby Confirm that when grant is rejected, it comes through as explicit `false` and not null or undefined
    const waitingOnGrant = props.grantRequested && typeof props.grantApproved !== "boolean";
    if (state.currentStep === STEP.PROFILE_GRANT && !waitingOnGrant && decidedWhetherToApply) {
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    }
    return null;
  }

  public container?: HTMLDivElement;

  private debouncedPersistCharter = debounce(this.props.persistCharter, 1000, { maxWait: 5000 });

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
    let currentStep = props.savedStep;
    if (currentStep === STEP.APPLIED) {
      // Not a real step, see its description above
      currentStep--;
    }
    this.state = {
      currentStep,
      furthestStep: props.furthestStep,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.getCmsUserDataForAddress) {
      this.props.dispatch!(addGetCmsUserDataForAddress(this.props.getCmsUserDataForAddress));
    }

    this.initCharter();
    this.props.dispatch!(addPersistCharter(this.debouncedPersistCharter));

    if (this.props.civil) {
      if (this.props.newsroomAddress) {
        await this.hydrateNewsroom(this.props.newsroomAddress);
      }

      if (!this.props.newsroomAddress && this.props.newsroomDeployTx) {
        const newsroom = await this.props.civil.newsroomFromFactoryTxHashUntrusted(this.props.newsroomDeployTx);
        await this.props.saveAddress({ variables: { input: newsroom.address } });
      }

      const tcr = await this.props.civil.tcrSingletonTrusted();
      const government = await tcr.getGovernment();
      const hash = await government.getConstitutionHash();
      const uri = await government.getConstitutionURI();
      this.props.dispatch!(addConstitutionHash(hash));
      this.props.dispatch!(addConstitutionUri(uri));
      this.props.dispatch!(fetchConstitution(uri));
    }

    this.saveStep(this.props.savedStep); // lazy way to update `lastSeen` - can't bear to make another separate mutation
  }

  public async componentDidUpdate(prevProps: NewsroomProps & DispatchProp<any>): Promise<void> {
    if (this.props.newsroomAddress && !prevProps.newsroomAddress) {
      await this.hydrateNewsroom(this.props.newsroomAddress);
    }
    if (prevProps.newsroom && this.props.account !== prevProps.account) {
      this.setRoles(this.props.newsroomAddress || prevProps.newsroomAddress!);
    }
  }

  public renderManager(): JSX.Element {
    return (
      <>
        {this.props.userNotOnContract && (
          <ErrorP>
            Your wallet address is not listed on your newsroom contract, so you are unable to make changes to it. Please
            contact a newsroom officer in order to be added.
          </ErrorP>
        )}
        <CivilContext.Provider
          value={{
            civil: this.props.civil,
            currentNetwork: this.props.currentNetwork,
            requiredNetwork: this.props.requiredNetwork || "rinkeby|ganache",
            account: this.props.account,
          }}
        >
          <div ref={(el: HTMLDivElement) => (this.container = el)}>
            <StepProcessTopNavNoButtons
              activeIndex={STEP_TO_SECTION[this.state.currentStep]}
              onActiveTabChange={this.navigateToSection}
            >
              {this.renderSteps()}
            </StepProcessTopNavNoButtons>
          </div>
        </CivilContext.Provider>
      </>
    );
  }

  public renderSteps(): JSX.Element[] {
    return [
      <StepNoButtons title={"Registry Profile"} complete={this.state.charterPartOneComplete} key="createCharterPartOne">
        <NewsroomProfile
          profileWalletAddress={this.props.profileWalletAddress}
          currentStep={this.state.currentStep - SECTION_STARTS[SECTION.PROFILE]}
          navigate={this.navigate}
          grantRequested={this.props.grantRequested}
          grantApproved={this.props.grantApproved}
          charter={this.props.charter}
          updateCharter={this.updateCharter}
        />
      </StepNoButtons>,
      <StepNoButtons title={"Smart Contract"} disabled={this.getDisabled(SECTION.CONTRACT)()} key="smartcontract">
        <SmartContract
          currentStep={this.state.currentStep - SECTION_STARTS[SECTION.CONTRACT]}
          navigate={this.navigate}
          profileWalletAddress={this.props.profileWalletAddress}
          charter={this.props.charter}
          userIsOwner={this.props.userIsOwner}
          newsroomAddress={this.props.newsroomAddress}
          newsroomDeployTxHash={this.props.newsroomDeployTx}
          updateCharter={this.updateCharter}
          newsroom={this.props.newsroom}
        />
      </StepNoButtons>,
      <StepNoButtons title={"Tutorial"} disabled={this.getDisabled(SECTION.TUTORIAL)()} key="tutorial">
        <Tutorial navigate={this.navigate} />
      </StepNoButtons>,
      <StepNoButtons title={"Civil Tokens"} disabled={this.getDisabled(SECTION.TOKENS)()} key="ct">
        <PurchaseTokens navigate={this.navigate} />
      </StepNoButtons>,
      <StepNoButtons title={"Apply to Registry"} disabled={this.getDisabled(SECTION.APPLY)()} key="atr">
        <ApplyToTCR
          navigate={this.navigate}
          newsroom={this.props.newsroom}
          address={this.props.newsroomAddress}
          civil={this.props.civil}
        />
      </StepNoButtons>,
    ];
  }

  public render(): JSX.Element {
    return (
      <ThemeProvider theme={this.props.theme}>
        <Wrapper>
          <WalletOnboardingV2
            civil={this.props.civil}
            wrongNetwork={!!this.props.requiredNetwork && this.props.currentNetwork !== this.props.requiredNetwork}
            requiredNetworkNiceName={this.props.requiredNetworkNiceName || this.props.requiredNetwork}
            metamaskWalletAddress={this.props.account}
            profileWalletAddress={this.props.profileWalletAddress}
            authApplicationType={AuthApplicationEnum.NEWSROOM}
          >
            {this.renderManager()}
          </WalletOnboardingV2>
        </Wrapper>
      </ThemeProvider>
    );
  }

  private getDisabled(section: SECTION): () => boolean {
    // @TODO/tobek Setting everything to enabled for now for testing, but we should work these out.
    const functions = {
      [SECTION.CONTRACT]: () => {
        return false;
      },
      [SECTION.TUTORIAL]: () => {
        return false;
      },
      [SECTION.TOKENS]: () => {
        return false;
      },
      [SECTION.APPLY]: () => {
        return false;
      },
    };

    return functions[section];
  }

  private navigateToSection = (newSection: SECTION): void => {
    if (newSection === STEP_TO_SECTION[this.state.currentStep]) {
      // Already on this section
      return;
    }

    let newStep = SECTION_STARTS[newSection]; // Go to first step in that section
    if (newSection === SECTION.PROFILE) {
      newStep = STEP.PROFILE_SO_FAR; // For this section, makes more sense to go to "your profile so far" step
    }
    if (this.container) {
      this.container.scrollIntoView(true);
    }
    this.saveStep(newStep);
    this.setState({ currentStep: newStep });
  };
  private navigate = (go: 1 | -1): void => {
    const newStep = this.state.currentStep + go;
    this.saveStep(newStep);
    if (newStep === STEP.APPLIED) {
      // Dummy step we don't actually update view for, but need to send to API.
      return;
    }
    if (this.container) {
      this.container.scrollIntoView(true);
    }
    this.setState({ currentStep: newStep });
  };
  private saveStep(step: STEP): void {
    const furthestStep = Math.max(step, this.state.furthestStep);
    this.setState({ furthestStep });
    this.props
      .saveSteps({
        variables: {
          input: {
            step,
            furthestStep,
            lastSeen: Math.floor(Date.now() / 1000),
          },
        },
      })
      .catch(err => {}); // easier than changing 10 functions to async
  }

  private initCharter(): void {
    this.updateCharter(this.props.persistedCharter || {}, true);
  }

  private hydrateNewsroom = async (address: EthAddress): Promise<void> => {
    await this.props.dispatch!(getNewsroom(address, this.props.civil!, this.props.persistedCharter || {}));
    this.props.dispatch!(getEditors(address, this.props.civil!));
    this.setRoles(address);
  };

  private setRoles = (address: EthAddress): void => {
    this.props.dispatch!(getIsOwner(address, this.props.civil!));
    this.props.dispatch!(getIsEditor(address, this.props.civil!));
  };

  private updateCharter = (charter: Partial<CharterData>, dontPersist?: boolean): void => {
    this.props.dispatch!(updateCharter(this.props.newsroomAddress || "", charter, dontPersist));
    this.checkCharterCompletion();
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: NewsroomExternalProps): NewsroomReduxProps => {
  const { newsroomAddress } = ownProps;
  const newsroom = state.newsrooms.get(newsroomAddress || "") || { wrapper: { data: {} } };
  return {
    ...ownProps,
    newsroom: newsroom.newsroom,
    charter: newsroom.charter || {},
  };
};

const NewsroomRedux = connect(mapStateToProps)(NewsroomComponent);

export const Newsroom: React.SFC<NewsroomExternalProps> = props => {
  return (
    <AuthWrapper>
      <DataWrapper>
        {(gqlProps: NewsroomGqlProps) => {
          return <NewsroomRedux {...props} {...gqlProps} />;
        }}
      </DataWrapper>
    </AuthWrapper>
  );
};
