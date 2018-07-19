import * as React from "react";
import { ListingDetailPhaseCardComponentProps, ChallengeResultsProps, AppealDecisionProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
  FormCopy,
} from "./styledComponents";
import { buttonSizes, Button } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";
import { ChallengeResults } from "./ChallengeResults";

export interface AppealChallengeResultsProps {
  appealChallengeTotalVotes: string;
  appealChallengeVotesFor: string;
  appealChallengeVotesAgainst: string;
  appealChallengePercentFor: string;
  appealChallengePercentAgainst: string;
}

export class AppealChallengeResolveCard extends React.Component<
  ListingDetailPhaseCardComponentProps & ChallengeResultsProps & AppealDecisionProps & AppealChallengeResultsProps
> {
  public render(): JSX.Element {
    const decisionText = this.props.appealGranted ? "grant" : "dismiss";
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Challenge Granted Appeal</StyledPhaseDisplayName>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <ChallengeResults
            totalVotes={this.props.totalVotes}
            votesFor={this.props.votesFor}
            votesAgainst={this.props.votesAgainst}
            percentFor={this.props.percentFor}
            percentAgainst={this.props.percentAgainst}
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>Civil Council Decision</CTACopy>
          <FormCopy>
            The Civil Council has decided to {decisionText} the appeal. Read more about their methodology and how
            they’ve come to this decision.
          </FormCopy>
          <Button size={buttonSizes.MEDIUM}>Read about this decision</Button>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <ChallengeResults
            headerText="Appeal Challenge Results"
            totalVotes={this.props.appealChallengeTotalVotes}
            votesFor={this.props.appealChallengeVotesFor}
            votesAgainst={this.props.appealChallengeVotesAgainst}
            percentFor={this.props.appealChallengePercentFor}
            percentAgainst={this.props.appealChallengePercentAgainst}
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <TransactionInvertedButton
            transactions={this.props.transactions!}
            modalContentComponents={this.props.modalContentComponents}
          >
            Resolve Appeal Challenge
          </TransactionInvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
