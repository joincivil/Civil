import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { CurrencyConverterSection, CurrencyCalcCVL } from "./CurrencyConverterStyledComponents";
import { CurrencyCVLPriceText } from "./CurrencyConverterTextComponents";
import { UsdEthConverter } from "./UsdEthConverter";

const cvlPriceQuery = gql`
  query($usdToSpend: Float!) {
    storefrontCvlPrice
    storefrontCvlQuoteUsd(usdToSpend: $usdToSpend)
  }
`;

export interface CurrencyConverterProps {
  currencyLabelLeft?: string | JSX.Element;
  currencyLabelRight?: string | JSX.Element;
  onConversion(usdValue: number, ethValue: number): void;
  onCVLToBuyUpdate(cvlToBuy: number): void;
}

export interface CurrencyConverterStates {
  usdToSpend: number;
  convertedEth: number;
}

export class UsdEthCvlConverter extends React.Component<CurrencyConverterProps, CurrencyConverterStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      usdToSpend: 0,
      convertedEth: 0,
    };
  }

  public render(): JSX.Element {
    const usdToSpend = this.state.usdToSpend;
    const updateConversion = this.updateConversion.bind(this);

    return (
      <CurrencyConverterSection>
        <UsdEthConverter onConversion={updateConversion} />
        <CurrencyCalcCVL>
          <Query query={cvlPriceQuery} variables={{ usdToSpend }}>
            {({ loading, error, data }) => {
              return (
                <CurrencyCVLPriceText pricePerCvl={data.storefrontCvlPrice} totalPrice={data.storefrontCvlQuoteUsd} />
              );
            }}
          </Query>
        </CurrencyCalcCVL>
      </CurrencyConverterSection>
    );
  }

  private updateConversion(usdValue: number, ethValue: number): void {
    this.setState({ usdToSpend: usdValue });
    this.props.onConversion(usdValue, ethValue);
  }
}
