import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import {
  didChallengeOriginallySucceed,
  didAppealChallengeSucceed,
  isAppealAwaitingJudgment,
  doesChallengeHaveAppeal,
  ChallengeData,
  AppealChallengeData,
} from "@joincivil/core";
import {
  colors,
  VoteTypeSummaryRowProps as PartialChallengeResultsProps,
  CHALLENGE_RESULTS_VOTE_TYPES,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { State } from "../../redux/reducers";
import { fetchAndAddChallengeData } from "../../redux/actionCreators/challenges";

import {
  ChallengeContainerProps,
  AppealChallengeContainerProps,
  ChallengeContainerReduxProps,
} from "./HigherOrderComponents";

import { getAppealChallenge } from "../../selectors";

export interface WinningChallengeResultsProps {
  displayExplanation?: boolean;
}

interface AppealChallengeWinningResultsProps {
  appealChallenge: AppealChallengeData;
}

interface ChallengeWinningResultsProps {
  challenge: ChallengeData;
}

const StyledPartialChallengeResultsExplanation = styled.p`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 16px;
  font-weight: normal;
  line-height: 30px;
  margin: 17px 0;
`;

/**
 * Generates a HO-Component Container for My Dashboard Activity Item
 * presentation components.
 * Given a `challengeID`, this container fetches the challenge data from the Redux store
 * then extracts and passes props for rendering a Partial Challenge Results component, which
 * shows only the summary for the winning vote
 */
export const connectWinningChallengeResults = <
  TOriginalProps extends ChallengeContainerProps & AppealChallengeContainerProps
>(
  PresentationComponent: React.ComponentType<PartialChallengeResultsProps>,
) => {
  const AppealChallengeWinningResults: React.SFC<AppealChallengeWinningResultsProps> = props => {
    const { appealChallenge } = props;
    const totalVotes = appealChallenge && appealChallenge.poll.votesAgainst.add(appealChallenge.poll.votesFor);

    let voteType;
    let votesCount;
    let votesPercent;

    if (didAppealChallengeSucceed(appealChallenge)) {
      voteType = CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN;
      votesCount = getFormattedTokenBalance(appealChallenge.poll.votesAgainst);
      votesPercent = appealChallenge.poll.votesAgainst
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
    } else {
      voteType = CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD;
      votesCount = getFormattedTokenBalance(appealChallenge.poll.votesFor);
      votesPercent = appealChallenge.poll.votesFor
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
    }

    const viewProps = { voteType, votesCount, votesPercent };

    return <PresentationComponent {...viewProps} />;
  };

  const ChallengeWinningResults: React.SFC<ChallengeWinningResultsProps & WinningChallengeResultsProps> = props => {
    const { challenge } = props;
    const totalVotes = challenge && challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const appeal = challenge && challenge.appeal;
    const appealChallenge = appeal && appeal.appealChallenge;

    let voteType;
    let votesCount;
    let votesPercent;
    let explanation;
    let appealExplanation;
    let appealChallengeExplanation;
    let appealChallengeResultsEl = <></>;

    if (didChallengeOriginallySucceed(challenge)) {
      explanation = "The Civil Community voted to reject this Newsroom from The Civil Registry.";
      voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
      votesCount = getFormattedTokenBalance(challenge.poll.votesAgainst);
      votesPercent = challenge.poll.votesAgainst
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
    } else {
      explanation = "The Civil Community voted to accept this Newsroom to The Civil Registry.";
      voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMAIN;
      votesCount = getFormattedTokenBalance(challenge.poll.votesFor);
      votesPercent = challenge.poll.votesFor
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
    }

    let appealDecision;
    if (doesChallengeHaveAppeal(challenge) && appeal) {
      appealExplanation = "An appeal was requested contesting the results of the Community vote.";
      if (appeal.appealGranted) {
        appealDecision = didChallengeOriginallySucceed(challenge) ? "accepting" : "rejecting";
        appealExplanation = `The Civil Council reversed the result of the Community's vote, ${appealDecision} this Newsroom`;
      } else if (!appeal.appealGranted && !isAppealAwaitingJudgment(appeal)) {
        appealDecision = didChallengeOriginallySucceed(challenge) ? "rejecting" : "accepting";
        appealExplanation = `The Civil Council upheld the result of the Community's vote, ${appealDecision} this Newsroom`;
      } else if (isAppealAwaitingJudgment(appeal)) {
        appealExplanation = "The Civil Council is currently reviewing the results and the requested appeal.";
      }

      if (appealChallenge) {
        if (!appealChallenge.resolved) {
          appealChallengeExplanation =
            "The granted appeal was challenged by a member of the Community and is under a vote.";
        } else {
          const appealChallengeTotalVotes = appealChallenge.poll.votesAgainst.add(appealChallenge.poll.votesFor);

          let appealChallengeVoteType;
          let appealChallengeVotesCount;
          let appealChallengeVotesPercent;
          let appealChallengeDecision;
          if (didAppealChallengeSucceed(appealChallenge)) {
            appealChallengeDecision = didChallengeOriginallySucceed(challenge) ? "rejecting" : "accepting";
            appealChallengeExplanation = `The Civil Community overturned the Civil Council's decision with a supermajority vote, ${appealChallengeDecision} this Newsroom`;
            appealChallengeVoteType = CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN;
            appealChallengeVotesCount = getFormattedTokenBalance(appealChallenge.poll.votesAgainst);
            appealChallengeVotesPercent = appealChallenge.poll.votesAgainst
              .div(appealChallengeTotalVotes)
              .mul(100)
              .toFixed(0);
          } else {
            appealChallengeDecision = didChallengeOriginallySucceed(challenge) ? "accepting" : "rejecting";
            appealChallengeExplanation = `The Civil Community upheld the Civil Council's decision with a supermajority vote, ${appealChallengeDecision} this Newsroom`;
            appealChallengeVoteType = CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD;
            appealChallengeVotesCount = getFormattedTokenBalance(appealChallenge.poll.votesFor);
            appealChallengeVotesPercent = appealChallenge.poll.votesFor
              .div(appealChallengeTotalVotes)
              .mul(100)
              .toFixed(0);
          }

          appealChallengeResultsEl = (
            <PresentationComponent
              voteType={appealChallengeVoteType}
              votesCount={appealChallengeVotesCount}
              votesPercent={appealChallengeVotesPercent}
            />
          );
        }
      }
    }

    const viewProps = { voteType, votesCount, votesPercent };

    return (
      <>
        {props.displayExplanation && (
          <StyledPartialChallengeResultsExplanation>{explanation}</StyledPartialChallengeResultsExplanation>
        )}
        <PresentationComponent {...viewProps} />
        {props.displayExplanation && (
          <StyledPartialChallengeResultsExplanation>{appealExplanation}</StyledPartialChallengeResultsExplanation>
        )}
        {props.displayExplanation && (
          <StyledPartialChallengeResultsExplanation>
            {appealChallengeExplanation}
          </StyledPartialChallengeResultsExplanation>
        )}
        {props.displayExplanation && appealChallengeResultsEl}
      </>
    );
  };

  // @TODO(jon): Can we get rid of this additional react component and just use redux's connect? Just need to figure out the correct typing to use when not passing `challengeID` as a prop to the presentation component
  class HOChallengeResultsContainer extends React.Component<
    TOriginalProps &
      ChallengeContainerReduxProps &
      AppealChallengeContainerProps &
      WinningChallengeResultsProps &
      DispatchProp<any>
  > {
    public componentDidMount(): void {
      this.ensureHasChallengeData();
    }

    public componentDidUpdate(): void {
      this.ensureHasChallengeData();
    }

    public render(): JSX.Element | null {
      const { challengeData, appealChallengeData, displayExplanation } = this.props;

      if (appealChallengeData) {
        return <AppealChallengeWinningResults appealChallenge={appealChallengeData!} />;
      } else if (challengeData) {
        return <ChallengeWinningResults challenge={challengeData.challenge} displayExplanation={displayExplanation} />;
      }

      return <></>;
    }

    private ensureHasChallengeData = (): void => {
      if (this.props.challengeID && !this.props.challengeData && !this.props.challengeDataRequestStatus) {
        this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString()));
      }
    };
  }

  const mapStateToProps = (
    state: State,
    ownProps: ChallengeContainerProps & AppealChallengeContainerProps,
  ): ChallengeContainerReduxProps & AppealChallengeContainerProps & ChallengeContainerProps => {
    const { challenges, challengesFetching, user } = state.networkDependent;
    let challengeData;
    let appealChallengeData;
    let challengeDataRequestStatus;
    const challengeID = ownProps.challengeID;
    const appealChallengeID = ownProps.appealChallengeID;

    if (appealChallengeID) {
      appealChallengeData = getAppealChallenge(state, ownProps);
    } else if (challengeID) {
      challengeData = challenges.get(challengeID.toString());
    }

    if (challengeID) {
      challengeDataRequestStatus = challengesFetching.get(challengeID.toString());
    }

    const userAcct = user.account;

    return {
      ...ownProps,
      challengeData,
      appealChallengeData,
      challengeDataRequestStatus,
      user: userAcct.account,
    };
  };

  return connect(mapStateToProps)(HOChallengeResultsContainer);
};
