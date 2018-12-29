import * as React from "react";
import { Link } from "react-router-dom";
import { CharterData } from "@joincivil/core";

import { TwitterIcon, FacebookIcon } from "../icons";
import { Button, buttonSizes } from "../Button";
import { StyledContentRow } from "../Layout";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "../ApplicationPhaseStatusLabels";

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

export class ListingDetailHeader extends React.Component<ListingDetailHeaderProps> {
  public render(): JSX.Element {
    let newsroomDescription = "";
    let newsroomUrl = "";
    if (this.props.charter) {
      // TODO(toby) remove legacy `desc` after transition
      newsroomDescription = this.props.charter.tagline || (this.props.charter as any).desc;
      newsroomUrl = this.props.charter.newsroomUrl;
    }

    return (
      <ListingDetailOuter>
        <StyledListingDetailHeader>
          {this.renderRegistryLink()}
          {this.renderPhaseLabel()}

          <StyledContentRow>
            <StyledNewsroomIcon>
              {this.props.logoURL && <StyledNewsroomLogo src={this.props.logoURL} />}
            </StyledNewsroomIcon>
            <div>
              <ListingDetailNewsroomName>{this.props.newsroomName}</ListingDetailNewsroomName>

              <StyledEthereumInfoToggle>Ethereum Info</StyledEthereumInfoToggle>
              <dl>
                <dt>Contract Address</dt>
                <dd>{this.props.listingAddress}</dd>

                <dt>Owner Address</dt>
                <dd>{this.props.owner}</dd>
              </dl>

              <ListingDetailNewsroomDek>{newsroomDescription}</ListingDetailNewsroomDek>

              <NewsroomLinks>
                {newsroomUrl && (
                  <VisitNewsroomButtonWrap>
                    <Button size={buttonSizes.MEDIUM_WIDE} href={newsroomUrl} target="_blank">
                      Visit Newsroom 🡭
                    </Button>
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
