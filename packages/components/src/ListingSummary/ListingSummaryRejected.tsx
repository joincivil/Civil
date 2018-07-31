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
  address?: EthAddress;
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
              totalVotes={"100000"}
              votesFor={"73000"}
              votesAgainst={"27000"}
              percentFor={"73"}
              percentAgainst={"27"}
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
