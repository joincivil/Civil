import * as React from "react";
import { EthAddress } from "@joincivil/core";
import { buttonSizes, InvertedButton } from "../Button";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import {
  StyledListingSummaryContainer,
  StyledListingSummaryTop,
  StyledListingSummarySection,
  StyledListingSummaryNewsroomName,
  ChallengeResultsContain,
  NewsroomIcon,
} from "./styledComponents";

export interface ListingSummaryRejectedComponentProps {
  listingAddress?: EthAddress;
  name?: string;
  listingDetailURL?: string;
}

export class ListingSummaryRejectedComponent extends React.Component<
  ListingSummaryRejectedComponentProps & ChallengeResultsProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingSummaryContainer>
        <StyledListingSummaryTop>
          <NewsroomIcon />
          <div>
            <StyledListingSummaryNewsroomName>{this.props.name}</StyledListingSummaryNewsroomName>
          </div>
        </StyledListingSummaryTop>

        <StyledListingSummarySection>
          <ChallengeResultsContain>
            <ChallengeResults
              totalVotes={this.props.totalVotes}
              votesFor={this.props.votesFor}
              votesAgainst={this.props.votesAgainst}
              percentFor={this.props.percentFor}
              percentAgainst={this.props.percentAgainst}
            />
          </ChallengeResultsContain>
          <InvertedButton size={buttonSizes.SMALL} to={this.props.listingDetailURL}>
            View Details
          </InvertedButton>
        </StyledListingSummarySection>
      </StyledListingSummaryContainer>
    );
  }
}
