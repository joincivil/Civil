import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import {
  didChallengeOriginallySucceed,
  didAppealChallengeSucceed,
  didParamPropChallengeSucceed,
  ChallengeData,
  AppealChallengeData,
  ParamPropChallengeData,
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

import { getAppealChallenge, getProposalChallengeByChallengeID } from "../../selectors";

export interface WinningChallengeResultsProps {
  displayExplanation?: boolean;
}

interface AppealChallengeWinningResultsProps {
  appealChallenge: AppealChallengeData;
}

interface ChallengeWinningResultsProps {
  challenge: ChallengeData;
}

interface ProposalChallengeWinningResultsProps {
  challenge: ParamPropChallengeData;
}

const StyledPartialChallengeResultsExplanation = styled.p`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 16px;
  font-weight: normal;
  line-height: 30px;
  margin: 17px 0;
`;

export const getChallengeViewProps = (challenge: ChallengeData) => {
  const totalVotes = challenge && challenge.poll.votesAgainst.add(challenge.poll.votesFor);

  let voteType;
  let votesCount;
  let votesPercent;

  if (didChallengeOriginallySucceed(challenge)) {
    voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
    votesCount = getFormattedTokenBalance(challenge.poll.votesAgainst);
    votesPercent = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
  } else {
    voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMAIN;
    votesCount = getFormattedTokenBalance(challenge.poll.votesFor);
    votesPercent = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
  }
  return { voteType, votesCount, votesPercent };
};

export const getAppealChallengeViewProps = (appealChallenge: AppealChallengeData) => {
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
  return { voteType, votesCount, votesPercent };
};

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
  const AppealChallengeWinningResults: React.FunctionComponent<AppealChallengeWinningResultsProps> = props => {
    const { appealChallenge } = props;

    const viewProps = getAppealChallengeViewProps(appealChallenge);

    return <PresentationComponent {...viewProps} />;
  };

  const ChallengeWinningResults: React.FunctionComponent<
    ChallengeWinningResultsProps & WinningChallengeResultsProps
  > = props => {
    const { challenge } = props;
    const viewProps = getChallengeViewProps(challenge);

    return (
      <>
        <PresentationComponent {...viewProps} />
      </>
    );
  };

  const ProposalChallengeWinningResults: React.FunctionComponent<
    ProposalChallengeWinningResultsProps & WinningChallengeResultsProps
  > = props => {
    const { challenge } = props;
    const totalVotes = challenge && challenge.poll.votesAgainst.add(challenge.poll.votesFor);

    let voteType;
    let votesCount;
    let votesPercent;
    let explanation;

    if (didParamPropChallengeSucceed(challenge)) {
      explanation = "The Civil Community voted to reject this proposal from The Civil Registry Parameters.";
      voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
      votesCount = getFormattedTokenBalance(challenge.poll.votesAgainst);
      votesPercent = challenge.poll.votesAgainst
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
    } else {
      explanation = "The Civil Community voted to accept this proposal to The Civil Registry Parameters.";
      voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMAIN;
      votesCount = getFormattedTokenBalance(challenge.poll.votesFor);
      votesPercent = challenge.poll.votesFor
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
    }

    const viewProps = { voteType, votesCount, votesPercent };

    return (
      <>
        {props.displayExplanation && (
          <StyledPartialChallengeResultsExplanation>{explanation}</StyledPartialChallengeResultsExplanation>
        )}
        <PresentationComponent {...viewProps} />
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
      const { challengeData, appealChallengeData, proposalChallengeData, displayExplanation } = this.props;

      if (proposalChallengeData) {
        return (
          <ProposalChallengeWinningResults challenge={proposalChallengeData!} displayExplanation={displayExplanation} />
        );
      } else if (appealChallengeData) {
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
    let proposalChallengeData;
    let challengeDataRequestStatus;
    const challengeID = ownProps.challengeID;
    const appealChallengeID = ownProps.appealChallengeID;

    if (ownProps.isProposalChallenge) {
      proposalChallengeData = getProposalChallengeByChallengeID(state, ownProps);
    } else if (appealChallengeID) {
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
      proposalChallengeData,
      challengeDataRequestStatus,
      user: userAcct.account,
    };
  };

  return connect(mapStateToProps)(HOChallengeResultsContainer);
};
