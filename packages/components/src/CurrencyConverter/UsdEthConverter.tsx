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
  displayErrorMsg?: boolean;
  className?: string;
  onNotEnoughEthError?(error: boolean): void;
  onConversion(usdValue: number, ethValue: number): void;
}
export const UsdEthConverter = (props: UsdEthConverterProps) => {
  return (
    <Query<any> query={ethPriceQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div />;
        }
        return (
          <>
            <CurrencyConverter
              className={props.className}
              fromValue={props.fromValue}
              currencyCodeFrom="USD"
              currencyLabelFrom="Enter USD Amount"
              currencyCodeTo="ETH"
              currencyLabelTo="Amount of ETH"
              displayErrorMsg={props.displayErrorMsg !== false}
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
