import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { CurrencyConverter } from "./CurrencyConverter";

const ethPriceQuery = gql`
  query {
    storefrontEthPrice
  }
`;

export interface UsdEthConverterProps {
  onConversion(usdValue: number, ethValue: number): void;
}
export const UsdEthConverter = (props: UsdEthConverterProps) => {
  return (
    <Query query={ethPriceQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div />;
        }
        return (
          <>
            <CurrencyConverter
              currencyCodeFrom="USD"
              currencyLabelFrom="Enter USD Amount"
              currencyCodeTo="ETH"
              currencyLabelTo="Amount of ETH"
              errorMsg={"You don’t have enough ETH. Adjust the amount or buy more ETH. Check our FAQ to learn more."}
              getError={true}
              doConversion={async (usdAmount: number) => convertToETH(usdAmount, data.storefrontEthPrice)}
              onConversion={(usdValue, ethValue) => props.onConversion(usdValue, ethValue)}
            />
          </>
        );
      }}
    </Query>
  );

  async function convertToETH(usdAmount: number, storefrontEthPrice: number): Promise<number> {
    const newConvertedEth = usdAmount / storefrontEthPrice;
    return newConvertedEth;
  }
};
