import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Query } from "react-apollo";
import { ChallengeResultsProps, AppealChallengeResultsProps, AppealChallengePhaseProps } from "@joincivil/components";

import { State } from "../../redux/reducers";
import { fetchAndAddChallengeData } from "../../redux/actionCreators/challenges";
import { transformGraphQLDataIntoChallenge, CHALLENGE_QUERY } from "../../helpers/queryTransformations";
import { getChallengeResultsProps, getAppealChallengeResultsProps } from "../../helpers/transforms";

import {
  ChallengeContainerProps,
  ChallengeContainerReduxProps,
  GraphQLizableComponentProps,
} from "./HigherOrderComponents";

/**
 * Given a `challengeID`, this container fetches the complete challenge data, including appeal and appeal challenge data from the Redux store or GraphQL
 * then extracts and passes props for rendering a Challenge Results component
 */
export const connectCompleteChallengeResults = <TOriginalProps extends ChallengeContainerProps>(
  PresentationComponent:
    | React.ComponentClass<
        TOriginalProps & ChallengeResultsProps & AppealChallengePhaseProps & AppealChallengeResultsProps
      >
    | React.FunctionComponent<
        TOriginalProps & ChallengeResultsProps & AppealChallengePhaseProps & AppealChallengeResultsProps
      >,
) => {
  const mapStateToProps = (
    state: State,
    ownProps: TOriginalProps,
  ): TOriginalProps & ChallengeContainerReduxProps & GraphQLizableComponentProps => {
    const { challenges, challengesFetching, user } = state.networkDependent;
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
    const userAcct = user.account;
    // Can't use spread here b/c of TS issue with spread and generics
    // https://github.com/Microsoft/TypeScript/pull/13288
    // tslint:disable-next-line:prefer-object-spread
    return Object.assign({}, ownProps, {
      challengeID,
      challengeData,
      challengeDataRequestStatus,
      useGraphQL,
      user: userAcct.account,
    });
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
              const challengeID = this.props.challengeID && this.props.challengeID.toString();
              return (
                <PresentationComponent
                  {...this.props}
                  {...challengeResultsProps}
                  {...appealPhaseProps}
                  {...appealChallengePhaseProps}
                  {...appealChallengeResultsProps}
                  challengeID={challengeID}
                />
              );
            }}
          </Query>
        );
      } else {
        if (!this.props.challengeData) {
          return null;
        }

        const challengeResultsProps = getChallengeResultsProps(
          this.props.challengeData.challenge,
        ) as ChallengeResultsProps;

        let appealPhaseProps = {};
        if (this.props.challengeData && this.props.challengeData.challenge.appeal) {
          appealPhaseProps = {
            appealRequested: !this.props.challengeData.challenge.appeal.appealFeePaid.isZero(),
            appealGranted: this.props.challengeData.challenge.appeal.appealGranted,
          };
        }
        let appealChallengePhaseProps = {};
        if (
          this.props.challengeData &&
          this.props.challengeData.challenge.appeal &&
          this.props.challengeData.challenge.appeal.appealChallengeID
        ) {
          appealChallengePhaseProps = {
            appealChallengeID: this.props.challengeData.challenge.appeal.appealChallengeID.toString(),
          };
        }
        let appealChallengeResultsProps = {};
        if (
          this.props.challengeData &&
          this.props.challengeData.challenge.appeal &&
          this.props.challengeData.challenge.appeal.appealChallenge
        ) {
          appealChallengeResultsProps = getAppealChallengeResultsProps(
            this.props.challengeData.challenge.appeal.appealChallenge,
          ) as AppealChallengeResultsProps;
        }
        const challengeID = this.props.challengeID && this.props.challengeID.toString();

        return (
          <PresentationComponent
            {...this.props}
            {...challengeResultsProps}
            {...appealPhaseProps}
            {...appealChallengePhaseProps}
            {...appealChallengeResultsProps}
            challengeID={challengeID}
          />
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
