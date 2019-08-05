import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled, { ThemeProvider } from "styled-components";

import { EthAddress, CharterData, NewsroomInstance } from "@joincivil/core";
import { ButtonTheme, CivilContext, ICivilContext, OBSectionHeader, colors } from "@joincivil/components";

import { StateWithNewsroom } from "../reducers";
import {
  getNewsroom,
  updateCharter,
  // analyticsEvent,
} from "../actionCreators";
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
  // userIsOwner?: boolean;
  // userIsEditor?: boolean;
  // userNotOnContract?: boolean;
  // @TODO/tobek Ensure whitelisted or else send to apply to registry
}

export type NewsroomManagerProps = NewsroomManagerExternalProps & NewsroomManagerReduxProps & DispatchProp<any>;

export interface NewsroomManagerState {
  editMode?: boolean;
  dirty?: boolean;
}

const StyledHeader = styled(OBSectionHeader)`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-size: 20px;
  padding-top: 24px;
  margin-top: 25px;
  text-align: left;
`;

class NewsroomManagerComponent extends React.Component<NewsroomManagerProps, NewsroomManagerState> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  public static defaultProps: Partial<NewsroomManagerProps> = {
    theme: DEFAULT_THEME,
  };

  public context!: React.ContextType<typeof CivilContext>;

  constructor(props: NewsroomManagerProps) {
    super(props);
    this.state = {};
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
    await this.props.dispatch!(
      getNewsroom(this.props.newsroomAddress, this.context.civil!, this.props.publishedCharter),
    );
  }

  public render(): JSX.Element {
    if (!this.props.charter) {
      return <>Loading charter...</>;
    }
    return (
      <ThemeProvider theme={this.props.theme}>
        <Wrapper>
          <p>
            <a
              href="javascript:void 0"
              onClick={() => {
                this.setState({ editMode: !this.state.editMode, dirty: false });
              }}
            >
              {this.state.editMode ? "Discard Changes" : "Edit >>"}
            </a>
          </p>

          {this.state.dirty && this.props.newsroom && (
            <RepublishCharterNotice
              civil={this.context.civil!}
              charter={this.props.charter}
              newsroom={this.props.newsroom}
            />
          )}

          {this.state.editMode ? (
            <>
              <StyledHeader>Newsroom Details</StyledHeader>
              <NewsroomBio editMode={true} charter={this.props.charter} updateCharter={this.updateCharter} />
              <StyledHeader>Roster</StyledHeader>
              <AddRosterMember
                editMode={true}
                charter={this.props.charter}
                updateCharter={this.updateCharter}
                profileWalletAddress={"@TODO/tobek"}
              />
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

  private updateCharter = (charter: Partial<CharterData>) => {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }
    this.props.dispatch!(updateCharter(this.props.newsroomAddress || "", charter, true));
  };
}

const mapStateToProps = (
  state: StateWithNewsroom,
  ownProps: NewsroomManagerExternalProps,
): NewsroomManagerReduxProps => {
  const { newsroomAddress } = ownProps;
  const newsroom = state.newsrooms.get(newsroomAddress);
  const { user } = (state as any).networkDependent; // @TODO Should refactor to use a context here and elsewhere in this package that we pull this state from parent context

  console.log("newsroom", newsroom);
  console.log("user", user);

  return {
    ...ownProps,
    charter: newsroom && newsroom.charter,
    newsroom: newsroom && newsroom.newsroom,
  };
};

export const NewsroomManager = connect(mapStateToProps)(NewsroomManagerComponent);
