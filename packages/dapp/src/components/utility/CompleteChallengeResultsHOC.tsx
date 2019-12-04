import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Query } from "react-apollo";
import { ChallengeResultsProps, AppealChallengeResultsProps, AppealChallengePhaseProps } from "@joincivil/components";

import { State } from "../../redux/reducers";
import { transformGraphQLDataIntoChallenge, CHALLENGE_QUERY } from "@joincivil/utils";
import { getChallengeResultsProps, getAppealChallengeResultsProps } from "../../helpers/transforms";

import { ChallengeContainerProps, ChallengeContainerReduxProps } from "./HigherOrderComponents";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import ErrorLoadingDataMsg from "./ErrorLoadingData";

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
  const mapStateToProps = (state: State, ownProps: TOriginalProps): TOriginalProps & ChallengeContainerReduxProps => {
    const { user } = state.networkDependent;
    let challengeID = ownProps.challengeID;
    if (challengeID) {
      challengeID = (challengeID.toString && challengeID.toString()) || challengeID;
    }

    const userAcct = user.account;
    // Can't use spread here b/c of TS issue with spread and generics
    // https://github.com/Microsoft/TypeScript/pull/13288
    // tslint:disable-next-line:prefer-object-spread
    return Object.assign({}, ownProps, {
      challengeID,
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
              console.error("Eror loading Challenge Results. challengeID: ", this.props.challengeID);
              return <ErrorLoadingDataMsg />;
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
    }
  }

  return connect(mapStateToProps)(HOChallengeResultsContainer);
};
