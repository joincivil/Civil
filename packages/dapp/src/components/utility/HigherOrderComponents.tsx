import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import BigNumber from "bignumber.js";
import { WrappedChallengeData } from "@joincivil/core";
import { ChallengeResultsProps, ListingHistoryEventTimestampProps } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";
import { State } from "../../reducers";

export interface ChallengeContainerProps {
  challengeID: BigNumber;
}

export interface ChallengeContainerReduxProps {
  challengeData?: WrappedChallengeData;
  challengeDataRequestStatus?: any;
}

/**
 * Generates a HO-Component Container for Challenge Succeeded/Failed Event
 * presentation components.
 * Given a `challengeID`, this container fetches the challenge data from the Redux store
 * then extracts and passes props for rendering a Challenge Results component
 */
export const connectChallengeResults = <
  TOriginalProps extends ListingHistoryEventTimestampProps & ChallengeContainerProps
>(
  PhaseCardComponent:
    | React.ComponentClass<TOriginalProps & ChallengeResultsProps>
    | React.StatelessComponent<TOriginalProps & ChallengeResultsProps>,
) => {
  const mapStateToProps = (
    state: State,
    ownProps: ListingHistoryEventTimestampProps & ChallengeContainerProps,
  ): ListingHistoryEventTimestampProps & ChallengeContainerReduxProps & ChallengeContainerProps => {
    const { challenges, challengesFetching } = state.networkDependent;
    let challengeData;
    const challengeID = ownProps.challengeID;
    if (challengeID) {
      challengeData = challenges.get(challengeID.toString());
    }
    let challengeDataRequestStatus;
    if (challengeID) {
      challengeDataRequestStatus = challengesFetching.get(challengeID.toString());
    }
    return {
      challengeData,
      challengeDataRequestStatus,
      ...ownProps,
    };
  };

  class HOChallengeResultsContainer extends React.Component<
    TOriginalProps & ChallengeContainerReduxProps & DispatchProp<any>
  > {
    public componentDidMount(): void {
      this.ensureHasChallengeData();
    }

    public componentDidUpdate(): void {
      this.ensureHasChallengeData();
    }

    public render(): JSX.Element | null {
      if (!this.props.challengeData) {
        return null;
      }

      const challenge = this.props.challengeData.challenge;
      const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
      const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
      const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
      const percentFor = challenge.poll.votesFor
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
      const percentAgainst = challenge.poll.votesAgainst
        .div(totalVotes)
        .mul(100)
        .toFixed(0);
      return (
        <>
          <PhaseCardComponent
            totalVotes={getFormattedTokenBalance(totalVotes)}
            votesFor={votesFor.toString()}
            votesAgainst={votesAgainst.toString()}
            percentFor={percentFor.toString()}
            percentAgainst={percentAgainst.toString()}
            {...this.props}
          />
        </>
      );
    }

    private ensureHasChallengeData = (): void => {
      if (!this.props.challengeData && !this.props.challengeDataRequestStatus) {
        this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString()));
      }
    };
  }

  return connect(mapStateToProps)(HOChallengeResultsContainer);
};
