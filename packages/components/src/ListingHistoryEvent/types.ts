import { ChallengeResultsProps } from "../ChallengeResultsChart";

export interface ListingHistoryEventTimestampProps {
  timestamp: number;
}

export interface ListingHistoryEventDetailsProps {
  title: string;
  eventStyle?: string;
}

export interface ListingHistoryEventProps extends ListingHistoryEventTimestampProps, ListingHistoryEventDetailsProps {}

export interface ChallengeCompletedEventProps extends ListingHistoryEventTimestampProps, ChallengeResultsProps {
  appealRequested?: boolean;
  appealGranted?: boolean;
  appealChallengeTotalVotes?: string;
  appealChallengeVotesFor?: string;
  appealChallengeVotesAgainst?: string;
  appealChallengePercentFor?: string;
  appealChallengePercentAgainst?: string;
  didAppealChallengeSucceed?: boolean;
}
