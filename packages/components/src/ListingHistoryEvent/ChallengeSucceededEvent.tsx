import * as React from "react";
import { ChallengeResults } from "../ChallengeResultsChart";
import { ChallengeCompletedEventProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent } from "./ListingHistoryEvent";

export const ChallengeSucceededEvent: React.StatelessComponent<ChallengeCompletedEventProps> = props => {
  const {
    totalVotes,
    votesFor,
    votesAgainst,
    percentFor,
    percentAgainst,
    didChallengeOriginallySucceed,
    appealRequested,
    appealGranted,
    appealChallengeTotalVotes,
    appealChallengeVotesFor,
    appealChallengeVotesAgainst,
    appealChallengePercentFor,
    appealChallengePercentAgainst,
    didAppealChallengeSucceed,
  } = props;

  let councilDecision;
  let councilContext;
  if (appealRequested) {
    if (appealGranted) {
      councilDecision = didChallengeOriginallySucceed ? "approve" : "reject";
      councilContext = "overturn";
    } else {
      councilDecision = didChallengeOriginallySucceed ? "reject" : "approve";
      councilContext = "uphold";
    }
  }
  return (
    <ListingHistoryEvent title={ListingEventTitles.CHALLENGE_SUCCEEDED} timestamp={props.timestamp}>
      <ChallengeResults
        headerText="Newsroom removed from registry"
        totalVotes={totalVotes}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor}
        percentAgainst={percentAgainst}
        didChallengeSucceed={didChallengeOriginallySucceed}
      />

      {councilDecision && (
        <p>
          <b>
            The Civil Council decided to {councilDecision} this Newsroom, {councilContext}ing the Civil Community's vote
          </b>
        </p>
      )}

      {appealChallengeTotalVotes && (
        <ChallengeResults
          noHeader={true}
          isAppealChallenge={true}
          totalVotes={appealChallengeTotalVotes!}
          votesFor={appealChallengeVotesFor!}
          votesAgainst={appealChallengeVotesAgainst!}
          percentFor={appealChallengePercentFor!}
          percentAgainst={appealChallengePercentAgainst!}
          didChallengeSucceed={didAppealChallengeSucceed}
        />
      )}
    </ListingHistoryEvent>
  );
};
