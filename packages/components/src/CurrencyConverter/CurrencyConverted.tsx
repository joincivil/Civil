import * as React from "react";
import { CurrencyConvertedBox, CurrencyCode } from "./CurrencyConverterStyledComponents";

export interface CurrencyConvertedProps {
  currencyCode?: string | JSX.Element;
  currenctPrice?: number;
}

export interface CurrencyConvertedStates {
  convertedCurrency?: number;
}

export class CurrencyConverted extends React.Component<CurrencyConvertedProps, CurrencyConvertedStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      convertedCurrency: this.props.currenctPrice || 0,
    };
  }

  public render(): JSX.Element {
    return (
      <CurrencyConvertedBox>
        {this.props.currenctPrice}
        <CurrencyCode>{this.props.currencyCode}</CurrencyCode>
      </CurrencyConvertedBox>
    );
  }
}
