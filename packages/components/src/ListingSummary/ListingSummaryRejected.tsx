import * as React from "react";
import { EthAddress } from "@joincivil/core";
import { buttonSizes, InvertedButton } from "../Button";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import {
  StyledListingSummaryContainer,
  StyledListingSummaryHed,
  NewsroomIcon,
  StyledListingSummaryNewsroomName,
  MetaItem,
  MetaLabel,
  MetaValue,
  StyledListingCardSection,
} from "./styledComponents";

export interface ListingSummaryRejectedComponentProps {
  address?: EthAddress;
  name?: string;
  owners?: EthAddress[];
  description?: string;
  listingDetailURL?: string;
}

export class ListingSummaryRejectedComponent extends React.Component<
  ListingSummaryRejectedComponentProps & ChallengeResultsProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingSummaryContainer>
        <StyledListingSummaryHed>
          <NewsroomIcon />
          <div>
            <StyledListingSummaryNewsroomName>{this.props.name}</StyledListingSummaryNewsroomName>
            <MetaItem>
              <MetaLabel>Owner</MetaLabel>
              <MetaValue title={this.props.owners![0]}>{this.props.owners![0]}</MetaValue>
            </MetaItem>
          </div>
        </StyledListingSummaryHed>

        <StyledListingCardSection>
          <ChallengeResults
            totalVotes={"100000"}
            votesFor={"73000"}
            votesAgainst={"27000"}
            percentFor={"73"}
            percentAgainst={"27"}
          />
        </StyledListingCardSection>

        <StyledListingCardSection>
          <InvertedButton size={buttonSizes.SMALL} to={this.props.listingDetailURL}>
            View Details
          </InvertedButton>
        </StyledListingCardSection>
      </StyledListingSummaryContainer>
    );
  }
}
