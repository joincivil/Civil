import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  CurrencyConverterContain,
  CurrencyContain,
  CurrencyLabel,
  StyledCurrencyInputWithButton,
  CurrencyIconContain,
} from "./CurrencyConverterStyledComponents";
import { ExchangeArrowsIcon } from "../icons/ExchangeArrowsIcon";
import { CurrencyInputWithButton } from "../input/InputWithButton";
import { CurrencyConverted } from "./CurrencyConverted";

const priceQuery = gql`
  query {
    storefrontEthPrice
    storefrontCvlPrice
    storefrontCvlQuoteUsd(usdToSpend: 100.1)
    storefrontCvlQuoteTokens(tokensToBuy: 100)
  }
`;

export interface CurrencyConverterProps {
  currencyLabelLeft?: string | JSX.Element;
  currencyLabelRight?: string | JSX.Element;
  currentUsdPrice?: number;
  currentEthPrice?: number;
  currentCvlPrice?: number;
  usdEthExchangeRate?: number;
}

export interface CurrencyConverterStates {
  currentUsdPrice?: number;
  currentEthPrice?: number;
  currentCvlPrice?: number;
  usdEthExchangeRate?: number;
}

export class CurrencyConverter extends React.Component<CurrencyConverterProps, CurrencyConverterStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentUsdPrice: 0,
      currentEthPrice: 0,
      currentCvlPrice: 0,
      usdEthExchangeRate: this.props.usdEthExchangeRate || 0,
    };
  }

  public render(): JSX.Element {
    return (
      <Query query={priceQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return "Loading...";
          }
          if (error) {
            return `Error! ${JSON.stringify(error)}`;
          }

          return (
            <CurrencyConverterContain>
              <CurrencyContain>
                <CurrencyLabel>{this.props.currencyLabelLeft}</CurrencyLabel>
                <StyledCurrencyInputWithButton>
                  <CurrencyInputWithButton
                    placeholder="0.00"
                    name="Convert currency"
                    buttonText="Convert"
                    icon={<>USD</>}
                    onButtonClick={() => this.getEthPrice}
                  />
                </StyledCurrencyInputWithButton>
              </CurrencyContain>
              <CurrencyIconContain>
                <ExchangeArrowsIcon />
              </CurrencyIconContain>
              <CurrencyContain>
                <CurrencyLabel>{this.props.currencyLabelRight}</CurrencyLabel>
                <CurrencyConverted currentPrice={data.storefrontEthPrice} currencyCode={"ETH"} />
              </CurrencyContain>
            </CurrencyConverterContain>
          );
        }}
      </Query>
    );
  }

  private getEthPrice = (ev: any) => {
    console.log("click");
    console.log(ev.target.value);
    this.setState({ currentEthPrice: this.state.currentEthPrice, currentCvlPrice: this.state.currentCvlPrice });
  };
}
