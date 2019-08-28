import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Prompt } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import { EthAddress, CharterData, NewsroomInstance } from "@joincivil/core";
import {
  ButtonTheme,
  CivilContext,
  ICivilContext,
  OBSectionHeader,
  colors,
  MetaMaskLogoButton,
  LoadingMessage,
  LoadingIndicator,
  metaMaskLoginImgUrl,
} from "@joincivil/components";

import { StateWithNewsroom } from "../reducers";
import { getNewsroom, updateCharter } from "../actionCreators";
import { Wrapper, DEFAULT_THEME } from "../styledComponents";
import { RepublishCharterNotice } from "../RepublishCharterNotice";
import { NewsroomBio } from "../NewsroomProfile/NewsroomBio";
import { AddRosterMember } from "../NewsroomProfile/AddRosterMembers";
import { CharterQuestions } from "../NewsroomProfile/CharterQuestions";
import { ApplicationSoFarPage } from "../NewsroomProfile/ApplicationSoFarPage";

export interface NewsroomManagerExternalProps {
  newsroomAddress: EthAddress;
  publishedCharter: Partial<CharterData>;
  theme?: ButtonTheme;
}

export interface NewsroomManagerReduxProps {
  charter?: Partial<CharterData>;
  newsroom?: NewsroomInstance;
}

export type NewsroomManagerProps = NewsroomManagerExternalProps & NewsroomManagerReduxProps & DispatchProp<any>;

export interface NewsroomManagerState {
  web3Enabled: boolean; // @TODO This state logic should be lifted to something dapp-wide, or reuse the wallet onboarding component
  editMode?: boolean;
  dirty?: boolean;
  saving?: boolean;
  lastSavedCharter?: Partial<CharterData>;
}

const StyledHeader = styled(OBSectionHeader)`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-size: 20px;
  padding-top: 24px;
  margin-top: 25px;
  text-align: left;
`;

const SaveNoticeWrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  width: 100%;
  z-index: 1;
`;
const SaveNotice = styled(RepublishCharterNotice)`
  font-size: 14px;
  line-height: 18px;
  margin: 0;
  max-width: 900px;
  margin: auto;
`;
const SaveButtonWrapper = styled.div`
  display: inline-block;
  margin: 8px auto 0;
`;

const DEFAULT_DIRTY_MESSAGE = "Are you sure you want to leave this page? Your changes have not been saved.";

class NewsroomManagerComponent extends React.Component<NewsroomManagerProps, NewsroomManagerState> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  public static defaultProps: Partial<NewsroomManagerProps> = {
    theme: DEFAULT_THEME,
  };

  public context!: React.ContextType<typeof CivilContext>;

  constructor(props: NewsroomManagerProps) {
    super(props);
    this.state = { web3Enabled: false };
  }

  public async componentDidMount(): Promise<void> {
    if (!this.props.newsroomAddress || !this.props.publishedCharter) {
      // Type safety should ensure this doesn't happen, but I don't trust everything to be lined up all the way up component tree, and if undefined this page will be borked with blank charter, user might try to add stuff back in, republish... so just in case:
      throw Error("NewsroomManagerComponent: newsroomAddress and/or publishedCharter props missing");
    }
    if (!this.context.civil) {
      // Pretty certain this will have been instantiated by the time this component is mounted, but if that's ever not the case I want to catch it!
      throw Error("NewsroomManagerComponent: civil instance not yet instantiated in context");
    }

    window.addEventListener("beforeunload", this.unsavedWarning);

    this.context.civil.currentProviderEnable().then(() => this.setState({ web3Enabled: true }));
    await this.props.dispatch!(
      getNewsroom(this.props.newsroomAddress, this.context.civil!, this.props.publishedCharter),
    );
  }

  public componentWillUnmount(): void {
    // Remove "are you sure you want to leave?" prompt.
    window.removeEventListener("beforeunload", this.unsavedWarning);
  }

  public render(): JSX.Element {
    if (!this.props.charter) {
      return <LoadingMessage>Loading charter</LoadingMessage>;
    }
    if (!this.state.web3Enabled) {
      // @TODO This logic should be lifted to something dapp-wide, and with a less hacky UI of course - or reuse wallet onboarding component
      return (
        <LoadingMessage>
          <p>Connecting to your Ethereum wallet</p>
          <div>
            <img src={metaMaskLoginImgUrl} style={{ width: 255, marginTop: 8 }} />
          </div>
        </LoadingMessage>
      );
    }
    return (
      <ThemeProvider theme={this.props.theme}>
        <Wrapper>
          <Prompt when={!!this.unsavedWarning()} message={DEFAULT_DIRTY_MESSAGE} />

          <p>
            {this.state.saving ? (
              <>
                Saving <LoadingIndicator inline={true} />
              </>
            ) : (
              <a
                href="javascript:void 0"
                onClick={() => (this.state.editMode ? this.discardChanges() : this.enableEditMode())}
              >
                {this.state.editMode ? (this.state.dirty ? "Discard Changes" : "Cancel") : "Edit >"}
              </a>
            )}
          </p>

          {this.renderSaveNotice()}

          {this.state.editMode ? (
            <>
              <StyledHeader>Newsroom Details</StyledHeader>
              <NewsroomBio editMode={true} charter={this.props.charter} updateCharter={this.updateCharter} />
              <StyledHeader>Roster</StyledHeader>
              <AddRosterMember editMode={true} charter={this.props.charter} updateCharter={this.updateCharter} />
              <StyledHeader>Charter</StyledHeader>
              <CharterQuestions editMode={true} charter={this.props.charter} updateCharter={this.updateCharter} />
            </>
          ) : (
            <ApplicationSoFarPage editMode={true} charter={this.props.charter} />
          )}
        </Wrapper>
      </ThemeProvider>
    );
  }

  private renderSaveNotice = (): JSX.Element | null => {
    if (!this.state.dirty || !this.props.charter || !this.props.newsroom) {
      return null;
    }
    return (
      <SaveNoticeWrapper>
        <SaveNotice
          civil={this.context.civil!}
          charter={this.props.charter}
          newsroom={this.props.newsroom}
          introCopy={
            "Once you have finished making changes you must save them. This will open your wallet to process the transaction. You are republishing your charter alongside your newsroom smart contract"
          }
          transactionButtonComponent={(props: any) => (
            <SaveButtonWrapper>
              <MetaMaskLogoButton onClick={props.onClick}>Save Changes</MetaMaskLogoButton>
            </SaveButtonWrapper>
          )}
          onTxStart={this.saveInProgress}
          onTxComplete={this.saveComplete}
        />
      </SaveNoticeWrapper>
    );
  };

  private updateCharter = (charter: Partial<CharterData>) => {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }
    this.props.dispatch!(updateCharter(this.props.newsroomAddress || "", charter, true));
  };

  private enableEditMode = () => {
    this.setState({ editMode: true });
  };
  private discardChanges = () => {
    this.updateCharter(this.state.lastSavedCharter || this.props.publishedCharter);
    this.setState({ editMode: false, dirty: false });
  };

  private saveInProgress = () => {
    this.setState({ editMode: false, saving: true });
  };
  private saveComplete = () => {
    this.setState({ dirty: false, saving: false, lastSavedCharter: { ...this.props.charter } });
  };

  private unsavedWarning = (event?: BeforeUnloadEvent): boolean | undefined => {
    if (this.state.dirty && !this.state.saving) {
      if (event) {
        event.preventDefault(); // specification
        event.returnValue = ""; // some Chrome
      }
      return true; // what most browsers actually use
    }
    return undefined;
  };
}

const mapStateToProps = (
  state: StateWithNewsroom,
  ownProps: NewsroomManagerExternalProps,
): NewsroomManagerReduxProps => {
  const { newsroomAddress } = ownProps;
  const newsroom = state.newsrooms.get(newsroomAddress);

  return {
    ...ownProps,
    charter: newsroom && newsroom.charter,
    newsroom: newsroom && newsroom.newsroom,
  };
};

export const NewsroomManager = connect(mapStateToProps)(NewsroomManagerComponent);
