import * as React from "react";
import { BigNumber } from "@joincivil/typescript-types"
import { Parameters } from "@joincivil/utils"
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const parametersArray = [
  Parameters.minDeposit,
  Parameters.applyStageLen,
]

export interface SignupParametersProps {
  applyStageLen: BigNumber;
  minDeposit: BigNumber;
}

export const PARAMETERS_QUERY = gql`
  query Parameters($input: [String!]) {
    parameters: parameters(paramNames: $input) {
      paramName
      value
    }
  }
`;

export const connectSignupParameters = <TOriginalProps extends any>(
  PresentationComponent:
    | React.ComponentClass<TOriginalProps & SignupParametersProps>
    | React.FunctionComponent<TOriginalProps & SignupParametersProps>, ) => {
  class ParametersContainer extends React.Component<TOriginalProps> {
    public render(): JSX.Element {
      return (<Query query={PARAMETERS_QUERY} variables={{ input: parametersArray }}>

        {({ loading, error, data }: { loading?: any, error?: any, data: any}) => {
          if (loading || error) {
            return <></>
          }

          const minDeposit = new BigNumber(data.parameters[0].value);
          const applyStageLen = new BigNumber(data.parameters[0].value);
          return <PresentationComponent minDeposit={minDeposit} applyStageLen={applyStageLen} {...this.props} />
        }}
      </Query>)
    }
  }

  return ParametersContainer;
}
