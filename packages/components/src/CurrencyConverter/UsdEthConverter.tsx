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
  fromValue?: string;
  onNotEnoughEthError?(error: boolean): void;
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
              fromValue={props.fromValue || "0"}
              currencyCodeFrom="USD"
              currencyLabelFrom="Enter USD Amount"
              currencyCodeTo="ETH"
              currencyLabelTo="Amount of ETH"
              displayErrorMsg={true}
              doConversion={async (usdAmount: number) => convertToETH(usdAmount, data.storefrontEthPrice)}
              onConversion={(usdValue, ethValue) => props.onConversion(usdValue, ethValue)}
              onNotEnoughEthError={props.onNotEnoughEthError}
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
