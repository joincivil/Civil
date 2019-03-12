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
import { DataWrapper } from "./DataWrapper";
import { NewsroomProfile } from "./NewsroomProfile";
import { SmartContract } from "./SmartContract";
import { CivilContext } from "./CivilContext";
// import { CompleteYourProfile } from "./CompleteYourProfile";
// import { NameAndAddress } from "./NameAndAddress";
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
  showWelcome?: boolean;
  helpUrl?: string;
  helpUrlBase?: string;
  newsroomUrl?: string;
  logoUrl?: string;
  allSteps?: boolean; // @TODO temporary while excluding it from IRL newsroom use but including for testing in dapp
  initialStep?: number;
  renderUserSearch?(onSetAddress: any): JSX.Element;
  onNewsroomCreated?(address: EthAddress): void;
  onContractDeployStarted?(txHash: TxHash): void;
  getCmsUserDataForAddress?(address: EthAddress): Promise<CmsUserData>;
}

export interface NewsroomPropsWithRedux extends NewsroomExternalProps {
  charter: Partial<CharterData>;
  // owners: string[];
  // editors: string[];
  name?: string;
  newsroom?: any;
  userIsOwner?: boolean;
  userIsEditor?: boolean;
  userNotOnContract?: boolean;
  charterUri?: string;
}

// Final props are from GQL
export interface NewsroomProps extends NewsroomPropsWithRedux {
  grantRequested?: boolean;
  profileWalletAddress?: EthAddress;
  persistedCharter?: Partial<CharterData>;
  persistCharter(charter: Partial<CharterData>): Promise<any>;
}

export const NoteSection: StyledComponentClass<any, "p"> = styled.p`
  color: ${(props: { disabled: boolean }) => (props.disabled ? "#dcdcdc" : colors.accent.CIVIL_GRAY_3)};
`;

export const Wrapper: StyledComponentClass<any, "div"> = styled.div`
  max-width: 845px;
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

    this.props.dispatch!(addPersistCharter(this.debouncedPersistCharter));
    this.initCharter();

    if (this.props.civil) {
      if (this.props.address) {
        await this.hydrateNewsroom(this.props.address);
      }

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
          <StepProcessTopNavNoButtons
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
          </StepProcessTopNavNoButtons>
        </CivilContext.Provider>
      </>
    );
  }

  public renderSteps(): JSX.Element[] {
    return [
      <StepNoButtons
        title={"Registry Profile"}
        disabled={!this.props.userIsOwner}
        complete={this.state.charterPartOneComplete}
        key="createCharterPartOne"
      >
        <NewsroomProfile
          grantRequested={this.props.grantRequested}
          charter={this.props.charter}
          updateCharter={this.updateCharter}
        />
      </StepNoButtons>,
      <StepNoButtons title={"Smart Contract"} disabled={true} key="smartcontract">
        <SmartContract profileWalletAddress={this.props.profileWalletAddress} charter={this.props.charter} />
      </StepNoButtons>,
      <StepNoButtons title={"Tutorial"} disabled={true} key="tutorial">
        <div />
      </StepNoButtons>,
      <StepNoButtons title={"Civil Tokens"} disabled={true} key="ct">
        <div />
      </StepNoButtons>,
      <StepNoButtons title={"Apply to Registry"} disabled={true} key="atr">
        <div />
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

  private initCharter(): void {
    this.updateCharter(this.defaultCharterValues(this.props.persistedCharter || {}));
  }

  private hydrateNewsroom = async (address: EthAddress): Promise<void> => {
    await this.props.dispatch!(getNewsroom(address, this.props.civil!));
    this.props.dispatch!(getEditors(address, this.props.civil!));
    this.setRoles(address);
  };

  private setRoles = (address: EthAddress): void => {
    this.props.dispatch!(getIsOwner(address, this.props.civil!));
    this.props.dispatch!(getIsEditor(address, this.props.civil!));
  };

  private updateCharter = (charter: Partial<CharterData>): void => {
    this.props.dispatch!(updateCharter(this.props.address || "", charter));
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

const mapStateToProps = (state: StateWithNewsroom, ownProps: NewsroomExternalProps): NewsroomPropsWithRedux => {
  const { address } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  // const userIsOwner = newsroom.isOwner;
  // const userIsEditor = newsroom.isEditor;
  // const userNotOnContract = !!ownProps.address && userIsOwner === false && userIsEditor === false;
  // const editors = newsroom.editors ? newsroom.editors.toArray() : [];

  // const charterUri = newsroom.wrapper.data.charterHeader && newsroom.wrapper.data.charterHeader.uri;
  return {
    ...ownProps,
    // charterUri,
    newsroom: newsroom.newsroom,
    // name: newsroom.wrapper.data.name,
    // userIsOwner,
    // userIsEditor,
    // userNotOnContract,
    // owners: newsroom.wrapper.data.owners || [],
    // editors,
    charter: newsroom.charter || {},
  };
};

const NewsroomWithGqlData: React.SFC<NewsroomPropsWithRedux> = props => {
  return (
    <AuthWrapper>
      <DataWrapper>
        {({ profileWalletAddress, persistedCharter, persistCharter, grantRequested }) => {
          return (
            <NewsroomComponent
              {...props}
              profileWalletAddress={profileWalletAddress}
              persistCharter={persistCharter}
              persistedCharter={persistedCharter}
              grantRequested={grantRequested}
            />
          );
        }}
      </DataWrapper>
    </AuthWrapper>
  );
};

export const Newsroom = connect(mapStateToProps)(NewsroomWithGqlData);
