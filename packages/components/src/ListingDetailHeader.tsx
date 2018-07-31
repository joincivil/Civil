import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colors, fonts } from "./styleConstants";
import { Button, buttonSizes } from "./Button";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "./ApplicationPhaseStatusLabels";

const ListingDetailOuter = styled.div`
  background: ${colors.primary.BLACK};
  display: flex;
  justify-content: center;
`;

const StyledListingDetailHeader = styled.div`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  padding: 24px 0 62px;
`;

const ListingDetailNewsroomName = styled.h1`
  font: 200 48px/40px ${fonts.SERIF};
  letter-spacing: -0.19px;
  margin: 0 0 18px;
`;

const ListingDetailNewsroomDek = styled.p`
  font: normal 21px/35px ${fonts.SANS_SERIF};
  margin: 0 0 35px;
`;

const GridRow = styled.div`
  display: flex;
  width: 1200px;
`;
const LeftShark = styled.div`
  width: 695px;
`;
const RightShark = styled.div`
  margin-left: 15px;
  width: 485px;
`;

const StyledRegistryLinkContainer = styled.div`
  padding: 0 0 43px;

  & a {
    color: ${colors.basic.WHITE}B3;
  }
`;

export interface ListingDetailHeaderProps {
  newsroomName: string;
  newsroomDescription: string;
  registryURL?: string;
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
    return (
      <ListingDetailOuter>
        <StyledListingDetailHeader>
          <GridRow>
            <LeftShark>
              {this.renderRegistryLink()}
              {this.renderPhaseLabel()}

              <ListingDetailNewsroomName>{this.props.newsroomName}</ListingDetailNewsroomName>
              <ListingDetailNewsroomDek>{this.props.newsroomDescription}</ListingDetailNewsroomDek>
              <Button size={buttonSizes.MEDIUM}>Support Our Work</Button>
            </LeftShark>

            <RightShark>
              <dl>
                <dt>Owner</dt>
                <dd>{this.props.owner}</dd>

                <dt>Unstaked Deposit</dt>
                <dd>{this.props.unstakedDeposit}</dd>
              </dl>
            </RightShark>
          </GridRow>
        </StyledListingDetailHeader>
      </ListingDetailOuter>
    );
  }

  private renderRegistryLink(): JSX.Element {
    let urlArg;
    let label = "Registry";
    if (this.props.registryURL) {
      if (this.props.isWhitelisted) {
        urlArg = "whitelisted";
        label = "Whitelisted Newsrooms";
      } else if (
        this.props.inChallengeCommitVotePhase ||
        this.props.isInAppealChallengeCommitPhase ||
        this.props.canBeWhitelisted ||
        this.props.canResolveChallenge ||
        this.props.inChallengeRevealPhase ||
        this.props.isInAppealChallengeRevealPhase ||
        this.props.canListingAppealChallengeBeResolved ||
        this.props.isAwaitingAppealChallenge
      ) {
        urlArg = "under-challenge";
        label = "Newsrooms Under Challenge";
      } else if (this.props.isRejected) {
        urlArg = "rejected";
        label = "Rejected Newsrooms";
      }

      const url = `${this.props.registryURL}/${urlArg}`;
      return (
        <StyledRegistryLinkContainer>
          <Link to={url}>&lt; Back to {label}</Link>
        </StyledRegistryLinkContainer>
      );
    }
    return <></>;
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
