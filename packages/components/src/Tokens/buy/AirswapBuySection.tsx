import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { TokenBuyFoundationBtnText, TokenAirswapExchangeTermsOfSaleText } from "../TokensTextComponents";
import { AirswapBuyCVL } from "../../Airswap";
import { TokenPurchaseSummary } from "../TokenPurchaseSummary";

const cvlPriceQuery = gql`
  query($usdToSpend: Float!) {
    storefrontEthPrice
    storefrontCvlPrice
    storefrontCvlQuoteUsd(usdToSpend: $usdToSpend)
  }
`;

export interface AirswapBuySectionProps {
  usdToSpend: number;
  ethToSpend: number;
  foundationAddress: string;
  network: string;
  onBuyComplete(): void;
}
export const AirswapBuySection = (props: AirswapBuySectionProps) => {
  const { usdToSpend, onBuyComplete, foundationAddress, network } = props;
  return (
    <>
      <Query query={cvlPriceQuery} variables={{ usdToSpend }}>
        {({ loading, error, data }) => {
          if (error) {
            return <div>error loading data</div>;
          }
          const totalTokens = data.storefrontCvlQuoteUsd;
          const pricePer = usdToSpend / data.storefrontCvlQuoteUsd;
          return (
            <>
              <TokenPurchaseSummary
                mode={"buy"}
                currencyCode="CVL"
                pricePer={pricePer}
                totalTokens={totalTokens}
                totalPrice={usdToSpend}
              />
              <AirswapBuyCVL
                network={network}
                buyCVLBtnText={<TokenBuyFoundationBtnText />}
                buyFromAddress={foundationAddress}
                onComplete={onBuyComplete}
                amount={totalTokens}
              />
              <TokenAirswapExchangeTermsOfSaleText />
            </>
          );
        }}
      </Query>
    </>
  );
};
