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

const ethPriceQuery = gql`
  query {
    storefrontEthPrice
  }
`;

const cvlPriceQuery = gql`
  query($usdToSpend: Float!) {
    storefrontCvlPrice
    storefrontCvlQuoteUsd(usdToSpend: $usdToSpend)
  }
`;

export interface CurrencyConverterProps {
  currencyLabelLeft?: string | JSX.Element;
  currencyLabelRight?: string | JSX.Element;
}

export interface CurrencyConverterStates {
  userInputUsdPrice: number;
  convertedEth: number;
  convertedCvl: number;
}

export class UsdEthCvlConverter extends React.Component<CurrencyConverterProps, CurrencyConverterStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      userInputUsdPrice: 0,
      convertedEth: 0,
      convertedCvl: 0,
    };
  }

  public render(): JSX.Element {
    const usdToSpend = this.state.convertedCvl;
    // TODO:Sarah error messaging
    return (
      <CurrencyConverterSection>
        <CurrencyConverterContain>
          <CurrencyContain>
            <CurrencyLabel>{this.props.currencyLabelLeft}</CurrencyLabel>
            <Query query={ethPriceQuery}>
              {({ loading, error, data }) => {
                return (
                  <>
                    <StyledCurrencyInputWithButton>
                      <CurrencyInputWithButton
                        placeholder="0.00"
                        name="Convert currency"
                        buttonText="Convert"
                        onChange={this.getUsdValue}
                        icon={<>USD</>}
                        onButtonClick={() => this.convertCurrencies(data.storefrontEthPrice)}
                      />
                    </StyledCurrencyInputWithButton>
                  </>
                );
              }}
            </Query>
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
          <Query query={cvlPriceQuery} variables={{ usdToSpend }}>
            {({ loading, error, data }) => {
              return (
                <>
                  <CurrencyCVLPriceText pricePerCvl={data.storefrontCvlPrice} totalPrice={data.storefrontCvlQuoteUsd} />
                </>
              );
            }}
          </Query>
        </CurrencyCalcCVL>
      </CurrencyConverterSection>
    );
  }

  private getUsdValue = (name: string, value: string): void => {
    const newUserInputUsdPrice = null ? "0" : value;
    this.setState({ userInputUsdPrice: parseFloat(newUserInputUsdPrice) });
  };

  private convertCurrencies = (ethVal: number) => {
    const usdValue = this.state.userInputUsdPrice;
    const newConvertedEth = usdValue / ethVal;
    this.setState({ convertedEth: newConvertedEth, convertedCvl: usdValue });
  };
}
