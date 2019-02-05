import * as React from "react";
import { Link } from "react-router-dom";
import { CharterData } from "@joincivil/core";

import { NorthEastArrow, TwitterIcon, FacebookIcon } from "../icons";
import { DarkButton, buttonSizes } from "../Button";
import { StyledContentRow } from "../Layout";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "../ApplicationPhaseStatusLabels";
import { QuestionToolTip } from "../QuestionToolTip";
import { colors } from "../styleConstants";

import {
  ListingDetailOuter,
  StyledListingDetailHeader,
  StyledNewsroomIcon,
  StyledNewsroomLogo,
  StyledEthereumInfoToggle,
  StyledEthereumInfo,
  ListingDetailNewsroomName,
  ListingDetailNewsroomDek,
  StyledRegistryLinkContainer,
  NewsroomLinks,
  VisitNewsroomButtonWrap,
  StyledEthereumTerm,
  StyledEthereumValue,
  FollowNewsroom,
  FollowNewsroomHeading,
  FollowNewsroomLink,
  ExpandArrow,
} from "./ListingDetailHeaderStyledComponents";

export interface ListingDetailHeaderProps {
  listingAddress: string;
  logoURL?: string;
  newsroomName: string;
  charter?: CharterData;
  registryURL?: string;
  registryLinkText?: string;
  owner: string;
  unstakedDeposit: string;
  isWhitelisted?: boolean;
  isRejected?: boolean;
  isInApplication?: boolean;
  canBeChallenged?: boolean;
  canBeWhitelisted?: boolean;
  inChallengeCommitVotePhase?: boolean;
  inChallengeRevealPhase?: boolean;
  canResolveChallenge?: boolean;
  isAwaitingAppealJudgement?: boolean;
  isAwaitingAppealChallenge?: boolean;
  isInAppealChallengeCommitPhase?: boolean;
  isInAppealChallengeRevealPhase?: boolean;
  canListingAppealChallengeBeResolved?: boolean;
}

export interface ListingDetailHeaderState {
  isEthereumInfoVisible: boolean;
}

export class ListingDetailHeader extends React.Component<ListingDetailHeaderProps, ListingDetailHeaderState> {
  constructor(props: ListingDetailHeaderProps) {
    super(props);
    this.state = {
      isEthereumInfoVisible: false,
    };
  }

  public render(): JSX.Element {
    let newsroomDescription = "";
    let newsroomUrl = "";
    let logoURL;
    if (this.props.charter) {
      // TODO(toby) remove legacy `desc` after transition
      newsroomDescription = this.props.charter.tagline || (this.props.charter as any).desc;
      newsroomUrl = this.props.charter.newsroomUrl;
      logoURL = this.props.charter.logoUrl;
    }

    const toolTipTheme = {
      toolTipColorEnabled: colors.accent.CIVIL_GRAY_4,
    };

    return (
      <ListingDetailOuter>
        <StyledListingDetailHeader>
          {this.renderRegistryLink()}

          <StyledContentRow>
            <StyledNewsroomIcon>{logoURL && <StyledNewsroomLogo src={logoURL} />}</StyledNewsroomIcon>
            <div>
              {this.renderPhaseLabel()}

              <ListingDetailNewsroomName>{this.props.newsroomName}</ListingDetailNewsroomName>

              <StyledEthereumInfoToggle onClick={this.toggleEthereumInfoDisplay}>
                Ethereum Info <ExpandArrow isOpen={this.state.isEthereumInfoVisible} />
              </StyledEthereumInfoToggle>
              <StyledEthereumInfo isOpen={this.state.isEthereumInfoVisible}>
                <StyledEthereumTerm>
                  Contract Address
                  <QuestionToolTip
                    explainerText={"The Ethereum Address for this Newsroom's Smart Contract"}
                    positionBottom={true}
                    theme={toolTipTheme}
                  />
                </StyledEthereumTerm>
                <StyledEthereumValue>{this.props.listingAddress}</StyledEthereumValue>

                <StyledEthereumTerm>
                  Owner Address
                  <QuestionToolTip
                    explainerText={"The Ethereum Address for the Owner of this Newsroom's Smart Contract"}
                    positionBottom={true}
                    theme={toolTipTheme}
                  />
                </StyledEthereumTerm>
                <StyledEthereumValue>{this.props.owner}</StyledEthereumValue>
              </StyledEthereumInfo>

              <ListingDetailNewsroomDek>{newsroomDescription}</ListingDetailNewsroomDek>

              <NewsroomLinks>
                {newsroomUrl && (
                  <VisitNewsroomButtonWrap>
                    <DarkButton size={buttonSizes.MEDIUM_WIDE} href={newsroomUrl} target="_blank">
                      {newsroomUrl} <NorthEastArrow color={colors.basic.WHITE} />
                    </DarkButton>
                  </VisitNewsroomButtonWrap>
                )}

                {this.props.charter &&
                  this.props.charter.socialUrls &&
                  (this.props.charter.socialUrls.facebook || this.props.charter.socialUrls.twitter) && (
                    <FollowNewsroom>
                      <FollowNewsroomHeading>Follow Newsroom</FollowNewsroomHeading>
                      {this.props.charter.socialUrls.twitter && (
                        <FollowNewsroomLink href={this.props.charter.socialUrls.twitter} target="_blank">
                          <TwitterIcon />
                        </FollowNewsroomLink>
                      )}
                      {this.props.charter.socialUrls.facebook && (
                        <FollowNewsroomLink href={this.props.charter.socialUrls.facebook} target="_blank">
                          <FacebookIcon />
                        </FollowNewsroomLink>
                      )}
                    </FollowNewsroom>
                  )}
              </NewsroomLinks>
            </div>
          </StyledContentRow>
        </StyledListingDetailHeader>
      </ListingDetailOuter>
    );
  }

  private toggleEthereumInfoDisplay = (): void => {
    this.setState({ isEthereumInfoVisible: !this.state.isEthereumInfoVisible });
  };

  private renderRegistryLink(): JSX.Element | undefined {
    if (!this.props.registryURL) {
      return;
    }
    const label = this.props.registryLinkText || "Registry";
    return (
      <StyledRegistryLinkContainer>
        <Link to={this.props.registryURL}>&lt; Back to {label}</Link>
      </StyledRegistryLinkContainer>
    );
  }

  private renderPhaseLabel = (): JSX.Element | undefined => {
    if (this.props.isInApplication) {
      return <AwaitingApprovalStatusLabel />;
    } else if (this.props.inChallengeCommitVotePhase || this.props.isInAppealChallengeCommitPhase) {
      return <CommitVoteStatusLabel />;
    } else if (this.props.inChallengeRevealPhase || this.props.isInAppealChallengeRevealPhase) {
      return <RevealVoteStatusLabel />;
    } else if (
      this.props.canBeWhitelisted ||
      this.props.canResolveChallenge ||
      this.props.canListingAppealChallengeBeResolved
    ) {
      return <ReadyToCompleteStatusLabel />;
    } else if (this.props.isAwaitingAppealJudgement) {
      return <AwaitingDecisionStatusLabel />;
    } else if (this.props.isAwaitingAppealChallenge) {
      return <AwaitingAppealChallengeStatusLabel />;
    }
    return;
  };
}
