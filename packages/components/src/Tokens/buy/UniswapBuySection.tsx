import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { UniswapBuy } from "../buy/UniswapBuy";

const ethPriceQuery = gql`
  query {
    storefrontEthPrice
  }
`;

export interface UniswapBuySectionProps {
  ethToSpend: number;
  usdToSpend: number;
  onBuyComplete(): void;
}
export const UniswapBuySection = (props: UniswapBuySectionProps) => {
  return (
    <Query<any> query={ethPriceQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div />;
        }
        return (
          <>
            <div>
              <UniswapBuy
                usdToSpend={props.usdToSpend}
                ethToSpend={props.ethToSpend}
                ethExchangeRate={data.storefrontEthPrice}
                onBuyComplete={props.onBuyComplete}
              />
            </div>
          </>
        );
      }}
    </Query>
  );
};
