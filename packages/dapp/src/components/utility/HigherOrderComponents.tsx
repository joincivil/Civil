import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { EthAddress, ListingWrapper, WrappedChallengeData } from "@joincivil/core";
import {
  colors,
  VoteTypeSummaryRowProps as PartialChallengeResultsProps,
  CHALLENGE_RESULTS_VOTE_TYPES,
  ChallengeResultsProps,
  ChallengePhaseProps,
  ProgressBarCountdownProps,
  PHASE_TYPE_NAMES,
  PHASE_TYPE_LABEL,
  PHASE_TYPE_FLAVOR_TEXT,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { setupRejectedListingLatestChallengeSubscription } from "../../redux/actionCreators/listings";
import { fetchAndAddChallengeData } from "../../redux/actionCreators/challenges";
import { makeGetLatestChallengeSucceededChallengeID } from "../../selectors";
import { State } from "../../redux/reducers";
import { Query } from "react-apollo";
import { transformGraphQLDataIntoChallenge, CHALLENGE_QUERY } from "../../helpers/queryTransformations";
import { getChallengeResultsProps } from "../../helpers/transforms";

const StyledPartialChallengeResultsHeader = styled.p`
  & > span {
    color: ${colors.primary.CIVIL_GRAY_2};
    font-weight: normal;
    font-size: 0.9em;
  }
`;

export interface GraphQLizableComponentProps {
  useGraphQL: boolean;
}

export interface ListingContainerProps {
  listingAddress: EthAddress;
}

export interface ChallengeContainerProps {
  challengeID?: BigNumber | string;
}

export interface ChallengeContainerReduxProps {
  challengeData?: WrappedChallengeData;
  challengeDataRequestStatus?: any;
}

export interface PhaseCountdownTimerProps {
  phaseType: string;
  listing?: ListingWrapper;
  challenge?: WrappedChallengeData;
}

export interface PhaseCountdownReduxProps {
  parameters: any;
  govtParameters: any;
}

/**
 * Generates a HO-Component Container for Challenge Succeeded/Failed Event
 * presentation components.
 * Given a `challengeID`, this container fetches the challenge data from the Redux store
 * then extracts and passes props for rendering a Challenge Results component
 */
export const connectChallengeResults = <TOriginalProps extends ChallengeContainerProps>(
  PresentationComponent:
    | React.ComponentClass<TOriginalProps & ChallengeResultsProps>
    | React.StatelessComponent<TOriginalProps & ChallengeResultsProps>,
) => {
  const mapStateToProps = (
    state: State,
    ownProps: TOriginalProps,
  ): TOriginalProps & ChallengeContainerReduxProps & GraphQLizableComponentProps => {
    const { challenges, challengesFetching } = state.networkDependent;
    const { useGraphQL } = state;
    let challengeData;
    let challengeID = ownProps.challengeID;
    if (challengeID) {
      challengeID = (challengeID.toString && challengeID.toString()) || challengeID;
      challengeData = challenges.get(challengeID as string);
    }
    let challengeDataRequestStatus;
    if (challengeID) {
      challengeDataRequestStatus = challengesFetching.get(challengeID as string);
    }
    // Can't use spread here b/c of TS issue with spread and generics
    // https://github.com/Microsoft/TypeScript/pull/13288
    // tslint:disable-next-line:prefer-object-spread
    return Object.assign({}, ownProps, { challengeID, challengeData, challengeDataRequestStatus, useGraphQL });
  };

  class HOChallengeResultsContainer extends React.Component<
    TOriginalProps & ChallengeContainerReduxProps & GraphQLizableComponentProps & DispatchProp<any>
  > {
    public componentDidMount(): void {
      this.ensureHasChallengeData();
    }

    public componentDidUpdate(): void {
      this.ensureHasChallengeData();
    }

    public render(): JSX.Element | null {
      if (this.props.useGraphQL) {
        return (
          <Query query={CHALLENGE_QUERY} variables={{ challengeID: this.props.challengeID }}>
            {({ loading, error, data }: any): JSX.Element | null => {
              if (loading) {
                return null;
              }
              if (error) {
                return null;
              }
              const challenge = transformGraphQLDataIntoChallenge(data.challenge);
              const challengeResultsProps = getChallengeResultsProps(challenge!);
              return (
                <>
                  <PresentationComponent {...challengeResultsProps} {...this.props} />
                </>
              );
            }}
          </Query>
        );
      } else {
        if (!this.props.challengeData) {
          return null;
        }

        const challengeResultsProps = getChallengeResultsProps(this.props.challengeData.challenge);

        return (
          <>
            <PresentationComponent {...challengeResultsProps} {...this.props} />
          </>
        );
      }
    }

    private ensureHasChallengeData = (): void => {
      if (
        !this.props.useGraphQL &&
        this.props.challengeID &&
        !this.props.challengeData &&
        !this.props.challengeDataRequestStatus
      ) {
        this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID! as string));
      }
    };
  }

  return connect(mapStateToProps)(HOChallengeResultsContainer);
};

/**
 * Generates a HO-Component Container for My Dashboard Activity Item
 * presentation components.
 * Given a `challengeID`, this container fetches the challenge data from the Redux store
 * then extracts and passes props for rendering a Partial Challenge Results component, which
 * shows only the summary for the winning vote
 */
export const connectWinningChallengeResults = <TOriginalProps extends ChallengeContainerProps>(
  PresentationComponent: React.ComponentType<PartialChallengeResultsProps>,
) => {
  const mapStateToProps = (
    state: State,
    ownProps: ChallengeContainerProps,
  ): ChallengeContainerReduxProps & ChallengeContainerProps => {
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

  // @TODO(jon): Can we get rid of this additional react component and just use redux's connect? Just need to figure out the correct typing to use when not passing `challengeID` as a prop to the presentation component
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

      let label;
      let voteType;
      let votesCount;
      let votesPercent;

      if (challenge.poll.votesAgainst.greaterThan(challenge.poll.votesFor)) {
        label = (
          <>
            Challenge Succeeded: Newsroom removed from Registry<br />
            <span>Challenge ID: {this.props.challengeData.challengeID.toString()}</span>
          </>
        );
        voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMOVE;
        votesCount = getFormattedTokenBalance(challenge.poll.votesAgainst);
        votesPercent = challenge.poll.votesAgainst
          .div(totalVotes)
          .mul(100)
          .toFixed(0);
      } else {
        label = (
          <>
            Challenge Failed: Newsroom remains in Registry<br />
            <span>Challenge ID: {this.props.challengeData.challengeID.toString()}</span>
          </>
        );
        voteType = CHALLENGE_RESULTS_VOTE_TYPES.REMAIN;
        votesCount = getFormattedTokenBalance(challenge.poll.votesFor);
        votesPercent = challenge.poll.votesFor
          .div(totalVotes)
          .mul(100)
          .toFixed(0);
      }

      const props = { voteType, votesCount, votesPercent };

      return (
        <>
          <StyledPartialChallengeResultsHeader>{label}</StyledPartialChallengeResultsHeader>
          <PresentationComponent {...props} />
        </>
      );
    }

    private ensureHasChallengeData = (): void => {
      if (this.props.challengeID && !this.props.challengeData && !this.props.challengeDataRequestStatus) {
        this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString()));
      }
    };
  }

  return connect(mapStateToProps)(HOChallengeResultsContainer);
};

/**
 * Generates a HO-Component Container for My Dashboard Activity Item
 * presentation components.
 * Given a `endTime` and `paramName`, this container fetches the phase length from
 * the parameterizer and passes the props for rendering a Phase Countdown Progress
 * bar to the presentation component
 */
export const connectPhaseCountdownTimer = <TOriginalProps extends ChallengeContainerProps>(
  PresentationComponent: React.ComponentType<ProgressBarCountdownProps>,
) => {
  const mapStateToProps = (
    state: State,
    ownProps: PhaseCountdownTimerProps,
  ): PhaseCountdownTimerProps & PhaseCountdownReduxProps => {
    const { parameters, govtParameters } = state.networkDependent;

    return {
      parameters,
      govtParameters,
      ...ownProps,
    };
  };

  class HOContainer extends React.Component<PhaseCountdownTimerProps & PhaseCountdownReduxProps & DispatchProp<any>> {
    public render(): JSX.Element | null {
      let displayLabel: string | React.SFC = "";
      let flavorText;
      let endTime = 0;
      let totalSeconds = 0;

      switch (this.props.phaseType) {
        case PHASE_TYPE_NAMES.CHALLENGE_COMMIT_VOTE:
          displayLabel = PHASE_TYPE_LABEL[this.props.phaseType];
          flavorText = PHASE_TYPE_FLAVOR_TEXT[this.props.phaseType];
          if (this.props.challenge) {
            endTime = this.props.challenge.challenge.poll.commitEndDate.toNumber();
          }
          totalSeconds = this.props.parameters.commitStageLen;
          break;
        case PHASE_TYPE_NAMES.CHALLENGE_REVEAL_VOTE:
          displayLabel = PHASE_TYPE_LABEL[this.props.phaseType];
          flavorText = PHASE_TYPE_FLAVOR_TEXT[this.props.phaseType];
          if (this.props.challenge) {
            endTime = this.props.challenge.challenge.poll.revealEndDate.toNumber();
          }
          totalSeconds = this.props.parameters.revealStageLen;
          break;
        case PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_REQUEST:
          displayLabel = PHASE_TYPE_LABEL[this.props.phaseType];
          flavorText = PHASE_TYPE_FLAVOR_TEXT[this.props.phaseType];
          if (this.props.challenge) {
            endTime = this.props.challenge.challenge.requestAppealExpiry.toNumber();
          }
          totalSeconds = this.props.parameters.revealStageLen;
          break;
      }

      const props = {
        displayLabel,
        flavorText,
        endTime,
        totalSeconds,
      };

      return <PresentationComponent {...props} />;
    }
  }

  return connect(mapStateToProps)(HOContainer);
};

/**
 * Generates a HO-Component Container for that gets the results latest Challenge Succeeded
 * and passes those results to a Presentation Component -- most likely a component that
 * displays a Rejected listing
 */
export const connectLatestChallengeSucceededResults = <TOriginalProps extends ListingContainerProps>(
  PresentationComponent:
    | React.ComponentClass<TOriginalProps & ChallengeResultsProps>
    | React.StatelessComponent<TOriginalProps & ChallengeResultsProps>,
) => {
  const makeMapStateToProps = () => {
    const getLatestChallengeSucceededChallengeID = makeGetLatestChallengeSucceededChallengeID();

    const mapStateToProps = (
      state: State,
      ownProps: TOriginalProps & ChallengeContainerProps,
    ): TOriginalProps & ChallengeContainerProps & ChallengeContainerReduxProps => {
      const { challenges, challengesFetching } = state.networkDependent;
      const challengeID = getLatestChallengeSucceededChallengeID(state, ownProps);
      let challengeData;
      let challengeDataRequestStatus;
      if (challengeID) {
        challengeData = challenges.get(challengeID.toString());
        challengeDataRequestStatus = challengesFetching.get(challengeID.toString());
      }
      // Can't use spread here b/c of TS issue with spread and generics
      // https://github.com/Microsoft/TypeScript/pull/13288
      // tslint:disable-next-line:prefer-object-spread
      return Object.assign({}, { challengeData, challengeID, challengeDataRequestStatus }, ownProps);
    };

    return mapStateToProps;
  };

  class HOChallengeResultsContainer extends React.Component<
    TOriginalProps & ChallengeContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
  > {
    public async componentDidMount(): Promise<void> {
      this.ensureHasChallengeData();
      await this.setupChallengeSubscription();
    }

    public async componentDidUpdate(): Promise<void> {
      this.ensureHasChallengeData();
      await this.setupChallengeSubscription();
    }

    public render(): JSX.Element | null {
      const challengeResultsProps = getChallengeResultsProps(
        this.props.challengeData && this.props.challengeData.challenge,
      );
      const challengeID = this.props.challengeID && this.props.challengeID.toString();

      return (
        <>
          <PresentationComponent {...challengeResultsProps} challengeID={challengeID} {...this.props} />
        </>
      );
    }

    private ensureHasChallengeData = (): void => {
      if (
        this.props.challengeID &&
        !this.props.challengeData &&
        !this.props.challengeDataRequestStatus &&
        !this.props.challengeDataRequestStatus
      ) {
        this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString()));
      }
    };

    private setupChallengeSubscription = async (): Promise<void> => {
      this.props.dispatch!(await setupRejectedListingLatestChallengeSubscription(this.props.listingAddress!));
    };
  }

  return connect(makeMapStateToProps)(HOChallengeResultsContainer);
};

/**
 * Generates a HO-Component Container for that gets the Challenge data
 * (challenger, reward pool, etc) * and passes those results to a
 * Presentation Component
 */
export const connectChallengePhase = <TChallengeContainerProps extends ChallengeContainerProps>(
  PhaseCardComponent:
    | React.ComponentClass<TChallengeContainerProps & ChallengePhaseProps>
    | React.StatelessComponent<TChallengeContainerProps & ChallengePhaseProps>,
) => {
  const mapStateToProps = (
    state: State,
    ownProps: ChallengeContainerProps,
  ): ChallengeContainerReduxProps & ChallengeContainerProps => {
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
      challengeID: challengeID!.toString(),
      challengeData,
      challengeDataRequestStatus,
      ...ownProps,
    };
  };

  class HOChallengePhaseContainer extends React.Component<
    TChallengeContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
  > {
    public componentDidUpdate(): void {
      if (this.props.challengeID && !this.props.challengeData && !this.props.challengeDataRequestStatus) {
        this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString()));
      }
    }

    public render(): JSX.Element | undefined {
      if (!this.props.challengeData) {
        return;
      }

      const challenge = this.props.challengeData.challenge;
      return (
        <PhaseCardComponent
          challenger={challenge!.challenger.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          {...this.props}
        />
      );
    }
  }

  return connect(mapStateToProps)(HOChallengePhaseContainer);
};
