import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  CurrencyConverterSection,
  CurrencyConverterContain,
  CurrencyContain,
  CurrencyLabel,
  StyledCurrencyInputWithButton,
  CurrencyIconContain,
  CurrencyCalcCVL,
} from "./CurrencyConverterStyledComponents";
import { CurrencyCVLPriceText } from "./CurrencyConverterTextComponents";
import { ExchangeArrowsIcon } from "../icons/ExchangeArrowsIcon";
import { CurrencyInputWithButton } from "../input/InputWithButton";
import { CurrencyConverted } from "./CurrencyConverted";

const priceQuery = gql`
  query {
    storefrontEthPrice
    storefrontCvlPrice
  }
`;

export interface CurrencyConverterProps {
  currencyLabelLeft?: string | JSX.Element;
  currencyLabelRight?: string | JSX.Element;
}

export interface CurrencyConverterStates {
  userInputUsdPrice: string;
  convertedEth: number;
  convertedCvl: number;
}

export class CurrencyConverter extends React.Component<CurrencyConverterProps, CurrencyConverterStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      userInputUsdPrice: "0",
      convertedEth: 0,
      convertedCvl: 0,
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
            <CurrencyConverterSection>
              <CurrencyConverterContain>
                <CurrencyContain>
                  <CurrencyLabel>{this.props.currencyLabelLeft}</CurrencyLabel>
                  <StyledCurrencyInputWithButton>
                    <CurrencyInputWithButton
                      placeholder="0.00"
                      name="Convert currency"
                      buttonText="Convert"
                      onChange={this.getUsdValue}
                      icon={<>USD</>}
                      onButtonClick={() => this.convertCurrencies(data.storefrontEthPrice, data.storefrontCvlPrice)}
                    />
                  </StyledCurrencyInputWithButton>
                </CurrencyContain>
                <CurrencyIconContain>
                  <ExchangeArrowsIcon />
                </CurrencyIconContain>
                <CurrencyContain>
                  <CurrencyLabel>{this.props.currencyLabelRight}</CurrencyLabel>
                  <CurrencyConverted currentPrice={this.state.convertedEth} currencyCode={"ETH"} />
                </CurrencyContain>
              </CurrencyConverterContain>
              <CurrencyCalcCVL>
                <CurrencyCVLPriceText pricePerCvl={data.storefrontCvlPrice} totalPrice={this.state.convertedCvl} />
              </CurrencyCalcCVL>
            </CurrencyConverterSection>
          );
        }}
      </Query>
    );
  }

  private getUsdValue = (name: string, value: string): void => {
    const newUserInputUsdPrice = null ? "0" : value;
    this.setState({ userInputUsdPrice: newUserInputUsdPrice });
  };

  private convertCurrencies = (ethVal: number, cvlVal: number) => {
    const usdValue = parseFloat(this.state.userInputUsdPrice);
    const newConvertedEth = usdValue / ethVal;
    const newConvertedCvl = usdValue / cvlVal;
    this.setState({ convertedEth: newConvertedEth, convertedCvl: newConvertedCvl });
  };
}
