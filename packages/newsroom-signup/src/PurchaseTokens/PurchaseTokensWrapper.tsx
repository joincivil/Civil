import * as React from "react";
import { parametersArray, PARAMETERS_QUERY } from "../ParameterizerHOC";
import { PurchaseTokens, PurchaseTokensExternalProps } from "./index";
import { Query } from "react-apollo";
import { BigNumber } from "@joincivil/typescript-types";
import { withRouter } from "react-router-dom";

class PurchaseTokensWrapperComponent extends React.Component<PurchaseTokensExternalProps> {
  public render(): JSX.Element {
    return (<Query query={PARAMETERS_QUERY} variables={{ input: parametersArray }}>

      {({ loading, error, data }: { loading?: any, error?: any, data: any }) => {
        if (loading || error) {
          return <></>
        }
        const minDeposit = new BigNumber(data.parameters[0].value);
        const applyStageLen = new BigNumber(data.parameters[1].value);

        return <PurchaseTokens {...this.props} minDeposit={minDeposit} applyStageLen={applyStageLen} />
      }}
    </Query>)
  }
}

export const PurchaseTokensWrapper = withRouter(PurchaseTokensWrapperComponent);
