import * as React from "react";
import { Link } from "react-router-dom";
import { CharterData } from "@joincivil/core";

import { NorthEastArrow, TwitterIcon, FacebookIcon } from "../icons";
import { buttonSizes } from "../Button";
import { StyledContentRow } from "../Layout";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "../ApplicationPhaseStatusLabels";
import { colors } from "../styleConstants";

import {
  ListingDetailOuter,
  StyledListingDetailHeader,
  StyledNewsroomIcon,
  StyledNewsroomLogo,
  StyledEthereumInfoToggle,
  ListingDetailNewsroomName,
  ListingDetailNewsroomDek,
  StyledRegistryLinkContainer,
  NewsroomLinks,
  VisitNewsroomButtonWrap,
  FollowNewsroom,
  FollowNewsroomHeading,
  FollowNewsroomLink,
  StyledListingURLButton,
} from "./ListingDetailHeaderStyledComponents";
import EthereumInfoModal from "./EthereumInfoModal";

export interface ListingDetailHeaderProps {
  listingAddress: string;
  logoURL?: string;
  newsroomName: string;
  charter?: CharterData;
  registryURL?: string;
  registryLinkText?: string;
  owner: string;
  etherscanBaseURL: string;
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
  ethInfoModalLearnMoreURL: string;
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
    const { charter, listingAddress, owner, etherscanBaseURL, ethInfoModalLearnMoreURL } = this.props;
    if (charter) {
      // TODO(toby) remove legacy `desc` after transition
      newsroomDescription = charter.tagline || (charter as any).desc;
      newsroomUrl = charter.newsroomUrl;
      logoURL = charter.logoUrl;
    }

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
                Ethereum Info
              </StyledEthereumInfoToggle>

              {this.state.isEthereumInfoVisible && (
                <EthereumInfoModal
                  listingAddress={listingAddress}
                  owner={owner}
                  etherscanBaseURL={etherscanBaseURL}
                  ethInfoModalLearnMoreURL={ethInfoModalLearnMoreURL}
                  handleCloseClick={this.toggleEthereumInfoDisplay}
                />
              )}

              <ListingDetailNewsroomDek>{newsroomDescription}</ListingDetailNewsroomDek>

              <NewsroomLinks>
                {newsroomUrl && (
                  <VisitNewsroomButtonWrap>
                    <StyledListingURLButton size={buttonSizes.MEDIUM_WIDE} href={newsroomUrl} target="_blank">
                      {newsroomUrl} <NorthEastArrow color={colors.basic.WHITE} />
                    </StyledListingURLButton>
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
