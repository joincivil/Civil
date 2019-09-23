import * as qs from "querystring";
import { BigNumber } from "@joincivil/typescript-types";
import { Parameters } from "@joincivil/utils";
import {
  ButtonTheme,
  colors,
  StepProcessTopNavNoButtons,
  StepNoButtons,
  WalletOnboardingV2,
  AuthApplicationEnum,
} from "@joincivil/components";
import { Civil, EthAddress, CharterData, NewsroomInstance } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { debounce } from "lodash";
import styled, { ThemeProvider } from "styled-components";
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
  navigateStep,
  reachedNewStep,
  analyticsEvent,
} from "./actionCreators";
import { AuthWrapper } from "./AuthWrapper";
import { DataWrapper } from "./DataWrapper";
import { NewsroomProfile } from "./NewsroomProfile";
import { SmartContract } from "./SmartContract";
import { Tutorial } from "./Tutorial";
import { PurchaseTokens } from "./PurchaseTokens";
import { RepublishCharterNotice } from "./RepublishCharterNotice";
import { ApplyToTCRStep as ApplyToTCR } from "./ApplyToTCR/index";
import { StateWithNewsroom } from "./reducers";
import { CmsUserData } from "./types";
import { Wrapper, DEFAULT_THEME } from "./styledComponents";
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
  forceStep?: STEP;
  renderUserSearch?(onSetAddress: any): JSX.Element;
  getCmsUserDataForAddress?(address: EthAddress): Promise<CmsUserData>;
}

export interface NewsroomReduxProps extends NewsroomExternalProps {
  charter: Partial<CharterData>;
  name?: string;
  newsroom?: NewsroomInstance;
  userIsOwner?: boolean;
  userIsEditor?: boolean;
  userNotOnContract?: boolean;
  charterUri?: string;
  waitingOnGrant?: boolean;
  completedGrantFlow?: boolean;
}

export interface NewsroomGqlProps {
  newsroomAddress?: string;
  grantRequested?: boolean;
  grantApproved?: boolean;
  tcrApplyTx?: string;
  newsroomDeployTx?: EthAddress;
  profileWalletAddress?: EthAddress;
  persistedCharter?: Partial<CharterData>;
  savedStep: STEP;
  furthestStep: STEP;
  quizStatus?: string;
  saveAddress: MutationFunc;
  saveSteps: MutationFunc;
  persistCharter(charter: Partial<CharterData>): Promise<any>;
}

export type NewsroomProps = NewsroomGqlProps & NewsroomReduxProps & DispatchProp<any>;

export const NoteSection = styled.p`
  color: ${(props: { disabled: boolean }) => (props.disabled ? "#dcdcdc" : colors.accent.CIVIL_GRAY_3)};
`;

const ErrorP = styled.p`
  color: ${colors.accent.CIVIL_RED};
`;

class NewsroomComponent extends React.Component<NewsroomProps, NewsroomComponentState> {
  public static defaultProps = {
    theme: DEFAULT_THEME,
  };

  public static getDerivedStateFromProps(
    props: NewsroomProps,
    state: NewsroomComponentState,
  ): NewsroomComponentState | null {
    if (state.currentStep === STEP.PROFILE_GRANT && props.completedGrantFlow) {
      props.dispatch!(
        analyticsEvent({
          action: "Auto advancing past grant step",
          label: props.charter && props.charter.name,
          value: props.grantRequested ? 1 : 0,
        }),
      );
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    }
    return null;
  }

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
    this.state = {
      currentStep: this.determineInitialStep(),
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
      // if they left before the apply step happened and they are stuck on 12
      if (this.props.tcrApplyTx && this.props.savedStep === STEP.APPLY) {
        await this.props.civil.awaitReceipt(this.props.tcrApplyTx);
        this.navigate(1);
      }

      const tcr = await this.props.civil.tcrSingletonTrusted();
      const government = await tcr.getGovernment();
      const hash = await government.getConstitutionHash();
      const uri = await government.getConstitutionURI();
      this.props.dispatch!(addConstitutionHash(hash));
      this.props.dispatch!(addConstitutionUri(uri));
      this.props.dispatch!(fetchConstitution(uri));
    }

    this.saveStep(this.props.savedStep, true); // lazy way to update `lastSeen` - can't bear to make another separate mutation
  }

  public async componentDidUpdate(prevProps: NewsroomProps): Promise<void> {
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
        <StepProcessTopNavNoButtons
          activeIndex={STEP_TO_SECTION[this.state.currentStep]}
          onActiveTabChange={this.navigateToSection}
          contentPrepend={this.renderRepublishCharter()}
          fullyControlledIndex={true}
        >
          {this.renderSteps()}
        </StepProcessTopNavNoButtons>
      </>
    );
  }

  public renderSteps(): JSX.Element[] {
    return [
      <StepNoButtons title={"Registry Profile"} complete={this.state.charterPartOneComplete} key="createCharterPartOne">
        <NewsroomProfile
          profileWalletAddress={this.props.profileWalletAddress}
          currentStep={this.state.currentStep - SECTION_STARTS[SECTION.PROFILE]}
          furthestStep={this.props.furthestStep}
          navigate={this.navigate}
          grantRequested={this.props.grantRequested}
          waitingOnGrant={this.props.waitingOnGrant}
          completedGrantFlow={this.props.completedGrantFlow}
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
        <PurchaseTokens navigate={this.navigate} grantApproved={this.props.grantApproved} />
      </StepNoButtons>,
      <StepNoButtons title={"Apply to Registry"} disabled={this.getDisabled(SECTION.APPLY)()} key="atr">
        <ApplyToTCR
          navigate={this.navigate}
          newsroom={this.props.newsroom!}
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

  private determineInitialStep(): STEP {
    let currentStep = this.props.savedStep;
    if (currentStep === STEP.APPLIED) {
      // Not a real step, see its description above
      currentStep--;
    }

    if (qs.parse(document.location.search.substr(1)).purchased) {
      // Just been redirected back from token purchase
      currentStep = STEP.TOKENS;
    }

    if (this.props.forceStep) {
      currentStep = this.props.forceStep;
    }

    if (this.props.waitingOnGrant) {
      // We've run out of fields in GA event so need to use numeric "value" to pass this info in:
      let grantInfo;
      if (this.props.grantApproved === true) {
        grantInfo = 1;
      } else if (this.props.grantApproved === false) {
        grantInfo = 2;
      } else {
        grantInfo = 0;
      }

      this.props.dispatch!(
        analyticsEvent({
          action: "Pushed back to grant step",
          label: this.props.charter && this.props.charter.name,
          value: grantInfo,
        }),
      );
      currentStep = STEP.PROFILE_GRANT;
    }

    currentStep = this.backtrackSteps(currentStep);

    return currentStep;
  }

  /** Handle situation where user used nav to jump too far ahead in step process before we put in disable checks - they should be backtracked back to where they need to be. */
  private backtrackSteps(step: STEP): STEP {
    const section = STEP_TO_SECTION[step];
    if (this.getDisabled(section)()) {
      return this.backtrackSteps(step - 1);
    }
    return step;
  }

  private renderRepublishCharter(): JSX.Element | undefined {
    if (!this.props.newsroomAddress || STEP_TO_SECTION[this.state.currentStep] !== SECTION.PROFILE) {
      return;
    }

    return (
      <RepublishCharterNotice civil={this.props.civil!} charter={this.props.charter} newsroom={this.props.newsroom!} />
    );
  }

  private getDisabled(section: SECTION): () => boolean {
    const functions = {
      [SECTION.PROFILE]: () => {
        return false;
      },
      [SECTION.CONTRACT]: () => {
        return !this.props.completedGrantFlow;
      },
      [SECTION.TUTORIAL]: () => {
        return !this.props.newsroomAddress;
      },
      [SECTION.TOKENS]: () => {
        return !this.props.newsroomAddress || !this.props.quizStatus;
      },
      [SECTION.APPLY]: () => {
        // Really it should be disabled if user's token balance is insufficient, but not worth rigging that up - this step handles insufficient tokens ok
        return !this.props.newsroomAddress || !this.props.quizStatus;
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
      if (this.props.waitingOnGrant) {
        newStep = STEP.PROFILE_GRANT;
      } else {
        newStep = STEP.PROFILE_SO_FAR; // For this section, makes more sense to go to "your profile so far" step
      }
    }
    newStep = Math.min(this.state.furthestStep, newStep); // Don't let them advance past where they have gotten through next button

    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.saveStep(newStep);
    this.setState({ currentStep: newStep });
  };
  private navigate = (go: 1 | -1): void => {
    let newStep = this.state.currentStep + go;
    this.saveStep(newStep);
    if (newStep === STEP.APPLIED) {
      // Dummy step we don't actually update view for, but need to send to API.
      return;
    } else if (newStep === STEP.PROFILE_GRANT && this.props.completedGrantFlow) {
      newStep += go; // skip the step and go one further in the requested direction
    }
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.setState({ currentStep: newStep });
  };
  private saveStep(step: STEP, doNotTrack?: boolean): void {
    if (!doNotTrack) {
      this.props.dispatch!(navigateStep(step));
      if (step > this.state.furthestStep) {
        this.props.dispatch!(reachedNewStep(step));
      }
    }

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

const mapStateToProps = (state: StateWithNewsroom, ownProps: NewsroomGqlProps): NewsroomReduxProps => {
  const { newsroomAddress } = ownProps;
  const newsroom = state.newsrooms.get(newsroomAddress || "") || { wrapper: { data: {} } };
  const { user, parameters } = (state as any).networkDependent; // @TODO Should refactor to use a context here and elsewhere in this package that we pull this state from parent context

  let hasMinDeposit;
  let waitingOnGrant = !!ownProps.grantRequested && typeof ownProps.grantApproved !== "boolean";
  if (user && user.account && user.account.balance && parameters && parameters[Parameters.minDeposit]) {
    const userBalance = new BigNumber(user.account.balance);
    const minDeposit = new BigNumber(parameters[Parameters.minDeposit]);
    hasMinDeposit = userBalance.gte(minDeposit);
    waitingOnGrant = waitingOnGrant && !hasMinDeposit;
  }
  const completedGrantFlow = hasMinDeposit || (typeof ownProps.grantRequested === "boolean" && !waitingOnGrant);

  return {
    ...ownProps,
    waitingOnGrant,
    completedGrantFlow,
    newsroom: newsroom.newsroom,
    charter: newsroom.charter || {},
  };
};

const NewsroomRedux = connect(mapStateToProps)(NewsroomComponent);

export const Newsroom: React.FunctionComponent<NewsroomExternalProps> = props => {
  return (
    <AuthWrapper>
      <DataWrapper>
        {(gqlProps: NewsroomGqlProps) => {
          // @ts-ignore Type 'ButtonTheme | undefined' is not assignable to type
          return <NewsroomRedux {...props} {...gqlProps} />;
        }}
      </DataWrapper>
    </AuthWrapper>
  );
};
