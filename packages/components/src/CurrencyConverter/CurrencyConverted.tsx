import * as React from "react";
import { CurrencyConvertedBox, CurrencyCode } from "./CurrencyConverterStyledComponents";

export interface CurrencyConvertedProps {
  currencyCode?: string | JSX.Element;
  currentPrice?: number;
  cvlAmount?: number;
}

export interface CurrencyConvertedStates {
  convertedCurrency?: number;
}

export class CurrencyConverted extends React.Component<CurrencyConvertedProps, CurrencyConvertedStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      convertedCurrency: this.props.currentPrice || 0,
    };
  }

  public render(): JSX.Element {
    return (
      <CurrencyConvertedBox>
        {this.props.currentPrice}
        <CurrencyCode>{this.props.currencyCode}</CurrencyCode>
      </CurrencyConvertedBox>
    );
  }
}
