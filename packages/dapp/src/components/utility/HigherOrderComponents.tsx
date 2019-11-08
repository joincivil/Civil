import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "@joincivil/typescript-types";
import styled from "styled-components/macro";
import {
  EthAddress,
  ListingWrapper,
  WrappedChallengeData,
  AppealChallengeData,
  ParamPropChallengeData,
} from "@joincivil/core";
import {
  ChallengeResultsProps,
  ChallengePhaseProps,
  ProgressBarCountdownProps,
  PHASE_TYPE_NAMES,
  PHASE_TYPE_LABEL,
  PHASE_TYPE_FLAVOR_TEXT,
  AppealChallengeResultsProps,
  ErrorLoadingData,
} from "@joincivil/components";
import { getFormattedTokenBalance, Parameters } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { Query } from "react-apollo";
import {
  transformGraphQLDataIntoChallenge,
  CHALLENGE_QUERY,
  PARAMETERS_QUERY,
} from "../../helpers/queryTransformations";
import { getChallengeResultsProps, getAppealChallengeResultsProps } from "../../helpers/transforms";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { Map } from "immutable";
import { compose } from "redux";

export interface ListingContainerProps {
  listingAddress: EthAddress;
}

export interface ChallengeContainerProps {
  challengeID?: BigNumber | string;
  isProposalChallenge?: boolean;
}

export interface AppealChallengeContainerProps {
  appealChallengeID?: BigNumber | string;
}

export interface ChallengeContainerReduxProps {
  challengeData?: WrappedChallengeData;
  appealChallengeData?: AppealChallengeData;
  proposalChallengeData?: ParamPropChallengeData;
  challengeDataRequestStatus?: any;
  challengeState?: any;
  dispensationPct?: any;
  user: EthAddress;
}

export interface PhaseCountdownTimerProps {
  phaseType: string;
  listing?: ListingWrapper;
  challenge?: WrappedChallengeData;
}

export interface PhaseCountdownReduxProps {
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
    | React.FunctionComponent<TOriginalProps & ChallengeResultsProps>,
) => {
  const mapStateToProps = (state: State, ownProps: TOriginalProps): TOriginalProps & ChallengeContainerReduxProps => {
    const { user } = state.networkDependent;

    const userAcct = user.account;
    // Can't use spread here b/c of TS issue with spread and generics
    // https://github.com/Microsoft/TypeScript/pull/13288
    // tslint:disable-next-line:prefer-object-spread
    return Object.assign({}, ownProps, {
      user: userAcct.account,
    });
  };

  class HOChallengeResultsContainer extends React.Component<
    TOriginalProps & ChallengeContainerReduxProps & DispatchProp<any>
  > {
    public static contextType = CivilHelperContext;
    public context: CivilHelper;

    public render(): JSX.Element | null {
      return (
        <Query query={CHALLENGE_QUERY} variables={{ challengeID: this.props.challengeID }}>
          {({ loading, error, data }: any): JSX.Element | null => {
            if (loading) {
              return null;
            }
            if (error) {
              return null;
            }
            const { challengeID } = this.props;
            const challenge = transformGraphQLDataIntoChallenge(data.challenge);
            const challengeResultsProps = getChallengeResultsProps(challenge!) as ChallengeResultsProps;

            let appealPhaseProps = {};
            if (challenge && challenge.appeal) {
              appealPhaseProps = {
                appealRequested: !challenge.appeal.appealFeePaid.isZero(),
                appealGranted: challenge.appeal.appealGranted,
              };
            }
            let appealChallengePhaseProps = {};
            if (challenge && challenge.appeal && challenge.appeal.appealChallengeID) {
              appealChallengePhaseProps = {
                appealChallengeID: challenge.appeal.appealChallengeID.toString(),
              };
            }
            let appealChallengeResultsProps = {};
            if (challenge && challenge.appeal && challenge.appeal.appealChallenge) {
              appealChallengeResultsProps = getAppealChallengeResultsProps(
                challenge.appeal.appealChallenge,
              ) as AppealChallengeResultsProps;
            }

            return (
              <>
                <PresentationComponent
                  {...this.props}
                  {...challengeResultsProps}
                  {...appealPhaseProps}
                  {...appealChallengePhaseProps}
                  {...appealChallengeResultsProps}
                  challengeID={challengeID!.toString()}
                />
              </>
            );
          }}
        </Query>
      );
    }
  }

  return connect(mapStateToProps)(HOChallengeResultsContainer);
};

const parametersArray = [
  Parameters.minDeposit,
  Parameters.pMinDeposit,
  Parameters.applyStageLen,
  Parameters.pApplyStageLen,
  Parameters.commitStageLen,
  Parameters.pCommitStageLen,
  Parameters.revealStageLen,
  Parameters.pRevealStageLen,
  Parameters.dispensationPct,
  Parameters.pDispensationPct,
  Parameters.voteQuorum,
  Parameters.pVoteQuorum,
  Parameters.challengeAppealLen,
  Parameters.challengeAppealCommitLen,
  Parameters.challengeAppealRevealLen,
];

export interface ParametersProps {
  parameters: Map<string, BigNumber>;
}

export const connectParameters = <TOriginalProps extends any>(
  PresentationComponent: React.ComponentClass<TOriginalProps & ParametersProps>,
) => {
  class ParametersContainer extends React.Component<TOriginalProps> {
    public render(): JSX.Element {
      return (
        <Query query={PARAMETERS_QUERY} variables={{ input: parametersArray }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <></>;
            } else if (error) {
              console.error("error retrieving parameters: ", error);
              return <ErrorLoadingData />;
            }
            const parameters = Map<string, BigNumber>(
              data.parameters.map(param => {
                return [param.paramName, new BigNumber(param.value)];
              }),
            );
            return <PresentationComponent parameters={parameters} {...this.props} />;
          }}
        </Query>
      );
    }
  }

  return ParametersContainer;
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
    const { govtParameters } = state.networkDependent;

    return {
      ...ownProps,
      govtParameters,
    };
  };

  class HOContainer extends React.Component<
    PhaseCountdownTimerProps & PhaseCountdownReduxProps & DispatchProp<any> & ParametersProps
  > {
    public static contextType = CivilHelperContext;
    public context: CivilHelper;

    public render(): JSX.Element | null {
      let displayLabel: string | React.FunctionComponent = "";
      let flavorText;
      let endTime = 0;
      let totalSeconds = 0;

      const { phaseType, challenge, parameters, govtParameters } = this.props;

      switch (phaseType) {
        case PHASE_TYPE_NAMES.CHALLENGE_COMMIT_VOTE:
          if (challenge) {
            endTime = challenge.challenge.poll.commitEndDate.toNumber();
          }
          totalSeconds = parameters.get(Parameters.commitStageLen).toNumber();
          break;
        case PHASE_TYPE_NAMES.CHALLENGE_REVEAL_VOTE:
          if (challenge) {
            endTime = challenge.challenge.poll.revealEndDate.toNumber();
          }
          totalSeconds = parameters.get(Parameters.revealStageLen).toNumber();
          break;
        case PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_REQUEST:
          if (challenge) {
            endTime = challenge.challenge.requestAppealExpiry.toNumber();
          }
          totalSeconds = govtParameters.requestAppealLen;
          break;
        case PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_JUDGEMENT:
          if (challenge && challenge.challenge.appeal) {
            endTime = challenge.challenge.appeal.appealPhaseExpiry.toNumber();
          }
          totalSeconds = govtParameters.judgeAppealLen;
          break;
        case PHASE_TYPE_NAMES.CHALLENGE_AWAITING_APPEAL_CHALLENGE:
          if (challenge && challenge.challenge.appeal) {
            endTime = challenge.challenge.appeal.appealOpenToChallengeExpiry.toNumber();
          }
          totalSeconds = parameters.get(Parameters.challengeAppealLen).toNumber();
          break;
        case PHASE_TYPE_NAMES.APPEAL_CHALLENGE_COMMIT_VOTE:
          if (challenge && challenge.challenge.appeal && challenge.challenge.appeal.appealChallenge) {
            endTime = challenge.challenge.appeal.appealChallenge.poll.commitEndDate.toNumber();
          }
          totalSeconds = parameters.get(Parameters.challengeAppealCommitLen).toNumber();
          break;
        case PHASE_TYPE_NAMES.APPEAL_CHALLENGE_REVEAL_VOTE:
          if (challenge && challenge.challenge.appeal && challenge.challenge.appeal.appealChallenge) {
            endTime = challenge.challenge.appeal.appealChallenge.poll.revealEndDate.toNumber();
          }
          totalSeconds = parameters.get(Parameters.challengeAppealRevealLen).toNumber();
          break;
      }

      if (phaseType) {
        displayLabel = PHASE_TYPE_LABEL[this.props.phaseType] || "";
        flavorText = PHASE_TYPE_FLAVOR_TEXT[this.props.phaseType] || "";
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

  return compose(
    connectParameters,
    connect(mapStateToProps),
  )(HOContainer);
};

/**
 * Generates a HO-Component Container for that gets the Challenge data
 * (challenger, reward pool, etc) * and passes those results to a
 * Presentation Component
 */
export const connectChallengePhase = <TChallengeContainerProps extends ChallengeContainerProps>(
  PhaseCardComponent:
    | React.ComponentClass<TChallengeContainerProps & ChallengePhaseProps>
    | React.FunctionComponent<TChallengeContainerProps & ChallengePhaseProps>,
) => {
  const mapStateToProps = (
    state: State,
    ownProps: ChallengeContainerProps,
  ): ChallengeContainerReduxProps & ChallengeContainerProps => {
    const { user } = state.networkDependent;
    const userAcct = user.account;
    return {
      ...ownProps,
      challengeID: ownProps.challengeID!.toString(),
      user: userAcct.account,
    };
  };

  class HOChallengePhaseContainer extends React.Component<
    TChallengeContainerProps & ChallengeContainerReduxProps & DispatchProp<any> & ParametersProps
  > {
    public static contextType = CivilHelperContext;
    public context: CivilHelper;

    public render(): JSX.Element | undefined {
      const dispensationPct = this.props.parameters.get(Parameters.dispensationPct).toString();
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
            return (
              <>
                <PhaseCardComponent
                  {...this.props}
                  challenger={challenge!.challenger.toString()}
                  isViewingUserChallenger={challenge!.challenger.toString() === this.props.user}
                  rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
                  stake={getFormattedTokenBalance(challenge!.stake)}
                  dispensationPct={dispensationPct}
                />
              </>
            );
          }}
        </Query>
      );
    }
  }

  return compose(
    connectParameters,
    connect(mapStateToProps),
  )(HOChallengePhaseContainer);
};
