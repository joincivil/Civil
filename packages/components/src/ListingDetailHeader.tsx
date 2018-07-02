import * as React from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { colors, fonts } from "./styleConstants";
import { Button, buttonSizes } from "./Button";
import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
} from "./ApplicationPhaseStatusLabels";

const ListingDetailOuter = styled.div`
  background: ${colors.primary.BLACK};
  display: flex;
  justify-content: center;
`;

const StyledListingDetailHeader = styled.div`
  color: ${colors.basic.WHITE};
  padding: 78px 0 62px;
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

export interface ListingDetailHeaderProps {
  newsroomName: string;
  newsroomDescription: string;
  owner: string;
  unstakedDeposit: BigNumber;
  isInApplication?: boolean;
  inChallengePhase?: boolean;
  inRevealPhase?: boolean;
}

export class ListingDetailHeader extends React.Component<ListingDetailHeaderProps> {
  public render(): JSX.Element {
    return (
      <ListingDetailOuter>
        <StyledListingDetailHeader>
          <GridRow>
            <LeftShark>
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
                <dd>{getFormattedTokenBalance(this.props.unstakedDeposit)}</dd>
              </dl>
            </RightShark>
          </GridRow>
        </StyledListingDetailHeader>
      </ListingDetailOuter>
    );
  }

  private renderPhaseLabel = (): JSX.Element | undefined => {
    if (this.props.isInApplication) {
      return <AwaitingApprovalStatusLabel />;
    } else if (this.props.inChallengePhase) {
      return <CommitVoteStatusLabel />;
    } else if (this.props.inRevealPhase) {
      return <RevealVoteStatusLabel />;
    }
    return;
  };
}
