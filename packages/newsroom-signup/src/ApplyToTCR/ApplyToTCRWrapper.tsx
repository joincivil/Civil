import * as React from "react";
import { parametersArray, PARAMETERS_QUERY } from "../ParameterizerHOC";
import { ApplyToTCRStep, ApplyToTCRStepOwnProps } from "./index";
import { Query } from "react-apollo";
import { BigNumber } from "@joincivil/typescript-types";

class ApplyToTCRWrapperComponent extends React.Component < ApplyToTCRStepOwnProps  > {
  public render(): JSX.Element {
    return (<Query query={PARAMETERS_QUERY} variables={{ input: parametersArray }}>

      {({ loading, error, data }: { loading?: any, error?: any, data: any }) => {
        if (loading || error) {
          return <></>
        }
        const minDeposit = new BigNumber(data.parameters[0].value);
        const applyStageLen = new BigNumber(data.parameters[1].value);

        return <ApplyToTCRStep {...this.props} minDeposit={minDeposit} applyStageLen={applyStageLen} />
      }}
      </Query>)
  }
}

export const ApplyToTCRWrapper = ApplyToTCRWrapperComponent;
